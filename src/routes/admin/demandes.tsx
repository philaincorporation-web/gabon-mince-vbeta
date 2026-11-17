import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/admin/AdminPage";
import { requireSection, useAdminAction, useAdminPrefs } from "@/components/admin/AdminUI";
import { DemandesPanel } from "@/components/admin/DemandesPanel";
import { getAdminDemandes } from "@/lib/demandes";

export const Route = createFileRoute("/admin/demandes")({
  beforeLoad: ({ context }) => requireSection(context.admin, "demandes"),
  loader: () => getAdminDemandes(),
  head: () => ({ meta: [{ title: "Demandes | Administration GabonMICE" }] }),
  component: DemandesPage,
});

function DemandesPage() {
  const data = Route.useLoaderData();
  const { t, language } = useAdminPrefs();
  const { busy, run, notices } = useAdminAction();
  return (
    <AdminPage
      title={t("Demandes", "Requests")}
      subtitle={t(
        "Contact, réservations, devis, événements et labellisations envoyés depuis le site.",
        "Contact, bookings, quotes, events and labelling sent from the website.",
      )}
    >
      {notices}
      <DemandesPanel data={data} t={t} language={language} busy={busy} run={run} />
    </AdminPage>
  );
}
