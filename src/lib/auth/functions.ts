import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders, getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";
import { getAuth, isGoogleConfigured } from "@/lib/auth/auth.server";
import { audit } from "@/lib/auth/audit.server";
import { loadSessionInfo, requireRole, requireSession } from "@/lib/auth/guard.server";
import { getPrisma, isDatabaseConfigured } from "@/lib/db.server";
import { deleteObject, isStorageConfigured, putObject, signedReadUrl } from "@/lib/storage.server";
import { landingFor, ROLES } from "@/lib/auth/access";
import { changePasswordSchema, registerSchema, roleUpgradeSchema } from "@/lib/auth/schemas";

/* ------------------------------------------------------------------ */
/* Session                                                              */
/* ------------------------------------------------------------------ */

export const getSessionInfo = createServerFn({ method: "GET" }).handler(async () => {
  try {
    return await loadSessionInfo();
  } catch (error) {
    console.error("✗ Lecture de session :", error);
    return null;
  }
});

export const getAuthConfig = createServerFn({ method: "GET" }).handler(async () => ({
  enabled: isDatabaseConfigured() && Boolean(process.env.AUTH_SECRET),
  google: isGoogleConfigured(),
}));

/* ------------------------------------------------------------------ */
/* Inscription                                                          */
/* ------------------------------------------------------------------ */

export const registerAccount = createServerFn({ method: "POST" })
  .validator((input: unknown) => registerSchema.parse(input))
  .handler(async ({ data }) => {
    const prisma = getPrisma();
    const result = await getAuth().api.signUpEmail({
      body: {
        email: data.email,
        password: data.password,
        name: data.name,
        username: data.username,
        phone: data.phone,
      },
      headers: getRequestHeaders(),
    });
    const userId = result.user.id;

    if (data.profile === "ORGANIZER") {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { role: "ORGANIZER", status: "PENDING" },
        }),
        prisma.organizerProfile.create({
          data: { userId, organization: data.organization as string, position: data.position },
        }),
      ]);
    } else if (data.profile === "PROVIDER") {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { role: "PROVIDER", status: "PENDING" },
        }),
        prisma.providerProfile.create({
          data: {
            userId,
            businessName: data.businessName as string,
            category: data.category as string,
            address: data.address,
          },
        }),
      ]);
    } else {
      await prisma.touristProfile.upsert({
        where: { userId },
        create: { userId, country: data.country, company: data.company },
        update: { country: data.country, company: data.company },
      });
    }

    await audit("ACCOUNT_CREATED", {
      userId,
      ip: getRequestIP({ xForwardedFor: true }) ?? null,
      details: { profile: data.profile },
    });
    return { redirectTo: data.profile === "TOURIST" ? "/espace/touriste" : "/compte-en-attente" };
  });

/** Destination après connexion, selon le rôle et le statut. */
export const getPostLoginRedirect = createServerFn({ method: "GET" }).handler(async () => {
  const session = await loadSessionInfo();
  return session ? landingFor(session) : "/connexion";
});

/* ------------------------------------------------------------------ */
/* Mot de passe                                                         */
/* ------------------------------------------------------------------ */

export const changePassword = createServerFn({ method: "POST" })
  .validator((input: unknown) => changePasswordSchema.parse(input))
  .handler(async ({ data }) => {
    const session = await requireSession();
    await getAuth().api.changePassword({
      body: {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        revokeOtherSessions: true,
      },
      headers: getRequestHeaders(),
    });
    await getPrisma().user.update({
      where: { id: session.id },
      data: { mustChangePassword: false },
    });
    await audit("PASSWORD_CHANGED", { userId: session.id });
    return { redirectTo: landingFor({ ...session, mustChangePassword: false }) };
  });

/* ------------------------------------------------------------------ */
/* Demande de profil Organisateur / Prestataire (touriste existant)     */
/* ------------------------------------------------------------------ */

export const requestRoleUpgrade = createServerFn({ method: "POST" })
  .validator((input: unknown) => roleUpgradeSchema.parse(input))
  .handler(async ({ data }) => {
    const session = await requireRole("TOURIST");
    const prisma = getPrisma();
    if (data.role === "ORGANIZER") {
      await prisma.organizerProfile.upsert({
        where: { userId: session.id },
        create: { userId: session.id, organization: data.organization, position: data.position },
        update: { organization: data.organization, position: data.position },
      });
    } else {
      await prisma.providerProfile.upsert({
        where: { userId: session.id },
        create: {
          userId: session.id,
          businessName: data.businessName,
          category: data.category,
          address: data.address,
        },
        update: { businessName: data.businessName, category: data.category, address: data.address },
      });
    }
    await prisma.user.update({ where: { id: session.id }, data: { requestedRole: data.role } });
    await audit("ROLE_REQUESTED", { userId: session.id, details: { requestedRole: data.role } });
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Espaces : données de profil                                          */
/* ------------------------------------------------------------------ */

export const getMyProfile = createServerFn({ method: "GET" }).handler(async () => {
  const session = await requireRole("TOURIST", "ORGANIZER", "PROVIDER", "ADMIN");
  const user = await getPrisma().user.findUnique({
    where: { id: session.id },
    select: {
      name: true,
      email: true,
      username: true,
      phone: true,
      role: true,
      requestedRole: true,
      lastLoginAt: true,
      createdAt: true,
      touristProfile: true,
      organizerProfile: true,
      providerProfile: true,
    },
  });
  return user;
});

/* ------------------------------------------------------------------ */
/* Administration                                                       */
/* ------------------------------------------------------------------ */

export const getAdminDashboard = createServerFn({ method: "GET" }).handler(async () => {
  await requireRole("ADMIN");
  const prisma = getPrisma();
  const select = {
    id: true,
    name: true,
    email: true,
    username: true,
    role: true,
    status: true,
    requestedRole: true,
    createdAt: true,
    lastLoginAt: true,
    organizerProfile: { select: { organization: true, position: true } },
    providerProfile: {
      select: { businessName: true, category: true, labelStatus: true, labelExpiresAt: true },
    },
  } as const;
  const [pending, users, providers, logs] = await Promise.all([
    prisma.user.findMany({
      where: { OR: [{ status: "PENDING" }, { requestedRole: { not: null } }] },
      select,
      orderBy: { createdAt: "asc" },
    }),
    prisma.user.findMany({ select, orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.user.findMany({
      where: { role: "PROVIDER", status: "ACTIVE" },
      select: {
        ...select,
        providerProfile: {
          select: {
            ...select.providerProfile.select,
            documents: {
              select: { id: true, key: true, fileName: true, size: true, createdAt: true },
              orderBy: { createdAt: "desc" },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
      select: {
        id: true,
        action: true,
        ip: true,
        createdAt: true,
        details: true,
        user: { select: { email: true } },
      },
    }),
  ]);
  // Justificatifs des prestataires : liens de lecture signés (15 min), sans exposer la clé du bucket.
  const providersWithDocs = await Promise.all(
    providers.map(async (u) => ({
      ...u,
      documents: isStorageConfigured()
        ? await Promise.all(
            (u.providerProfile?.documents ?? []).map(async (d) => ({
              id: d.id,
              fileName: d.fileName,
              size: d.size,
              url: await signedReadUrl(d.key, d.fileName),
            })),
          )
        : [],
    })),
  );
  return {
    pending,
    users,
    providers: providersWithDocs,
    storage: isStorageConfigured(),
    logs: logs.map((l) => ({ ...l, details: l.details ? JSON.stringify(l.details) : null })),
  };
});

/* ------------------------------------------------------------------ */
/* Documents de labellisation (Neon Object Storage)                     */
/* ------------------------------------------------------------------ */

const MAX_DOCUMENT_BYTES = 5 * 1024 * 1024;
const MAX_DOCUMENTS = 10;
const ALLOWED_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

async function myProviderProfile(userId: string) {
  const profile = await getPrisma().providerProfile.findUnique({ where: { userId } });
  if (!profile) throw new Error("Profil prestataire introuvable.");
  return profile;
}

export const listMyDocuments = createServerFn({ method: "GET" }).handler(async () => {
  const session = await requireRole("PROVIDER");
  const profile = await myProviderProfile(session.id);
  const docs = await getPrisma().providerDocument.findMany({
    where: { providerProfileId: profile.id },
    orderBy: { createdAt: "desc" },
  });
  return {
    storage: isStorageConfigured(),
    documents: await Promise.all(
      docs.map(async (d) => ({
        id: d.id,
        fileName: d.fileName,
        contentType: d.contentType,
        size: d.size,
        createdAt: d.createdAt,
        url: isStorageConfigured() ? await signedReadUrl(d.key, d.fileName) : null,
      })),
    ),
  };
});

export const uploadProviderDocument = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    if (!(input instanceof FormData)) throw new Error("Formulaire invalide.");
    const file = input.get("file");
    if (!(file instanceof File) || file.size === 0) throw new Error("Aucun fichier reçu.");
    if (!ALLOWED_TYPES[file.type]) throw new Error("Formats acceptés : PDF, JPG, PNG ou WebP.");
    if (file.size > MAX_DOCUMENT_BYTES) throw new Error("Fichier trop volumineux (5 Mo maximum).");
    return file;
  })
  .handler(async ({ data: file }) => {
    const session = await requireRole("PROVIDER");
    if (!isStorageConfigured()) throw new Error("Le stockage de fichiers n'est pas configuré.");
    const prisma = getPrisma();
    const profile = await myProviderProfile(session.id);
    const count = await prisma.providerDocument.count({ where: { providerProfileId: profile.id } });
    if (count >= MAX_DOCUMENTS) throw new Error(`${MAX_DOCUMENTS} documents maximum.`);

    const safeName =
      file.name
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-zA-Z0-9._-]+/g, "-")
        .slice(-80) || `document.${ALLOWED_TYPES[file.type]}`;
    const key = `providers/${profile.id}/${crypto.randomUUID()}-${safeName}`;

    await putObject(key, new Uint8Array(await file.arrayBuffer()), file.type);
    try {
      const doc = await prisma.providerDocument.create({
        data: {
          providerProfileId: profile.id,
          key,
          fileName: file.name.slice(0, 200),
          contentType: file.type,
          size: file.size,
        },
      });
      await audit("DOCUMENT_UPLOADED", {
        userId: session.id,
        details: { documentId: doc.id, fileName: doc.fileName, size: doc.size },
      });
      return { id: doc.id };
    } catch (error) {
      // Pas d'objet orphelin si l'écriture en base échoue
      await deleteObject(key).catch(() => {});
      throw error;
    }
  });

export const deleteProviderDocument = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ id: z.string().min(1).max(64) }).parse(input))
  .handler(async ({ data }) => {
    const session = await requireRole("PROVIDER");
    const prisma = getPrisma();
    const profile = await myProviderProfile(session.id);
    const doc = await prisma.providerDocument.findFirst({
      where: { id: data.id, providerProfileId: profile.id },
    });
    if (!doc) throw new Error("Document introuvable.");
    await deleteObject(doc.key);
    await prisma.providerDocument.delete({ where: { id: doc.id } });
    await audit("DOCUMENT_DELETED", { userId: session.id, details: { fileName: doc.fileName } });
    return { ok: true };
  });

const userIdSchema = z.string().min(1).max(64);

export const adminReviewAccount = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({ userId: userIdSchema, approve: z.boolean() }).parse(input),
  )
  .handler(async ({ data }) => {
    const admin = await requireRole("ADMIN");
    const prisma = getPrisma();
    const user = await prisma.user.findUniqueOrThrow({ where: { id: data.userId } });

    if (user.requestedRole) {
      // Demande d'un touriste existant
      await prisma.user.update({
        where: { id: user.id },
        data: data.approve
          ? { role: user.requestedRole, requestedRole: null, status: "ACTIVE" }
          : { requestedRole: null },
      });
      await audit(data.approve ? "ROLE_CHANGED" : "ROLE_REQUEST_REJECTED", {
        userId: user.id,
        details: { by: admin.id, from: user.role, to: user.requestedRole },
      });
    } else {
      // Nouveau compte organisateur / prestataire en attente
      await prisma.user.update({
        where: { id: user.id },
        data: { status: data.approve ? "ACTIVE" : "SUSPENDED" },
      });
      await audit(data.approve ? "ACCOUNT_VALIDATED" : "ACCOUNT_REJECTED", {
        userId: user.id,
        details: { by: admin.id, role: user.role },
      });
    }
    return { ok: true };
  });

export const adminSetLabel = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        userId: userIdSchema,
        grant: z.boolean(),
        months: z.number().int().min(1).max(60).default(12),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const admin = await requireRole("ADMIN");
    const now = new Date();
    const expires = new Date(now);
    expires.setMonth(expires.getMonth() + data.months);
    await getPrisma().providerProfile.update({
      where: { userId: data.userId },
      data: data.grant
        ? { labelStatus: "GRANTED", labelGrantedAt: now, labelExpiresAt: expires }
        : { labelStatus: "REVOKED", labelExpiresAt: now },
    });
    await audit(data.grant ? "LABEL_GRANTED" : "LABEL_REVOKED", {
      userId: data.userId,
      details: { by: admin.id, expiresAt: data.grant ? expires.toISOString() : null },
    });
    return { ok: true };
  });

export const adminChangeRole = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({ userId: userIdSchema, role: z.enum(ROLES) }).parse(input),
  )
  .handler(async ({ data }) => {
    const admin = await requireRole("ADMIN");
    if (data.userId === admin.id) throw new Error("Vous ne pouvez pas modifier votre propre rôle.");
    const prisma = getPrisma();
    const user = await prisma.user.findUniqueOrThrow({ where: { id: data.userId } });
    await prisma.user.update({
      where: { id: data.userId },
      data: { role: data.role, requestedRole: null },
    });
    await audit("ROLE_CHANGED", {
      userId: data.userId,
      details: { by: admin.id, from: user.role, to: data.role },
    });
    return { ok: true };
  });

export const adminSetStatus = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({ userId: userIdSchema, status: z.enum(["ACTIVE", "PENDING", "SUSPENDED"]) })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const admin = await requireRole("ADMIN");
    if (data.userId === admin.id)
      throw new Error("Vous ne pouvez pas modifier votre propre statut.");
    const prisma = getPrisma();
    await prisma.user.update({
      where: { id: data.userId },
      data: {
        status: data.status,
        ...(data.status === "ACTIVE" ? { lockedUntil: null, failedLoginCount: 0 } : {}),
      },
    });
    if (data.status === "SUSPENDED") {
      // Déconnexion immédiate de toutes ses sessions
      await prisma.session.deleteMany({ where: { userId: data.userId } });
    }
    await audit("STATUS_CHANGED", {
      userId: data.userId,
      details: { by: admin.id, status: data.status },
    });
    return { ok: true };
  });
