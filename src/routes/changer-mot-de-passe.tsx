import { useState, type FormEvent } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { AuthCard, Field, inputClass, Notice, SubmitButton } from "@/components/auth/AuthUI";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { changePassword, getSessionInfo } from "@/lib/auth/functions";
import { changePasswordSchema, errorMessage, fieldErrors } from "@/lib/auth/schemas";

export const Route = createFileRoute("/changer-mot-de-passe")({
  beforeLoad: async () => {
    const session = await getSessionInfo();
    if (!session || session.status === "SUSPENDED") {
      throw redirect({ href: "/connexion?redirect=%2Fchanger-mot-de-passe" });
    }
    return { session };
  },
  head: () => ({ meta: [{ title: "Changer de mot de passe | GabonMICE" }] }),
  component: ChangePasswordPage,
});

function ChangePasswordPage() {
  const { session } = Route.useRouteContext();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>, isFrench: boolean) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data = {
      currentPassword: String(form.get("currentPassword") ?? ""),
      newPassword: String(form.get("newPassword") ?? ""),
    };
    if (data.newPassword !== String(form.get("confirm") ?? "")) {
      setErrors({
        confirm: isFrench ? "Les mots de passe ne correspondent pas." : "Passwords do not match.",
      });
      return;
    }
    const parsed = changePasswordSchema.safeParse(data);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setFormError(null);
    setLoading(true);
    try {
      const { redirectTo } = await changePassword({ data });
      window.location.assign(redirectTo);
    } catch (error) {
      setLoading(false);
      const message = errorMessage(error, "");
      setFormError(
        /password/i.test(message)
          ? isFrench
            ? "Mot de passe actuel incorrect."
            : "Current password is incorrect."
          : message ||
              (isFrench ? "Changement impossible, réessayez." : "Change failed, please try again."),
      );
    }
  }

  return (
    <PageShell>
      {({ t, language }) => (
        <AuthCard
          image="/imageLAC.jpg"
          eyebrow={t("Sécurité du compte", "Account security")}
          title={t("Changer de mot de passe", "Change your password")}
          intro={session.email}
        >
          {session.mustChangePassword && (
            <div className="mb-5">
              <Notice tone="info">
                {t(
                  "Pour des raisons de sécurité, vous devez choisir un nouveau mot de passe avant d'accéder à votre espace.",
                  "For security reasons, you must choose a new password before accessing your space.",
                )}
              </Notice>
            </div>
          )}
          <form
            onSubmit={(e) => handleSubmit(e, language === "fr")}
            noValidate
            className="space-y-4"
          >
            <Field
              label={t("Mot de passe actuel", "Current password")}
              error={errors.currentPassword}
            >
              <input
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                className={inputClass}
              />
            </Field>
            <Field
              label={t("Nouveau mot de passe", "New password")}
              error={errors.newPassword}
              hint={t(
                "8 caractères minimum, avec lettres et chiffres.",
                "At least 8 characters, letters and digits.",
              )}
            >
              <input
                name="newPassword"
                type="password"
                autoComplete="new-password"
                className={inputClass}
              />
            </Field>
            <Field
              label={t("Confirmer le nouveau mot de passe", "Confirm new password")}
              error={errors.confirm}
            >
              <input
                name="confirm"
                type="password"
                autoComplete="new-password"
                className={inputClass}
              />
            </Field>
            {formError && <Notice tone="error">{formError}</Notice>}
            <SubmitButton loading={loading}>{t("Enregistrer", "Save")}</SubmitButton>
          </form>
          <div className="mt-6 text-center">
            <SignOutButton label={t("Se déconnecter", "Sign out")} />
          </div>
        </AuthCard>
      )}
    </PageShell>
  );
}
