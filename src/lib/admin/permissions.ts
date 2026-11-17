/**
 * Permissions du back office, sans dépendance serveur (utilisées par l'interface,
 * les gardes de routes et les server functions).
 *
 * Un compte ADMIN sans rôle d'administration (adminRoleId = null) est Super admin :
 * il a toutes les permissions. C'est le cas des comptes créés avant les rôles.
 */

export const PERMISSIONS = [
  "demandes",
  "validations",
  "labels",
  "utilisateurs",
  "journal",
  "equipe",
] as const;
export type Permission = (typeof PERMISSIONS)[number];

export const PERMISSION_LABEL: Record<Permission, { fr: string; en: string; hint: Bi }> = {
  demandes: {
    fr: "Demandes",
    en: "Requests",
    hint: {
      fr: "Voir et traiter les demandes des formulaires.",
      en: "View and handle form requests.",
    },
  },
  validations: {
    fr: "Comptes à valider",
    en: "Account approvals",
    hint: {
      fr: "Valider ou refuser les nouveaux comptes et changements de profil.",
      en: "Approve or reject new accounts and profile changes.",
    },
  },
  labels: {
    fr: "Prestataires & labels",
    en: "Providers & labels",
    hint: {
      fr: "Accorder ou retirer les labels, relier les fiches publiques.",
      en: "Grant or revoke labels, link public listings.",
    },
  },
  utilisateurs: {
    fr: "Utilisateurs",
    en: "Users",
    hint: {
      fr: "Changer le profil ou le statut des comptes (hors administrateurs).",
      en: "Change account profile or status (except administrators).",
    },
  },
  journal: {
    fr: "Journal",
    en: "Audit log",
    hint: { fr: "Consulter le journal d'audit.", en: "View the audit log." },
  },
  equipe: {
    fr: "Équipe & rôles",
    en: "Team & roles",
    hint: {
      fr: "Ajouter ou retirer des administrateurs et gérer les rôles. Accès sensible.",
      en: "Add or remove administrators and manage roles. Sensitive access.",
    },
  },
};

type Bi = { fr: string; en: string };

export const SUPER_ADMIN_LABEL: Bi = { fr: "Super admin", en: "Super admin" };

/** Garde uniquement les clés connues (les rôles stockés peuvent contenir d'anciennes clés). */
export function cleanPermissions(values: readonly string[]): Permission[] {
  return PERMISSIONS.filter((p) => values.includes(p));
}

/** Permissions effectives : toutes pour un Super admin (pas de rôle), sinon celles du rôle. */
export function effectivePermissions(role: { permissions: string[] } | null): Permission[] {
  return role ? cleanPermissions(role.permissions) : [...PERMISSIONS];
}
