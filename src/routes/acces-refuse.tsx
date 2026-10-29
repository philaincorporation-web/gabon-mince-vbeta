import { createFileRoute } from "@tanstack/react-router";
import { ShieldX } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";

export const Route = createFileRoute("/acces-refuse")({
  head: () => ({ meta: [{ title: "Accès refusé | GabonMICE" }] }),
  component: ForbiddenPage,
});

function ForbiddenPage() {
  return (
    <PageShell>
      {({ t }) => (
        <section className="mx-auto max-w-xl px-4 py-16 text-center sm:py-24">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/40">
            <ShieldX className="h-8 w-8" />
          </span>
          <h1 className="mt-6 font-display text-3xl font-extrabold text-forest-deep dark:text-white">
            {t("Accès refusé", "Access denied")}
          </h1>
          <p className="mt-4 text-ink/70 dark:text-slate-300">
            {t(
              "Cet espace est réservé à un autre type de compte. Rejoignez votre propre espace ou revenez à l'accueil.",
              "This space is reserved for another type of account. Go to your own space or back to the home page.",
            )}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="/espace"
              className="rounded-full bg-sun px-5 py-2.5 text-sm font-semibold text-white hover:bg-sun-deep"
            >
              {t("Mon espace", "My space")}
            </a>
            <a
              href="/"
              className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold hover:bg-sand dark:border-slate-700"
            >
              {t("Accueil", "Home")}
            </a>
          </div>
        </section>
      )}
    </PageShell>
  );
}
