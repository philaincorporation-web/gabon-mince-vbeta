import { useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { BadgeCheck, Check, FileText, ShieldOff, X } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Panel, SpaceHeader } from "@/components/auth/SpaceLayout";
import { Notice } from "@/components/auth/AuthUI";
import {
  adminChangeRole,
  adminReviewAccount,
  adminSetLabel,
  adminSetStatus,
  getAdminDashboard,
} from "@/lib/auth/functions";
import { ROLE_LABEL, ROLES, type Role } from "@/lib/auth/access";
import { errorMessage } from "@/lib/auth/schemas";

export const Route = createFileRoute("/admin/")({
  loader: () => getAdminDashboard(),
  head: () => ({ meta: [{ title: "Administration | GabonMICE" }] }),
  component: AdminPage,
});

const STATUS_LABEL = {
  ACTIVE: { fr: "Actif", en: "Active", tone: "bg-forest/10 text-forest dark:text-emerald-300" },
  PENDING: { fr: "En attente", en: "Pending", tone: "bg-sun/15 text-sun-deep" },
  SUSPENDED: { fr: "Suspendu", en: "Suspended", tone: "bg-red-50 text-red-600 dark:bg-red-950/40" },
} as const;

const LABEL_STATUS = {
  NONE: { fr: "Aucun", en: "None" },
  PENDING: { fr: "À examiner", en: "To review" },
  GRANTED: { fr: "Accordé", en: "Granted" },
  REVOKED: { fr: "Retiré", en: "Revoked" },
} as const;

function AdminPage() {
  const { session } = Route.useRouteContext();
  const data = Route.useLoaderData();
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(key: string, action: () => Promise<unknown>) {
    setBusy(key);
    setError(null);
    try {
      await action();
      await router.invalidate();
    } catch (e) {
      setError(errorMessage(e, "Action impossible."));
    } finally {
      setBusy(null);
    }
  }

  return (
    <PageShell>
      {({ t, language }) => {
        const date = (d: Date | string | null) =>
          d ? new Date(d).toLocaleDateString(language === "fr" ? "fr-FR" : "en-GB") : "—";
        return (
          <>
            <SpaceHeader
              session={session}
              language={language}
              title={t("Administration AGATOUR", "AGATOUR administration")}
              subtitle={t(
                "Validation des comptes, labels prestataires et rôles. Chaque action est tracée.",
                "Account validation, provider labels and roles. Every action is logged.",
              )}
            />
            <section className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
              {error && <Notice tone="error">{error}</Notice>}

              <Panel
                title={`${t("Comptes et demandes à valider", "Accounts and requests to review")} (${data.pending.length})`}
              >
                {data.pending.length === 0 ? (
                  <p className="text-sm text-ink/55 dark:text-slate-400">
                    {t("Rien à valider.", "Nothing to review.")}
                  </p>
                ) : (
                  <ul className="divide-y divide-black/5 dark:divide-slate-800">
                    {data.pending.map((u) => {
                      const target = (u.requestedRole ?? u.role) as Role;
                      return (
                        <li
                          key={u.id}
                          className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between"
                        >
                          <div className="min-w-0">
                            <p className="font-semibold">
                              {u.name}{" "}
                              <span className="font-normal text-ink/55 dark:text-slate-400">
                                · {u.email}
                              </span>
                            </p>
                            <p className="text-sm text-ink/65 dark:text-slate-400">
                              {u.requestedRole
                                ? t(
                                    `Demande de passage ${ROLE_LABEL[u.role as Role].fr} → ${ROLE_LABEL[target].fr}`,
                                    `Request ${ROLE_LABEL[u.role as Role].en} → ${ROLE_LABEL[target].en}`,
                                  )
                                : t(
                                    `Nouveau compte ${ROLE_LABEL[target].fr}`,
                                    `New ${ROLE_LABEL[target].en} account`,
                                  )}
                              {" · "}
                              {u.organizerProfile?.organization ??
                                u.providerProfile?.businessName ??
                                ""}
                              {u.providerProfile?.category
                                ? ` (${u.providerProfile.category})`
                                : ""}
                              {" · "}
                              {date(u.createdAt)}
                            </p>
                          </div>
                          <div className="flex shrink-0 gap-2">
                            <button
                              type="button"
                              disabled={busy !== null}
                              onClick={() =>
                                run(`ok-${u.id}`, () =>
                                  adminReviewAccount({ data: { userId: u.id, approve: true } }),
                                )
                              }
                              className="inline-flex items-center gap-1.5 rounded-full bg-forest px-4 py-2 text-sm font-semibold text-white hover:bg-forest-deep disabled:opacity-50"
                            >
                              <Check className="h-4 w-4" /> {t("Valider", "Approve")}
                            </button>
                            <button
                              type="button"
                              disabled={busy !== null}
                              onClick={() =>
                                run(`no-${u.id}`, () =>
                                  adminReviewAccount({ data: { userId: u.id, approve: false } }),
                                )
                              }
                              className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-2 text-sm font-semibold hover:bg-sand disabled:opacity-50 dark:border-slate-700"
                            >
                              <X className="h-4 w-4" /> {t("Refuser", "Reject")}
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Panel>

              <Panel
                title={`${t("Labels prestataires", "Provider labels")} (${data.providers.length})`}
              >
                {data.providers.length === 0 ? (
                  <p className="text-sm text-ink/55 dark:text-slate-400">
                    {t("Aucun prestataire actif.", "No active provider.")}
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-left text-sm">
                      <thead className="text-xs uppercase tracking-wider text-ink/50 dark:text-slate-400">
                        <tr>
                          <th className="py-2">{t("Prestataire", "Provider")}</th>
                          <th className="py-2">{t("Catégorie", "Category")}</th>
                          <th className="py-2">Label</th>
                          <th className="py-2">{t("Expire le", "Expires")}</th>
                          <th className="py-2">{t("Justificatifs", "Documents")}</th>
                          <th className="py-2 text-right">{t("Action", "Action")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5 dark:divide-slate-800">
                        {data.providers.map((u) => {
                          const status = u.providerProfile?.labelStatus ?? "NONE";
                          return (
                            <tr key={u.id}>
                              <td className="py-3 font-semibold">
                                {u.providerProfile?.businessName ?? u.name}
                              </td>
                              <td className="py-3">{u.providerProfile?.category ?? "—"}</td>
                              <td className="py-3">{LABEL_STATUS[status][language]}</td>
                              <td className="py-3">
                                {date(u.providerProfile?.labelExpiresAt ?? null)}
                              </td>
                              <td className="py-3">
                                {u.documents.length === 0 ? (
                                  <span className="text-ink/45 dark:text-slate-500">—</span>
                                ) : (
                                  <ul className="space-y-1">
                                    {u.documents.map((d) => (
                                      <li key={d.id}>
                                        <a
                                          href={d.url}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="inline-flex max-w-[180px] items-center gap-1 truncate text-xs font-semibold text-forest hover:underline dark:text-emerald-300"
                                        >
                                          <FileText className="h-3.5 w-3.5 shrink-0" />
                                          <span className="truncate">{d.fileName}</span>
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </td>
                              <td className="py-3 text-right">
                                {status === "GRANTED" ? (
                                  <button
                                    type="button"
                                    disabled={busy !== null}
                                    onClick={() =>
                                      run(`lr-${u.id}`, () =>
                                        adminSetLabel({ data: { userId: u.id, grant: false } }),
                                      )
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                                  >
                                    <ShieldOff className="h-3.5 w-3.5" /> {t("Retirer", "Revoke")}
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    disabled={busy !== null || !u.providerProfile}
                                    onClick={() =>
                                      run(`lg-${u.id}`, () =>
                                        adminSetLabel({
                                          data: { userId: u.id, grant: true, months: 12 },
                                        }),
                                      )
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-full bg-forest px-3 py-1.5 text-xs font-semibold text-white hover:bg-forest-deep disabled:opacity-50"
                                  >
                                    <BadgeCheck className="h-3.5 w-3.5" />{" "}
                                    {t("Accorder (12 mois)", "Grant (12 months)")}
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </Panel>

              <Panel title={`${t("Utilisateurs", "Users")} (${data.users.length})`}>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left text-sm">
                    <thead className="text-xs uppercase tracking-wider text-ink/50 dark:text-slate-400">
                      <tr>
                        <th className="py-2">{t("Utilisateur", "User")}</th>
                        <th className="py-2">{t("Rôle", "Role")}</th>
                        <th className="py-2">{t("Statut", "Status")}</th>
                        <th className="py-2">{t("Dernière connexion", "Last sign-in")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-slate-800">
                      {data.users.map((u) => {
                        const self = u.id === session.id;
                        return (
                          <tr key={u.id}>
                            <td className="py-3">
                              <p className="font-semibold">{u.name}</p>
                              <p className="text-xs text-ink/55 dark:text-slate-400">
                                {u.email}
                                {u.username ? ` · @${u.username}` : ""}
                              </p>
                            </td>
                            <td className="py-3">
                              <select
                                value={u.role}
                                disabled={self || busy !== null}
                                aria-label={t("Rôle", "Role")}
                                onChange={(e) =>
                                  run(`r-${u.id}`, () =>
                                    adminChangeRole({
                                      data: { userId: u.id, role: e.target.value as Role },
                                    }),
                                  )
                                }
                                className="rounded-full border border-black/10 bg-cream px-3 py-1.5 text-xs font-semibold disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800"
                              >
                                {ROLES.map((r) => (
                                  <option key={r} value={r}>
                                    {ROLE_LABEL[r][language]}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="py-3">
                              <select
                                value={u.status}
                                disabled={self || busy !== null}
                                aria-label={t("Statut", "Status")}
                                onChange={(e) =>
                                  run(`s-${u.id}`, () =>
                                    adminSetStatus({
                                      data: {
                                        userId: u.id,
                                        status: e.target.value as
                                          "ACTIVE" | "PENDING" | "SUSPENDED",
                                      },
                                    }),
                                  )
                                }
                                className={`rounded-full px-3 py-1.5 text-xs font-semibold disabled:opacity-60 ${STATUS_LABEL[u.status].tone}`}
                              >
                                {(["ACTIVE", "PENDING", "SUSPENDED"] as const).map((s) => (
                                  <option key={s} value={s}>
                                    {STATUS_LABEL[s][language]}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="py-3 text-ink/65 dark:text-slate-400">
                              {date(u.lastLoginAt)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Panel>

              <Panel
                title={t("Journal d'audit (30 dernières actions)", "Audit log (last 30 actions)")}
              >
                <ul className="divide-y divide-black/5 text-sm dark:divide-slate-800">
                  {data.logs.map((log) => (
                    <li
                      key={log.id}
                      className="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-center sm:gap-4"
                    >
                      <span className="w-40 shrink-0 text-xs text-ink/50 dark:text-slate-400">
                        {new Date(log.createdAt).toLocaleString(
                          language === "fr" ? "fr-FR" : "en-GB",
                        )}
                      </span>
                      <span className="w-48 shrink-0 font-mono text-xs font-semibold">
                        {log.action}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-ink/65 dark:text-slate-400">
                        {log.user?.email ?? "—"}
                        {log.ip ? ` · ${log.ip}` : ""}
                        {log.details ? ` · ${log.details}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </Panel>
            </section>
          </>
        );
      }}
    </PageShell>
  );
}
