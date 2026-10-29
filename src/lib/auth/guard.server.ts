import { getRequestHeaders } from "@tanstack/react-start/server";
import { getAuth } from "@/lib/auth/auth.server";
import { getPrisma, isDatabaseConfigured } from "@/lib/db.server";
import { assertRole, type Role, type SessionInfo } from "@/lib/auth/access";

/**
 * Session de la requête en cours, avec rôle et statut relus en base
 * (jamais depuis le cache du cookie, pour qu'un changement admin s'applique tout de suite).
 */
export async function loadSessionInfo(): Promise<SessionInfo> {
  if (!isDatabaseConfigured()) return null;
  const session = await getAuth().api.getSession({
    headers: getRequestHeaders(),
    query: { disableCookieCache: true },
  });
  if (!session) return null;
  const user = await getPrisma().user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      role: true,
      status: true,
      requestedRole: true,
      mustChangePassword: true,
    },
  });
  return user ?? null;
}

export class AuthorizationError extends Error {
  constructor(public readonly reason: "UNAUTHENTICATED" | "FORBIDDEN") {
    super(reason === "UNAUTHENTICATED" ? "Connexion requise." : "Accès refusé.");
  }
}

/**
 * À appeler en tête de chaque server function protégée : revérifie le rôle
 * côté serveur, indépendamment de ce qu'affiche l'interface.
 */
export async function requireRole(...roles: Role[]) {
  const session = await loadSessionInfo();
  const check = assertRole(session, roles);
  if (!check.ok) throw new AuthorizationError(check.reason);
  return session as NonNullable<SessionInfo>;
}

/** Session obligatoire, quel que soit le rôle ou le statut (ex. changement de mot de passe). */
export async function requireSession() {
  const session = await loadSessionInfo();
  if (!session || session.status === "SUSPENDED") throw new AuthorizationError("UNAUTHENTICATED");
  return session;
}
