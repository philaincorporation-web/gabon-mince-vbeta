import { AuthorizationError, requireRole } from "@/lib/auth/guard.server";
import { getPrisma } from "@/lib/db.server";
import { effectivePermissions, type Permission } from "@/lib/admin/permissions";

/** Session ADMIN + permissions du back office, relues en base à chaque appel. */
export async function loadAdmin() {
  const session = await requireRole("ADMIN");
  const user = await getPrisma().user.findUnique({
    where: { id: session.id },
    select: { adminRole: { select: { id: true, name: true, permissions: true } } },
  });
  const role = user?.adminRole ?? null;
  return {
    session,
    role,
    isSuperAdmin: role === null,
    permissions: effectivePermissions(role),
  };
}

/**
 * À appeler en tête des server functions du back office, à la place de
 * requireRole("ADMIN") : exige le rôle ADMIN et la permission de la section.
 */
export async function requirePermission(...needed: Permission[]) {
  const admin = await loadAdmin();
  if (!needed.every((p) => admin.permissions.includes(p))) {
    throw new AuthorizationError("FORBIDDEN");
  }
  return admin.session;
}

/**
 * Refuse une modification qui laisserait le site sans Super admin actif
 * (compte ADMIN, actif, sans rôle restreint).
 */
export async function assertKeepsSuperAdmin(excludedUserId: string) {
  const remaining = await getPrisma().user.count({
    where: {
      role: "ADMIN",
      status: "ACTIVE",
      adminRoleId: null,
      id: { not: excludedUserId },
    },
  });
  if (remaining === 0) {
    throw new Error("Impossible : il doit toujours rester au moins un Super admin actif.");
  }
}
