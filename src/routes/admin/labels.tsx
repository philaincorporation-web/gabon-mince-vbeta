import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, FileText, ShieldOff } from "lucide-react";
import { Panel } from "@/components/auth/SpaceLayout";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  LABEL_STATUS,
  requireSection,
  useAdminAction,
  useAdminPrefs,
  useFormatDate,
} from "@/components/admin/AdminUI";
import { getAdminProviders } from "@/lib/admin/functions";
import { adminSetLabel } from "@/lib/auth/functions";
import { adminLinkListing } from "@/lib/labels";
import { categoryMeta, categoryOrder, listings } from "@/lib/mice-data";

export const Route = createFileRoute("/admin/labels")({
  beforeLoad: ({ context }) => requireSection(context.admin, "labels"),
  loader: () => getAdminProviders(),
  head: () => ({ meta: [{ title: "Prestataires & labels | Administration GabonMICE" }] }),
  component: LabelsPage,
});

function LabelsPage() {
  const providers = Route.useLoaderData();
  const { t, language } = useAdminPrefs();
  const { date } = useFormatDate();
  const { busy, run, notices } = useAdminAction();

  // Fiches déjà associées à un prestataire (une fiche = un seul compte).
  const linkedListings = new Set(
    providers.map((u) => u.providerProfile?.listingId).filter(Boolean),
  );

  return (
    <AdminPage
      title={t("Prestataires & labels", "Providers & labels")}
      subtitle={t(
        "Examinez les justificatifs, accordez ou retirez le label, et reliez chaque prestataire à sa fiche publique : son badge « Labellisé AGATOUR » suit alors le label.",
        "Review documents, grant or revoke labels, and link each provider to its public listing: its “AGATOUR labelled” badge then follows the label.",
      )}
    >
      {notices}
      <Panel title={`${t("Labels prestataires", "Provider labels")} (${providers.length})`}>
        {providers.length === 0 ? (
          <p className="text-sm text-ink/55 dark:text-slate-400">
            {t("Aucun prestataire actif.", "No active provider.")}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-ink/50 dark:text-slate-400">
                <tr>
                  <th className="py-2">{t("Prestataire", "Provider")}</th>
                  <th className="py-2">{t("Catégorie", "Category")}</th>
                  <th className="py-2">Label</th>
                  <th className="py-2">{t("Expire le", "Expires")}</th>
                  <th className="py-2">{t("Justificatifs", "Documents")}</th>
                  <th className="py-2">{t("Fiche publique", "Public listing")}</th>
                  <th className="py-2 text-right">{t("Action", "Action")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-slate-800">
                {providers.map((u) => {
                  const status = u.providerProfile?.labelStatus ?? "NONE";
                  return (
                    <tr key={u.id}>
                      <td className="py-3 font-semibold">
                        {u.providerProfile?.businessName ?? u.name}
                      </td>
                      <td className="py-3">{u.providerProfile?.category ?? "—"}</td>
                      <td className="py-3">{LABEL_STATUS[status][language]}</td>
                      <td className="py-3">{date(u.providerProfile?.labelExpiresAt ?? null)}</td>
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
                      <td className="py-3">
                        <select
                          value={u.providerProfile?.listingId ?? ""}
                          disabled={busy !== null || !u.providerProfile}
                          aria-label={t("Fiche publique", "Public listing")}
                          onChange={(e) =>
                            run(`ll-${u.id}`, () =>
                              adminLinkListing({
                                data: { userId: u.id, listingId: e.target.value || null },
                              }),
                            )
                          }
                          className="max-w-[200px] rounded-full border border-black/10 bg-cream px-3 py-1.5 text-xs font-semibold disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800"
                        >
                          <option value="">{t("Aucune", "None")}</option>
                          {categoryOrder.map((cat) => (
                            <optgroup key={cat} label={categoryMeta[cat].plural[language]}>
                              {listings
                                .filter((l) => l.category === cat)
                                .map((l) => (
                                  <option
                                    key={l.id}
                                    value={l.id}
                                    disabled={
                                      linkedListings.has(l.id) &&
                                      u.providerProfile?.listingId !== l.id
                                    }
                                  >
                                    {l.name} · {l.city}
                                  </option>
                                ))}
                            </optgroup>
                          ))}
                        </select>
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
                                adminSetLabel({ data: { userId: u.id, grant: true, months: 12 } }),
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
    </AdminPage>
  );
}
