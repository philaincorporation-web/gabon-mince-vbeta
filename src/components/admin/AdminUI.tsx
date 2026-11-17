import { createContext, useContext, useState } from "react";
import { redirect, useRouter } from "@tanstack/react-router";
import { Notice } from "@/components/auth/AuthUI";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { errorMessage } from "@/lib/auth/schemas";
import type { SitePrefs } from "@/hooks/use-site-prefs";
import type { Permission } from "@/lib/admin/permissions";

/* ------------------------------------------------------------------ */
/* Langue / thème partagés par toutes les pages du back office          */
/* ------------------------------------------------------------------ */

export const AdminPrefsContext = createContext<SitePrefs | null>(null);

export function useAdminPrefs() {
  const prefs = useContext(AdminPrefsContext);
  if (!prefs) throw new Error("useAdminPrefs doit être utilisé dans le back office.");
  return prefs;
}

/** Garde d'une section (beforeLoad) : sans la permission, retour au tableau de bord. */
export function requireSection(admin: { permissions: Permission[] }, permission: Permission) {
  if (!admin.permissions.includes(permission)) throw redirect({ to: "/admin" });
}

/* ------------------------------------------------------------------ */
/* Actions : chargement, erreurs, avertissement e-mail                  */
/* ------------------------------------------------------------------ */

/**
 * Exécute une action admin puis rafraîchit les données (pastilles comprises).
 * Signale une erreur, ou un e-mail de notification non parti (`emailSent: false`).
 */
export function useAdminAction() {
  const router = useRouter();
  const { t } = useAdminPrefs();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mailWarning, setMailWarning] = useState(false);

  async function run(key: string, action: () => Promise<unknown>, successMessage?: string) {
    setBusy(key);
    setError(null);
    setSuccess(null);
    setMailWarning(false);
    try {
      const result = await action();
      if (result && typeof result === "object" && "emailSent" in result) {
        setMailWarning(result.emailSent === false);
      }
      if (successMessage) setSuccess(successMessage);
      await router.invalidate();
      return true;
    } catch (e) {
      setError(errorMessage(e, "Action impossible."));
      return false;
    } finally {
      setBusy(null);
    }
  }

  const notices = (
    <>
      <LoadingOverlay
        show={busy !== null}
        message={{ fr: "Mise à jour en cours…", en: "Updating…" }}
      />
      {error && <Notice tone="error">{error}</Notice>}
      {success && <Notice tone="success">{success}</Notice>}
      {mailWarning && (
        <Notice tone="info">
          {t(
            "Action enregistrée, mais l'e-mail de notification n'a pas pu être envoyé. Prévenez l'utilisateur directement.",
            "Action saved, but the notification email could not be sent. Please contact the user directly.",
          )}
        </Notice>
      )}
    </>
  );

  return { busy, run, notices };
}

/* ------------------------------------------------------------------ */
/* Libellés communs                                                     */
/* ------------------------------------------------------------------ */

export const STATUS_LABEL = {
  ACTIVE: { fr: "Actif", en: "Active", tone: "bg-forest/10 text-forest dark:text-emerald-300" },
  PENDING: { fr: "En attente", en: "Pending", tone: "bg-sun/15 text-sun-deep" },
  SUSPENDED: { fr: "Suspendu", en: "Suspended", tone: "bg-red-50 text-red-600 dark:bg-red-950/40" },
} as const;

export const LABEL_STATUS = {
  NONE: { fr: "Aucun", en: "None" },
  PENDING: { fr: "À examiner", en: "To review" },
  GRANTED: { fr: "Accordé", en: "Granted" },
  REVOKED: { fr: "Retiré", en: "Revoked" },
} as const;

export function useFormatDate() {
  const { language } = useAdminPrefs();
  const locale = language === "fr" ? "fr-FR" : "en-GB";
  return {
    date: (d: Date | string | null | undefined) =>
      d ? new Date(d).toLocaleDateString(locale) : "—",
    dateTime: (d: Date | string | null | undefined) =>
      d ? new Date(d).toLocaleString(locale) : "—",
  };
}
