import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarPlus, Compass, FileText, Sparkles } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Panel, SpaceHeader } from "@/components/auth/SpaceLayout";
import { getMyProfile } from "@/lib/auth/functions";

export const Route = createFileRoute("/espace/organisateur")({
  loader: () => getMyProfile(),
  head: () => ({ meta: [{ title: "Mon espace organisateur | GabonMICE" }] }),
  component: OrganizerSpace,
});

function OrganizerSpace() {
  const { session } = Route.useRouteContext();
  const profile = Route.useLoaderData();
  return (
    <PageShell>
      {({ t, language }) => (
        <>
          <SpaceHeader
            session={session}
            language={language}
            title={t("Mon espace organisateur", "My organiser space")}
            subtitle={profile?.organizerProfile?.organization ?? ""}
          />
          <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
            <Panel title={t("Mes événements", "My events")} className="lg:col-span-2">
              <p className="text-sm text-ink/65 dark:text-slate-400">
                {t(
                  "Répertoriez un événement en précisant son thème, sa cible, le nombre de participants et vos besoins en salles et prestations. L'AGATOUR relaie votre demande aux prestataires labellisés.",
                  "List an event with its theme, audience, number of attendees and venue and service needs. AGATOUR relays your request to labelled providers.",
                )}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <Shortcut
                  to="/organisateur"
                  icon={CalendarPlus}
                  label={t("Répertorier un événement", "List an event")}
                  primary
                />
                <Shortcut
                  to="/explorer"
                  icon={Compass}
                  label={t("Salles et hébergements", "Venues and hotels")}
                />
                <Shortcut
                  to="/offres"
                  icon={Sparkles}
                  label={t("Offres pour vos délégués", "Offers for delegates")}
                />
              </div>
              <p className="mt-5 rounded-2xl border border-dashed border-black/10 p-4 text-sm text-ink/55 dark:border-slate-700 dark:text-slate-400">
                <FileText className="mr-2 inline h-4 w-4" />
                {t(
                  "Bientôt : le suivi de vos événements et des devis reçus apparaîtra ici.",
                  "Coming soon: tracking of your events and quotes received will appear here.",
                )}
              </p>
            </Panel>
            <Panel title={t("Mon organisation", "My organisation")}>
              <dl className="space-y-2 text-sm">
                <Row
                  label={t("Organisation", "Organisation")}
                  value={profile?.organizerProfile?.organization}
                />
                <Row
                  label={t("Fonction", "Position")}
                  value={profile?.organizerProfile?.position}
                />
                <Row label={t("Site web", "Website")} value={profile?.organizerProfile?.website} />
                <Row label={t("Téléphone", "Phone")} value={profile?.phone} />
              </dl>
            </Panel>
          </section>
        </>
      )}
    </PageShell>
  );
}

function Shortcut({
  to,
  icon: Icon,
  label,
  primary = false,
}: {
  to: "/organisateur" | "/explorer" | "/offres";
  icon: typeof Compass;
  label: string;
  primary?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex flex-col gap-3 rounded-2xl p-4 text-sm font-semibold transition-colors ${
        primary
          ? "bg-sun text-white hover:bg-sun-deep"
          : "bg-cream hover:bg-sand dark:bg-slate-800 dark:hover:bg-slate-700"
      }`}
    >
      <Icon className="h-6 w-6" />
      {label}
    </Link>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-4 border-b border-black/5 pb-2 last:border-0 dark:border-slate-800">
      <dt className="text-ink/55 dark:text-slate-400">{label}</dt>
      <dd className="truncate font-medium">{value || "—"}</dd>
    </div>
  );
}
