import { useState, type FormEvent } from "react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import {
  AuthCard,
  Divider,
  Field,
  GoogleButton,
  inputClass,
  Notice,
  SubmitButton,
} from "@/components/auth/AuthUI";
import { authClient } from "@/lib/auth/client";
import { getAuthConfig, getPostLoginRedirect, getSessionInfo } from "@/lib/auth/functions";
import { landingFor, safeRedirect } from "@/lib/auth/access";

export const Route = createFileRoute("/connexion")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: safeRedirect(search.redirect) ?? undefined,
  }),
  beforeLoad: async () => {
    const session = await getSessionInfo();
    if (session && session.status !== "SUSPENDED") throw redirect({ href: landingFor(session) });
  },
  loader: () => getAuthConfig(),
  head: () => ({ meta: [{ title: "Connexion | GabonMICE" }] }),
  component: LoginPage,
});

function LoginPage() {
  const config = Route.useLoaderData();
  const { redirect: redirectTo } = Route.useSearch();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>, isFrench: boolean) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const identifier = String(form.get("identifier") ?? "").trim();
    const password = String(form.get("password") ?? "");
    if (!identifier || !password) {
      setError(
        isFrench
          ? "Renseignez votre identifiant et votre mot de passe."
          : "Enter your login and password.",
      );
      return;
    }
    setError(null);
    setLoading(true);
    const { error: signInError } = identifier.includes("@")
      ? await authClient.signIn.email({ email: identifier.toLowerCase(), password })
      : await authClient.signIn.username({ username: identifier.toLowerCase(), password });

    if (signInError) {
      setLoading(false);
      const status = signInError.status;
      setError(
        status === 429 || status === 403
          ? (signInError.message ?? "")
          : isFrench
            ? "Identifiant ou mot de passe incorrect."
            : "Incorrect login or password.",
      );
      return;
    }
    // Priorité : changement de mot de passe / compte en attente, puis page demandée, puis espace du rôle.
    const landing = await getPostLoginRedirect();
    const forced = landing === "/changer-mot-de-passe" || landing === "/compte-en-attente";
    window.location.assign(forced ? landing : (redirectTo ?? landing));
  }

  return (
    <PageShell>
      {({ t, language }) => (
        <AuthCard
          image="/Palaiscongrès2.webp"
          eyebrow={t("Espace membres", "Members area")}
          title={t("Connexion", "Sign in")}
          intro={t(
            "Touristes d'affaires, organisateurs, prestataires et administrateurs : une seule connexion.",
            "Business travellers, organisers, providers and administrators: one single sign-in.",
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
            <>
              {config.google && (
                <>
                  <GoogleButton
                    label={t("Continuer avec Google", "Continue with Google")}
                    onClick={() =>
                      authClient.signIn.social({
                        provider: "google",
                        callbackURL: redirectTo ?? "/espace",
                      })
                    }
                  />
                  <Divider label={t("ou avec vos identifiants", "or with your credentials")} />
                </>
              )}
              <form
                onSubmit={(e) => handleSubmit(e, language === "fr")}
                noValidate
                className="space-y-4"
              >
                <Field label={t("E-mail ou identifiant", "Email or username")}>
                  <input name="identifier" autoComplete="username" className={inputClass} />
                </Field>
                <Field label={t("Mot de passe", "Password")}>
                  <span className="relative block">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className={`${inputClass} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? t("Masquer", "Hide") : t("Afficher", "Show")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-ink/50 hover:text-ink dark:text-slate-400"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </span>
                </Field>
                {error && <Notice tone="error">{error}</Notice>}
                <SubmitButton loading={loading}>{t("Se connecter", "Sign in")}</SubmitButton>
              </form>
              <p className="mt-6 text-center text-sm text-ink/65 dark:text-slate-400">
                {t("Pas encore de compte ?", "No account yet?")}{" "}
                <Link to="/inscription" className="font-semibold text-sun-deep hover:underline">
                  {t("Créer un compte", "Create an account")}
                </Link>
              </p>
            </>
          )}
        </AuthCard>
      )}
    </PageShell>
  );
}
