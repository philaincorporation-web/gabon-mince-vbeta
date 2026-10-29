import { createFileRoute, redirect } from "@tanstack/react-router";
import { Hourglass } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { getSessionInfo } from "@/lib/auth/functions";
import { landingFor, ROLE_LABEL } from "@/lib/auth/access";

export const Route = createFileRoute("/compte-en-attente")({
  beforeLoad: async () => {
    const session = await getSessionInfo();
    if (!session) throw redirect({ href: "/connexion" });
    if (session.status !== "PENDING") throw redirect({ href: landingFor(session) });
    return { session };
  },
  head: () => ({ meta: [{ title: "Compte en attente de validation | GabonMICE" }] }),
  component: PendingPage,
});

function PendingPage() {
  const { session } = Route.useRouteContext();
  return (
    <PageShell>
      {({ t, language }) => (
        <section className="mx-auto max-w-xl px-4 py-16 text-center sm:py-24">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sun/15 text-sun-deep">
            <Hourglass className="h-8 w-8" />
          </span>
          <h1 className="mt-6 font-display text-3xl font-extrabold text-forest-deep dark:text-white">
            {t("Compte en attente de validation", "Account awaiting validation")}
          </h1>
          <p className="mt-4 text-ink/70 dark:text-slate-300">
            {t(
              `Merci ${session.name}. Votre compte ${ROLE_LABEL[session.role].fr.toLowerCase()} doit être validé par l'AGATOUR avant d'accéder à votre espace. Reconnectez-vous plus tard pour vérifier son statut.`,
              `Thank you ${session.name}. Your ${ROLE_LABEL[session.role].en.toLowerCase()} account must be validated by AGATOUR before you can access your space. Sign in again later to check its status.`,
            )}
          </p>
          <p className="mt-2 text-sm text-ink/50 dark:text-slate-400">{session.email}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="/"
              className="rounded-full bg-forest-deep px-5 py-2.5 text-sm font-semibold text-white hover:bg-forest"
            >
              {t("Retour au site", "Back to the site")}
            </a>
            <SignOutButton label={language === "fr" ? "Se déconnecter" : "Sign out"} />
          </div>
        </section>
      )}
    </PageShell>
  );
}
