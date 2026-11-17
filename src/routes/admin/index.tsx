import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Inbox, UserCheck, Users, type LucideIcon } from "lucide-react";
import { Panel } from "@/components/auth/SpaceLayout";
import { AdminPage } from "@/components/admin/AdminPage";
import { useAdminPrefs, useFormatDate } from "@/components/admin/AdminUI";
import { getAdminSummary } from "@/lib/admin/functions";
import { ROLE_LABEL, ROLES } from "@/lib/auth/access";

export const Route = createFileRoute("/admin/")({
  loader: () => getAdminSummary(),
  component: DashboardPage,
});

const KIND_LABEL: Record<string, { fr: string; en: string }> = {
  CONTACT: { fr: "Contact", en: "Contact" },
  RESERVATION: { fr: "Réservation", en: "Booking" },
  DEVIS: { fr: "Devis", en: "Quote" },
  EVENEMENT: { fr: "Événement", en: "Event" },
  LABELLISATION: { fr: "Labellisation", en: "Labelling" },
};

function DashboardPage() {
  const { session, admin } = Route.useRouteContext();
  const data = Route.useLoaderData();
  const { t, language } = useAdminPrefs();
  const { date, dateTime } = useFormatDate();
  const can = (p: (typeof admin.permissions)[number]) => admin.permissions.includes(p);
  const totalUsers = Object.values(data.usersByRole).reduce((a, b) => a + b, 0);
  const firstName = session.name.split(" ")[0];

  return (
    <AdminPage
      title={t(`Bonjour ${firstName}`, `Hello ${firstName}`)}
      subtitle={t(
        "Vue d'ensemble de la plateforme et des éléments qui attendent une action.",
        "Platform overview and items awaiting action.",
      )}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {can("demandes") && (
          <Kpi
            to="/admin/demandes"
            icon={Inbox}
            value={admin.counts.demandes}
            label={t("Nouvelles demandes", "New requests")}
            highlight={admin.counts.demandes > 0}
          />
        )}
        {can("validations") && (
          <Kpi
            to="/admin/validations"
            icon={UserCheck}
            value={admin.counts.validations}
            label={t("Comptes à valider", "Accounts to review")}
            highlight={admin.counts.validations > 0}
          />
        )}
        {can("labels") && (
          <Kpi
            to="/admin/labels"
            icon={BadgeCheck}
            value={data.labelled}
            label={t("Prestataires labellisés", "Labelled providers")}
            hint={
              admin.counts.labels > 0
                ? t(
                    `${admin.counts.labels} expire(nt) sous 30 jours`,
                    `${admin.counts.labels} expiring within 30 days`,
                  )
                : undefined
            }
            highlight={admin.counts.labels > 0}
          />
        )}
        {can("utilisateurs") && (
          <Kpi
            to="/admin/utilisateurs"
            icon={Users}
            value={totalUsers}
            label={t("Utilisateurs inscrits", "Registered users")}
          />
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {can("demandes") && (
          <Panel title={t("Dernières demandes", "Latest requests")}>
            {data.recentDemandes.length === 0 ? (
              <Empty>{t("Aucune demande pour l'instant.", "No request yet.")}</Empty>
            ) : (
              <ul className="divide-y divide-black/5 dark:divide-slate-800">
                {data.recentDemandes.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">
                        {KIND_LABEL[d.kind]?.[language] ?? d.kind} · {d.subject}
                      </p>
                      <p className="text-xs text-ink/55 dark:text-slate-400">
                        {d.name} · {dateTime(d.createdAt)}
                      </p>
                    </div>
                    {d.status === "NEW" && (
                      <span className="shrink-0 rounded-full bg-sun/15 px-2.5 py-0.5 text-xs font-semibold text-sun-deep">
                        {t("Nouvelle", "New")}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <MoreLink to="/admin/demandes">{t("Toutes les demandes", "All requests")}</MoreLink>
          </Panel>
        )}

        {can("utilisateurs") && (
          <Panel title={t("Répartition des comptes", "Accounts by profile")}>
            <ul className="space-y-3">
              {ROLES.map((r) => {
                const n = data.usersByRole[r] ?? 0;
                const pct = totalUsers ? Math.round((n / totalUsers) * 100) : 0;
                return (
                  <li key={r} className="text-sm">
                    <div className="mb-1 flex justify-between">
                      <span className="font-semibold">{ROLE_LABEL[r][language]}</span>
                      <span className="tabular-nums text-ink/65 dark:text-slate-400">{n}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-sand dark:bg-slate-800">
                      <div className="h-full rounded-full bg-forest" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </Panel>
        )}

        {can("labels") && (
          <Panel title={t("Labels qui expirent bientôt", "Labels expiring soon")}>
            {data.expiring.length === 0 ? (
              <Empty>
                {t("Aucun label n'expire dans les 30 jours.", "No label expires within 30 days.")}
              </Empty>
            ) : (
              <ul className="divide-y divide-black/5 dark:divide-slate-800">
                {data.expiring.map((p) => (
                  <li key={p.businessName} className="flex justify-between gap-3 py-3 text-sm">
                    <span className="font-semibold">{p.businessName}</span>
                    <span className="text-sun-deep">{date(p.labelExpiresAt)}</span>
                  </li>
                ))}
              </ul>
            )}
            <MoreLink to="/admin/labels">{t("Gérer les labels", "Manage labels")}</MoreLink>
          </Panel>
        )}

        {can("journal") && (
          <Panel title={t("Activité récente", "Recent activity")}>
            <ul className="divide-y divide-black/5 dark:divide-slate-800">
              {data.recentLogs.map((log) => (
                <li key={log.id} className="flex flex-col gap-0.5 py-2.5 text-sm">
                  <span className="font-mono text-xs font-semibold">{log.action}</span>
                  <span className="text-xs text-ink/55 dark:text-slate-400">
                    {dateTime(log.createdAt)}
                    {log.user?.email ? ` · ${log.user.email}` : ""}
                  </span>
                </li>
              ))}
            </ul>
            <MoreLink to="/admin/journal">{t("Tout le journal", "Full log")}</MoreLink>
          </Panel>
        )}
      </div>
    </AdminPage>
  );
}

function Kpi({
  to,
  icon: Icon,
  value,
  label,
  hint,
  highlight = false,
}: {
  to: string;
  icon: LucideIcon;
  value: number;
  label: string;
  hint?: string;
  highlight?: boolean;
}) {
  return (
    <Link
      to={to}
      className="group rounded-[1.5rem] bg-white p-5 shadow-soft transition hover:-translate-y-0.5 dark:bg-slate-900"
    >
      <div className="flex items-center justify-between">
        <span
          className={`grid h-10 w-10 place-items-center rounded-full ${
            highlight ? "bg-sun/20 text-sun-deep" : "bg-forest/10 text-forest dark:text-emerald-300"
          }`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <ArrowRight className="h-4 w-4 text-ink/30 transition group-hover:translate-x-0.5 dark:text-slate-500" />
      </div>
      <p className="mt-4 font-display text-3xl font-extrabold tabular-nums">{value}</p>
      <p className="text-sm font-semibold text-ink/65 dark:text-slate-400">{label}</p>
      {hint && <p className="mt-1 text-xs font-semibold text-sun-deep">{hint}</p>}
    </Link>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return <p className="text-sm text-ink/55 dark:text-slate-400">{children}</p>;
}

function MoreLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-forest hover:underline dark:text-emerald-300"
    >
      {children} <ArrowRight className="h-3.5 w-3.5" />
    </Link>
  );
}
