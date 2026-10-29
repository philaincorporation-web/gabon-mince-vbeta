import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { username } from "better-auth/plugins/username";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import bcrypt from "bcryptjs";
import { getPrisma } from "@/lib/db.server";
import { audit, clientIp } from "@/lib/auth/audit.server";

export const MAX_FAILED_LOGINS = 5;
export const LOCK_DURATION_MS = 15 * 60 * 1000;
const BCRYPT_COST = 12;

const SIGN_IN_PATHS = new Set(["/sign-in/email", "/sign-in/username"]);

/** Retrouve l'utilisateur visé par une tentative de connexion (e-mail ou identifiant). */
async function findLoginTarget(body: unknown) {
  const b = (body ?? {}) as { email?: unknown; username?: unknown };
  const prisma = getPrisma();
  if (typeof b.email === "string" && b.email) {
    return {
      identifier: b.email,
      user: await prisma.user.findUnique({ where: { email: b.email.toLowerCase() } }),
    };
  }
  if (typeof b.username === "string" && b.username) {
    return {
      identifier: b.username,
      user: await prisma.user.findUnique({ where: { username: b.username.toLowerCase() } }),
    };
  }
  return { identifier: "", user: null };
}

function createAuth() {
  const prisma = getPrisma();
  const googleConfigured = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

  return betterAuth({
    appName: "GabonMICE",
    secret: process.env.AUTH_SECRET,
    baseURL: process.env.AUTH_URL,
    database: prismaAdapter(prisma, { provider: "postgresql" }),

    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      password: {
        hash: (password) => bcrypt.hash(password, BCRYPT_COST),
        verify: ({ hash, password }) => bcrypt.compare(password, hash),
      },
    },

    socialProviders: googleConfigured
      ? {
          google: {
            clientId: process.env.AUTH_GOOGLE_ID as string,
            clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
          },
        }
      : {},

    user: {
      additionalFields: {
        // input: false → impossible à définir depuis le navigateur (pas d'ADMIN à l'inscription).
        role: { type: "string", input: false, defaultValue: "TOURIST" },
        status: { type: "string", input: false, defaultValue: "ACTIVE" },
        mustChangePassword: { type: "boolean", input: false, defaultValue: false },
        phone: { type: "string", required: false },
      },
    },

    session: {
      // Session signée en cookie (équivalent du JWT demandé) : moins d'appels base.
      cookieCache: { enabled: true, maxAge: 5 * 60 },
    },

    rateLimit: {
      enabled: true,
      customRules: {
        "/sign-in/email": { window: 60, max: 10 },
        "/sign-in/username": { window: 60, max: 10 },
        "/sign-up/email": { window: 60, max: 5 },
      },
    },

    databaseHooks: {
      user: {
        create: {
          // Tout nouveau compte (y compris Google) démarre avec un profil touriste.
          after: async (user) => {
            await prisma.touristProfile.upsert({
              where: { userId: user.id },
              create: { userId: user.id },
              update: {},
            });
          },
        },
      },
      session: {
        create: {
          // Les comptes suspendus ne peuvent ouvrir aucune session (mot de passe ou Google).
          before: async (session) => {
            const user = await prisma.user.findUnique({
              where: { id: session.userId },
              select: { status: true },
            });
            if (user?.status === "SUSPENDED") {
              await audit("LOGIN_BLOCKED_SUSPENDED", { userId: session.userId });
              throw new APIError("FORBIDDEN", { message: "Ce compte est suspendu." });
            }
          },
        },
      },
    },

    hooks: {
      // Blocage après trop d'échecs, avant même de vérifier le mot de passe.
      before: createAuthMiddleware(async (ctx) => {
        if (!SIGN_IN_PATHS.has(ctx.path)) return;
        const { identifier, user } = await findLoginTarget(ctx.body);
        if (user?.lockedUntil && user.lockedUntil > new Date()) {
          await audit("LOGIN_LOCKED", {
            userId: user.id,
            ip: clientIp(ctx.headers),
            details: { identifier },
          });
          const minutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
          throw new APIError("TOO_MANY_REQUESTS", {
            message: `Trop de tentatives échouées. Réessayez dans ${minutes} min.`,
          });
        }
        if (user?.status === "SUSPENDED") {
          throw new APIError("FORBIDDEN", { message: "Ce compte est suspendu." });
        }
      }),

      // Journalisation des connexions et comptage des échecs.
      after: createAuthMiddleware(async (ctx) => {
        const ip = clientIp(ctx.headers);
        const newSession = ctx.context.newSession;

        if (SIGN_IN_PATHS.has(ctx.path)) {
          const { identifier, user } = await findLoginTarget(ctx.body);
          if (newSession) {
            await prisma.user.update({
              where: { id: newSession.user.id },
              data: { failedLoginCount: 0, lockedUntil: null, lastLoginAt: new Date() },
            });
            await audit("LOGIN", { userId: newSession.user.id, ip, details: { method: ctx.path } });
            return;
          }
          if (ctx.context.returned instanceof APIError && user) {
            // Échec de mot de passe (le blocage en cours est déjà journalisé avant).
            if (user.lockedUntil && user.lockedUntil > new Date()) return;
            const failed = user.failedLoginCount + 1;
            const locked = failed >= MAX_FAILED_LOGINS;
            await prisma.user.update({
              where: { id: user.id },
              data: locked
                ? { failedLoginCount: 0, lockedUntil: new Date(Date.now() + LOCK_DURATION_MS) }
                : { failedLoginCount: failed },
            });
            await audit(locked ? "LOGIN_LOCKED" : "LOGIN_FAILED", {
              userId: user.id,
              ip,
              details: { identifier, failedAttempts: failed },
            });
          } else if (ctx.context.returned instanceof APIError) {
            await audit("LOGIN_FAILED", { ip, details: { identifier, reason: "UNKNOWN_USER" } });
          }
          return;
        }

        // Connexion Google réussie
        if (ctx.path.startsWith("/callback/") && newSession) {
          await prisma.user.update({
            where: { id: newSession.user.id },
            data: { lastLoginAt: new Date() },
          });
          await audit("LOGIN", { userId: newSession.user.id, ip, details: { method: "google" } });
        }
      }),
    },

    plugins: [
      username({ minUsernameLength: 3, maxUsernameLength: 32 }),
      // Doit rester le dernier plugin : écrit les cookies dans les server functions.
      tanstackStartCookies(),
    ],
  });
}

let authInstance: ReturnType<typeof createAuth> | undefined;

export function getAuth() {
  authInstance ??= createAuth();
  return authInstance;
}

export function isGoogleConfigured() {
  return Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
}
