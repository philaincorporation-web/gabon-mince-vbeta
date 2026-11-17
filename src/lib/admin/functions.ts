import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { audit } from "@/lib/auth/audit.server";
import { assertKeepsSuperAdmin, loadAdmin, requirePermission } from "@/lib/admin/guard.server";
import { cleanPermissions, PERMISSIONS } from "@/lib/admin/permissions";
import { getPrisma } from "@/lib/db.server";
import { isStorageConfigured, signedReadUrl } from "@/lib/storage.server";

/**
 * Lectures et actions du back office /admin, par section.
 * Chaque fonction revérifie côté serveur la permission de sa section.
 */

const DAY = 24 * 60 * 60 * 1000;

const userSelect = {
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
    select: {
      businessName: true,
      category: true,
      labelStatus: true,
      labelExpiresAt: true,
      listingId: true,
    },
  },
} as const;

const pendingWhere = {
  OR: [{ status: "PENDING" as const }, { requestedRole: { not: null } }],
};

/** Labels accordés qui expirent dans les 30 prochains jours. */
const expiringWhere = () => ({
  labelStatus: "GRANTED" as const,
  labelExpiresAt: { gte: new Date(), lte: new Date(Date.now() + 30 * DAY) },
  user: { status: "ACTIVE" as const },
});

/* ------------------------------------------------------------------ */
/* Cadre : barre latérale                                               */
/* ------------------------------------------------------------------ */

/** Permissions de l'admin connecté et compteurs des pastilles de la barre latérale. */
export const getAdminContext = createServerFn({ method: "GET" }).handler(async () => {
  const admin = await loadAdmin();
  const prisma = getPrisma();
  const can = (p: (typeof PERMISSIONS)[number]) => admin.permissions.includes(p);
  const [demandes, validations, labels] = await Promise.all([
    can("demandes") ? prisma.demande.count({ where: { status: "NEW" } }) : 0,
    can("validations") ? prisma.user.count({ where: pendingWhere }) : 0,
    can("labels") ? prisma.providerProfile.count({ where: expiringWhere() }) : 0,
  ]);
  return {
    permissions: admin.permissions,
    isSuperAdmin: admin.isSuperAdmin,
    roleName: admin.role?.name ?? null,
    counts: { demandes, validations, labels },
  };
});

/* ------------------------------------------------------------------ */
/* Tableau de bord                                                      */
/* ------------------------------------------------------------------ */

export const getAdminSummary = createServerFn({ method: "GET" }).handler(async () => {
  const admin = await loadAdmin();
  const prisma = getPrisma();
  const can = (p: (typeof PERMISSIONS)[number]) => admin.permissions.includes(p);
  const [usersByRole, demandesByStatus, recentDemandes, expiring, recentLogs, labelled] =
    await Promise.all([
      can("utilisateurs")
        ? prisma.user.groupBy({ by: ["role"], _count: { _all: true } })
        : Promise.resolve([]),
      can("demandes")
        ? prisma.demande.groupBy({ by: ["status"], _count: { _all: true } })
        : Promise.resolve([]),
      can("demandes")
        ? prisma.demande.findMany({
            orderBy: { createdAt: "desc" },
            take: 5,
            select: {
              id: true,
              kind: true,
              subject: true,
              name: true,
              status: true,
              createdAt: true,
            },
          })
        : Promise.resolve([]),
      can("labels")
        ? prisma.providerProfile.findMany({
            where: expiringWhere(),
            orderBy: { labelExpiresAt: "asc" },
            take: 5,
            select: { businessName: true, labelExpiresAt: true },
          })
        : Promise.resolve([]),
      can("journal")
        ? prisma.auditLog.findMany({
            orderBy: { createdAt: "desc" },
            take: 6,
            select: {
              id: true,
              action: true,
              createdAt: true,
              user: { select: { email: true } },
            },
          })
        : Promise.resolve([]),
      can("labels")
        ? prisma.providerProfile.count({
            where: {
              labelStatus: "GRANTED",
              OR: [{ labelExpiresAt: null }, { labelExpiresAt: { gt: new Date() } }],
            },
          })
        : Promise.resolve(0),
    ]);
  return {
    usersByRole: Object.fromEntries(usersByRole.map((g) => [g.role, g._count._all])) as Record<
      string,
      number
    >,
    demandesByStatus: Object.fromEntries(
      demandesByStatus.map((g) => [g.status, g._count._all]),
    ) as Record<string, number>,
    recentDemandes,
    expiring,
    recentLogs,
    labelled,
  };
});

/* ------------------------------------------------------------------ */
/* Sections                                                             */
/* ------------------------------------------------------------------ */

export const getAdminPending = createServerFn({ method: "GET" }).handler(async () => {
  await requirePermission("validations");
  return getPrisma().user.findMany({
    where: pendingWhere,
    select: userSelect,
    orderBy: { createdAt: "asc" },
  });
});

export const getAdminProviders = createServerFn({ method: "GET" }).handler(async () => {
  await requirePermission("labels");
  const providers = await getPrisma().user.findMany({
    where: { role: "PROVIDER", status: "ACTIVE" },
    select: {
      ...userSelect,
      providerProfile: {
        select: {
          ...userSelect.providerProfile.select,
          documents: {
            select: { id: true, key: true, fileName: true, size: true, createdAt: true },
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  // Justificatifs : liens de lecture signés (15 min), sans exposer la clé du bucket.
  return Promise.all(
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
});

export const getAdminUsers = createServerFn({ method: "GET" }).handler(async () => {
  await requirePermission("utilisateurs");
  return getPrisma().user.findMany({
    select: userSelect,
    orderBy: { createdAt: "desc" },
    take: 500,
  });
});

export const getAdminLogs = createServerFn({ method: "GET" }).handler(async () => {
  await requirePermission("journal");
  const logs = await getPrisma().auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 300,
    select: {
      id: true,
      action: true,
      ip: true,
      createdAt: true,
      details: true,
      user: { select: { email: true } },
    },
  });
  return logs.map((l) => ({ ...l, details: l.details ? JSON.stringify(l.details) : null }));
});

/* ------------------------------------------------------------------ */
/* Équipe                                                               */
/* ------------------------------------------------------------------ */

export const getTeam = createServerFn({ method: "GET" }).handler(async () => {
  await requirePermission("equipe");
  const prisma = getPrisma();
  const [members, roles] = await Promise.all([
    prisma.user.findMany({
      where: { role: "ADMIN" },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        status: true,
        createdAt: true,
        lastLoginAt: true,
        adminRoleId: true,
      },
    }),
    prisma.adminRole.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  return { members, roles };
});

/** "" = Super admin ; sinon id d'un AdminRole. */
const adminRoleIdSchema = z.string().max(64);

async function resolveAdminRole(adminRoleId: string) {
  if (adminRoleId === "") return null;
  const role = await getPrisma().adminRole.findUnique({ where: { id: adminRoleId } });
  if (!role) throw new Error("Rôle introuvable.");
  return role.id;
}

export const addTeamMember = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({ email: z.email().max(254), adminRoleId: adminRoleIdSchema }).parse(input),
  )
  .handler(async ({ data }) => {
    const admin = await requirePermission("equipe");
    const prisma = getPrisma();
    const email = data.email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error(
        "Aucun compte avec cet e-mail. La personne doit d'abord créer son compte sur le site.",
      );
    }
    if (user.role === "ADMIN") throw new Error("Cette personne fait déjà partie de l'équipe.");
    if (user.status === "SUSPENDED") throw new Error("Ce compte est suspendu.");
    const adminRoleId = await resolveAdminRole(data.adminRoleId);
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "ADMIN", adminRoleId, requestedRole: null, status: "ACTIVE" },
    });
    await audit("TEAM_MEMBER_ADDED", {
      userId: user.id,
      details: { by: admin.id, from: user.role, adminRoleId },
    });
    return { ok: true, email: user.email };
  });

export const setTeamMemberRole = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({ userId: z.string().min(1).max(64), adminRoleId: adminRoleIdSchema }).parse(input),
  )
  .handler(async ({ data }) => {
    const admin = await requirePermission("equipe");
    if (data.userId === admin.id) throw new Error("Vous ne pouvez pas modifier votre propre rôle.");
    const prisma = getPrisma();
    const user = await prisma.user.findUniqueOrThrow({ where: { id: data.userId } });
    if (user.role !== "ADMIN") throw new Error("Cette personne ne fait pas partie de l'équipe.");
    const adminRoleId = await resolveAdminRole(data.adminRoleId);
    if (user.adminRoleId === null && adminRoleId !== null && user.status === "ACTIVE") {
      await assertKeepsSuperAdmin(user.id);
    }
    await prisma.user.update({ where: { id: user.id }, data: { adminRoleId } });
    await audit("TEAM_ROLE_CHANGED", {
      userId: user.id,
      details: { by: admin.id, from: user.adminRoleId, to: adminRoleId },
    });
    return { ok: true };
  });

export const removeTeamMember = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ userId: z.string().min(1).max(64) }).parse(input))
  .handler(async ({ data }) => {
    const admin = await requirePermission("equipe");
    if (data.userId === admin.id) throw new Error("Vous ne pouvez pas vous retirer vous-même.");
    const prisma = getPrisma();
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: data.userId },
      include: { providerProfile: true, organizerProfile: true },
    });
    if (user.role !== "ADMIN") throw new Error("Cette personne ne fait pas partie de l'équipe.");
    if (user.adminRoleId === null && user.status === "ACTIVE") {
      await assertKeepsSuperAdmin(user.id);
    }
    // Retour au profil d'origine quand il est connu, sinon touriste.
    const role = user.providerProfile
      ? "PROVIDER"
      : user.organizerProfile
        ? "ORGANIZER"
        : "TOURIST";
    await prisma.user.update({ where: { id: user.id }, data: { role, adminRoleId: null } });
    await audit("TEAM_MEMBER_REMOVED", { userId: user.id, details: { by: admin.id, to: role } });
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Rôles                                                                */
/* ------------------------------------------------------------------ */

export const getAdminRoles = createServerFn({ method: "GET" }).handler(async () => {
  await requirePermission("equipe");
  const [roles, superAdmins] = await Promise.all([
    getPrisma().adminRole.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
        permissions: true,
        _count: { select: { members: true } },
      },
    }),
    getPrisma().user.count({ where: { role: "ADMIN", adminRoleId: null } }),
  ]);
  return {
    superAdmins,
    roles: roles.map((r) => ({
      ...r,
      permissions: cleanPermissions(r.permissions),
      members: r._count.members,
    })),
  };
});

const roleSchema = z.object({
  id: z.string().max(64).optional(),
  name: z.string().trim().min(2).max(60),
  description: z.string().trim().max(300).optional(),
  permissions: z.array(z.enum(PERMISSIONS)).min(1, "Choisissez au moins une permission."),
});

export const saveAdminRole = createServerFn({ method: "POST" })
  .validator((input: unknown) => roleSchema.parse(input))
  .handler(async ({ data }) => {
    const admin = await requirePermission("equipe");
    if (data.name.toLowerCase() === "super admin") {
      throw new Error("« Super admin » est un rôle réservé.");
    }
    const prisma = getPrisma();
    const clash = await prisma.adminRole.findFirst({
      where: { name: { equals: data.name, mode: "insensitive" }, NOT: { id: data.id ?? "" } },
    });
    if (clash) throw new Error("Un rôle porte déjà ce nom.");
    const values = {
      name: data.name,
      description: data.description || null,
      permissions: cleanPermissions(data.permissions),
    };
    const role = data.id
      ? await prisma.adminRole.update({ where: { id: data.id }, data: values })
      : await prisma.adminRole.create({ data: values });
    await audit(data.id ? "ADMIN_ROLE_UPDATED" : "ADMIN_ROLE_CREATED", {
      userId: admin.id,
      details: { roleId: role.id, name: role.name, permissions: role.permissions },
    });
    return { ok: true };
  });

export const deleteAdminRole = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ id: z.string().min(1).max(64) }).parse(input))
  .handler(async ({ data }) => {
    const admin = await requirePermission("equipe");
    const prisma = getPrisma();
    const members = await prisma.user.count({ where: { adminRoleId: data.id } });
    if (members > 0) {
      throw new Error("Ce rôle est encore attribué : changez d'abord le rôle de ses membres.");
    }
    const role = await prisma.adminRole.delete({ where: { id: data.id } });
    await audit("ADMIN_ROLE_DELETED", {
      userId: admin.id,
      details: { roleId: role.id, name: role.name },
    });
    return { ok: true };
  });
