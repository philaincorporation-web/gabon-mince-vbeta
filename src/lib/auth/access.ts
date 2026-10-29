/**
 * Règles d'accès GabonMICE, sans dépendance serveur : utilisées par les gardes
 * de routes (beforeLoad), par requireRole côté serveur et par les tests.
 */

export const ROLES = ["TOURIST", "ORGANIZER", "PROVIDER", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];
export type AccountStatus = "ACTIVE" | "PENDING" | "SUSPENDED";

/** Profils autorisés à l'inscription : ADMIN n'en fait jamais partie. */
export const SIGNUP_ROLES = ["TOURIST", "ORGANIZER", "PROVIDER"] as const;
export type SignupRole = (typeof SIGNUP_ROLES)[number];

export type SessionInfo = {
  id: string;
  name: string;
  email: string;
  username: string | null;
  role: Role;
  status: AccountStatus;
  requestedRole: Role | null;
  mustChangePassword: boolean;
} | null;

export const ROLE_HOME: Record<Role, string> = {
  TOURIST: "/espace/touriste",
  ORGANIZER: "/espace/organisateur",
  PROVIDER: "/espace/prestataire",
  ADMIN: "/admin",
};

export const ROLE_LABEL: Record<Role, { fr: string; en: string }> = {
  TOURIST: { fr: "Touriste d'affaires", en: "Business traveller" },
  ORGANIZER: { fr: "Organisateur", en: "Organiser" },
  PROVIDER: { fr: "Prestataire", en: "Provider" },
  ADMIN: { fr: "Administrateur", en: "Administrator" },
};

/** Espace réservé à chaque préfixe de chemin protégé. */
const SPACE_ROLE: { prefix: string; role: Role }[] = [
  { prefix: "/espace/touriste", role: "TOURIST" },
  { prefix: "/espace/organisateur", role: "ORGANIZER" },
  { prefix: "/espace/prestataire", role: "PROVIDER" },
  { prefix: "/admin", role: "ADMIN" },
];

const matches = (pathname: string, prefix: string) =>
  pathname === prefix || pathname.startsWith(`${prefix}/`);

export function isProtectedPath(pathname: string) {
  return matches(pathname, "/espace") || matches(pathname, "/admin");
}

/** Page où envoyer un utilisateur connecté qui n'a pas de destination précise. */
export function landingFor(session: NonNullable<SessionInfo>): string {
  if (session.mustChangePassword) return "/changer-mot-de-passe";
  if (session.status === "PENDING") return "/compte-en-attente";
  return ROLE_HOME[session.role];
}

/**
 * Renvoie la redirection à appliquer pour accéder à `pathname`,
 * ou `null` si l'accès est autorisé.
 */
export function checkAccess(pathname: string, session: SessionInfo): string | null {
  if (!isProtectedPath(pathname)) return null;
  if (!session || session.status === "SUSPENDED") {
    return `/connexion?redirect=${encodeURIComponent(pathname)}`;
  }
  if (session.mustChangePassword) return "/changer-mot-de-passe";
  if (session.status === "PENDING") return "/compte-en-attente";

  // /espace seul : renvoi vers l'espace du rôle
  if (pathname === "/espace" || pathname === "/espace/") return ROLE_HOME[session.role];

  const space = SPACE_ROLE.find((s) => matches(pathname, s.prefix));
  if (!space) return ROLE_HOME[session.role];
  return space.role === session.role ? null : "/acces-refuse";
}

export type RoleCheck = { ok: true } | { ok: false; reason: "UNAUTHENTICATED" | "FORBIDDEN" };

/** Vérification utilisée par requireRole côté serveur. */
export function assertRole(session: SessionInfo, roles: readonly Role[]): RoleCheck {
  if (!session || session.status === "SUSPENDED") return { ok: false, reason: "UNAUTHENTICATED" };
  if (session.status !== "ACTIVE" || session.mustChangePassword) {
    return { ok: false, reason: "FORBIDDEN" };
  }
  return roles.includes(session.role) ? { ok: true } : { ok: false, reason: "FORBIDDEN" };
}

/** Accepte uniquement un chemin interne (évite les redirections ouvertes). */
export function safeRedirect(target: unknown): string | null {
  if (typeof target !== "string") return null;
  if (!target.startsWith("/") || target.startsWith("//") || target.includes("\\")) return null;
  return target;
}
