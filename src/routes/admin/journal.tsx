import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/auth/SpaceLayout";
import { AdminPage } from "@/components/admin/AdminPage";
import { requireSection, useAdminPrefs, useFormatDate } from "@/components/admin/AdminUI";
import { getAdminLogs } from "@/lib/admin/functions";

export const Route = createFileRoute("/admin/journal")({
  beforeLoad: ({ context }) => requireSection(context.admin, "journal"),
  loader: () => getAdminLogs(),
  head: () => ({ meta: [{ title: "Journal | Administration GabonMICE" }] }),
  component: JournalPage,
});

function JournalPage() {
  const logs = Route.useLoaderData();
  const { t } = useAdminPrefs();
  const { dateTime } = useFormatDate();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const shown = q
    ? logs.filter((l) =>
        [l.action, l.user?.email ?? "", l.ip ?? "", l.details ?? ""].some((v) =>
          v.toLowerCase().includes(q),
        ),
      )
    : logs;

  return (
    <AdminPage
      title={t("Journal", "Audit log")}
      subtitle={t(
        "Connexions, validations, labels, rôles et équipe : chaque action est tracée.",
        "Sign-ins, approvals, labels, roles and team: every action is logged.",
      )}
    >
      <Panel title={t(`Dernières actions (${shown.length})`, `Latest actions (${shown.length})`)}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("Filtrer (action, e-mail, IP…)", "Filter (action, email, IP…)")}
          className="mb-4 w-full rounded-full border border-black/10 bg-cream px-4 py-2 text-sm outline-none focus:border-forest sm:max-w-sm dark:border-slate-700 dark:bg-slate-800"
        />
        <ul className="divide-y divide-black/5 text-sm dark:divide-slate-800">
          {shown.map((log) => (
            <li
              key={log.id}
              className="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-center sm:gap-4"
            >
              <span className="w-40 shrink-0 text-xs text-ink/50 dark:text-slate-400">
                {dateTime(log.createdAt)}
              </span>
              <span className="w-56 shrink-0 font-mono text-xs font-semibold">{log.action}</span>
              <span
                className="min-w-0 flex-1 truncate text-ink/65 dark:text-slate-400"
                title={log.details ?? undefined}
              >
                {log.user?.email ?? "—"}
                {log.ip ? ` · ${log.ip}` : ""}
                {log.details ? ` · ${log.details}` : ""}
              </span>
            </li>
          ))}
        </ul>
      </Panel>
    </AdminPage>
  );
}
