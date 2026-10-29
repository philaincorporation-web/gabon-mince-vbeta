import { useState, type FormEvent } from "react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Briefcase, Check, Handshake, Plane } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { AuthCard, Field, inputClass, Notice, SubmitButton } from "@/components/auth/AuthUI";
import { getAuthConfig, getSessionInfo, registerAccount } from "@/lib/auth/functions";
import { landingFor, type SignupRole } from "@/lib/auth/access";
import { errorMessage, fieldErrors, PROVIDER_CATEGORIES, registerSchema } from "@/lib/auth/schemas";

export const Route = createFileRoute("/inscription")({
  beforeLoad: async () => {
    const session = await getSessionInfo();
    if (session && session.status !== "SUSPENDED") throw redirect({ href: landingFor(session) });
  },
  loader: () => getAuthConfig(),
  head: () => ({ meta: [{ title: "Créer un compte | GabonMICE" }] }),
  component: SignupPage,
});

const profiles: {
  role: SignupRole;
  icon: typeof Plane;
  fr: string;
  en: string;
  descFr: string;
  descEn: string;
}[] = [
  {
    role: "TOURIST",
    icon: Plane,
    fr: "Touriste d'affaires",
    en: "Business traveller",
    descFr: "Consulter et réserver. Compte actif immédiatement.",
    descEn: "Browse and book. Account active immediately.",
  },
  {
    role: "ORGANIZER",
    icon: Briefcase,
    fr: "Organisateur",
    en: "Organiser",
    descFr: "Répertorier vos événements. Validation par l'AGATOUR.",
    descEn: "List your events. Validated by AGATOUR.",
  },
  {
    role: "PROVIDER",
    icon: Handshake,
    fr: "Prestataire",
    en: "Provider",
    descFr: "Recevoir réservations et devis. Validation et label AGATOUR.",
    descEn: "Receive bookings and quotes. AGATOUR validation and label.",
  },
];

function SignupPage() {
  const config = Route.useLoaderData();
  const [profile, setProfile] = useState<SignupRole>("TOURIST");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>, isFrench: boolean) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const raw = Object.fromEntries(
      [...form.entries()].map(([k, v]) => [k, typeof v === "string" ? v : ""]),
    );
    if (raw.password !== raw.confirm) {
      setErrors({
        confirm: isFrench ? "Les mots de passe ne correspondent pas." : "Passwords do not match.",
      });
      return;
    }
    delete raw.confirm;
    const parsed = registerSchema.safeParse({ ...raw, profile });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setFormError(null);
    setLoading(true);
    try {
      const { redirectTo } = await registerAccount({ data: { ...raw, profile } });
      window.location.assign(redirectTo);
    } catch (error) {
      setLoading(false);
      const message = errorMessage(error, "");
      setFormError(
        /exist/i.test(message)
          ? isFrench
            ? "Un compte existe déjà avec cet e-mail ou cet identifiant."
            : "An account already exists with this email or username."
          : message ||
              (isFrench
                ? "Inscription impossible, réessayez."
                : "Sign-up failed, please try again."),
      );
    }
  }

  return (
    <PageShell>
      {({ t, language }) => (
        <AuthCard
          wide
          image="/AFAIRES.webp"
          eyebrow={t("Rejoindre GabonMICE", "Join GabonMICE")}
          title={t("Créer un compte", "Create an account")}
          intro={t(
            "Choisissez le profil qui vous correspond.",
            "Choose the profile that fits you.",
          )}
        >
          {!config.enabled ? (
            <Notice tone="info">
              {t(
                "L'espace membres n'est pas encore activé sur ce site (base de données non configurée).",
                "The members area is not enabled on this site yet (database not configured).",
              )}
            </Notice>
          ) : (
            <form
              onSubmit={(e) => handleSubmit(e, language === "fr")}
              noValidate
              className="space-y-5"
            >
              <fieldset>
                <legend className="sr-only">{t("Profil", "Profile")}</legend>
                <div className="grid gap-3 sm:grid-cols-3">
                  {profiles.map(({ role, icon: Icon, fr, en, descFr, descEn }) => {
                    const active = profile === role;
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setProfile(role)}
                        aria-pressed={active}
                        className={`relative rounded-2xl border-2 p-4 text-left transition-colors ${
                          active
                            ? "border-forest bg-forest/5 dark:bg-forest/20"
                            : "border-black/5 hover:border-forest/30 dark:border-slate-700"
                        }`}
                      >
                        {active && (
                          <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-forest text-white">
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                        <Icon className="h-6 w-6 text-forest dark:text-sun" />
                        <span className="mt-2 block text-sm font-bold">{t(fr, en)}</span>
                        <span className="mt-1 block text-xs text-ink/60 dark:text-slate-400">
                          {t(descFr, descEn)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t("Nom complet *", "Full name *")} error={errors.name}>
                  <input
                    name="name"
                    autoComplete="name"
                    className={inputClass}
                    aria-invalid={!!errors.name}
                  />
                </Field>
                <Field label="E-mail *" error={errors.email}>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={inputClass}
                    aria-invalid={!!errors.email}
                  />
                </Field>
                <Field
                  label={t("Identifiant (optionnel)", "Username (optional)")}
                  error={errors.username}
                  hint={t("Pour vous connecter sans e-mail.", "To sign in without your email.")}
                >
                  <input
                    name="username"
                    autoComplete="username"
                    className={inputClass}
                    aria-invalid={!!errors.username}
                  />
                </Field>
                <Field label={t("Téléphone", "Phone")} error={errors.phone}>
                  <input name="phone" type="tel" autoComplete="tel" className={inputClass} />
                </Field>

                {profile === "TOURIST" && (
                  <>
                    <Field label={t("Pays", "Country")}>
                      <input name="country" autoComplete="country-name" className={inputClass} />
                    </Field>
                    <Field label={t("Entreprise", "Company")}>
                      <input name="company" autoComplete="organization" className={inputClass} />
                    </Field>
                  </>
                )}
                {profile === "ORGANIZER" && (
                  <>
                    <Field
                      label={t("Organisation *", "Organisation *")}
                      error={errors.organization}
                    >
                      <input
                        name="organization"
                        autoComplete="organization"
                        className={inputClass}
                        aria-invalid={!!errors.organization}
                      />
                    </Field>
                    <Field label={t("Fonction", "Position")}>
                      <input
                        name="position"
                        autoComplete="organization-title"
                        className={inputClass}
                      />
                    </Field>
                  </>
                )}
                {profile === "PROVIDER" && (
                  <>
                    <Field
                      label={t("Raison sociale *", "Company name *")}
                      error={errors.businessName}
                    >
                      <input
                        name="businessName"
                        autoComplete="organization"
                        className={inputClass}
                        aria-invalid={!!errors.businessName}
                      />
                    </Field>
                    <Field label={t("Catégorie *", "Category *")} error={errors.category}>
                      <select
                        name="category"
                        defaultValue=""
                        className={inputClass}
                        aria-invalid={!!errors.category}
                      >
                        <option value="" disabled>
                          {t("Choisir…", "Choose…")}
                        </option>
                        {PROVIDER_CATEGORIES.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c[language]}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label={t("Adresse", "Address")} className="sm:col-span-2">
                      <input name="address" autoComplete="street-address" className={inputClass} />
                    </Field>
                  </>
                )}

                <Field
                  label={t("Mot de passe *", "Password *")}
                  error={errors.password}
                  hint={t(
                    "8 caractères minimum, avec lettres et chiffres.",
                    "At least 8 characters, letters and digits.",
                  )}
                >
                  <input
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    className={inputClass}
                    aria-invalid={!!errors.password}
                  />
                </Field>
                <Field
                  label={t("Confirmer le mot de passe *", "Confirm password *")}
                  error={errors.confirm}
                >
                  <input
                    name="confirm"
                    type="password"
                    autoComplete="new-password"
                    className={inputClass}
                    aria-invalid={!!errors.confirm}
                  />
                </Field>
              </div>

              {profile !== "TOURIST" && (
                <Notice tone="info">
                  {t(
                    "Votre compte sera actif après validation par l'AGATOUR. Vous pourrez suivre son statut en vous connectant.",
                    "Your account will be active once validated by AGATOUR. Sign in to follow its status.",
                  )}
                </Notice>
              )}
              {formError && <Notice tone="error">{formError}</Notice>}
              <SubmitButton loading={loading}>
                {t("Créer mon compte", "Create my account")}
              </SubmitButton>
              <p className="text-center text-sm text-ink/65 dark:text-slate-400">
                {t("Déjà inscrit ?", "Already registered?")}{" "}
                <Link
                  to="/connexion"
                  search={{ redirect: undefined }}
                  className="font-semibold text-sun-deep hover:underline"
                >
                  {t("Se connecter", "Sign in")}
                </Link>
              </p>
            </form>
          )}
        </AuthCard>
      )}
    </PageShell>
  );
}
