import { useState } from "react";
import { Mail, Phone, Save } from "lucide-react";
import { Panel } from "@/components/auth/SpaceLayout";
import {
  adminUpdateDemande,
  DEMANDE_STATUSES,
  type DemandeKind,
  type DemandeStatus,
  type getAdminDemandes,
} from "@/lib/demandes";

type Data = Awaited<ReturnType<typeof getAdminDemandes>>;
type Demande = Data["items"][number];
type T = (fr: string, en: string) => string;
type Lang = "fr" | "en";

const DEMANDE_STATUS_LABEL: Record<DemandeStatus, { fr: string; en: string; tone: string }> = {
  NEW: { fr: "Nouvelle", en: "New", tone: "bg-sun/15 text-sun-deep" },
  IN_PROGRESS: {
    fr: "En cours",
    en: "In progress",
    tone: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300",
  },
  DONE: { fr: "Traitée", en: "Done", tone: "bg-forest/10 text-forest dark:text-emerald-300" },
  CANCELLED: {
    fr: "Annulée",
    en: "Cancelled",
    tone: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  },
};

const KIND_LABEL: Record<DemandeKind, { fr: string; en: string }> = {
  CONTACT: { fr: "Contact", en: "Contact" },
  RESERVATION: { fr: "Réservation", en: "Booking" },
  DEVIS: { fr: "Devis", en: "Quote" },
  EVENEMENT: { fr: "Événement", en: "Event" },
  LABELLISATION: { fr: "Labellisation", en: "Labelling" },
};

type Filter = DemandeStatus | "ALL";

export function DemandesPanel({
  data,
  t,
  language,
  busy,
  run,
}: {
  data: Data;
  t: T;
  language: Lang;
  busy: string | null;
  run: (key: string, action: () => Promise<unknown>) => Promise<void>;
}) {
  const [filter, setFilter] = useState<Filter>("NEW");
  const [kind, setKind] = useState<DemandeKind | "ALL">("ALL");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const items = data.items.filter(
    (d) =>
      (filter === "ALL" || d.status === filter) &&
      (kind === "ALL" || d.kind === kind) &&
      (!q ||
        [d.name, d.email, d.organisation, d.subject, d.phone].some((v) =>
          v.toLowerCase().includes(q),
        )),
  );
  const total = DEMANDE_STATUSES.reduce((n, s) => n + data.counts[s], 0);

  return (
    <Panel
      title={`${t("Demandes reçues", "Incoming requests")} (${data.counts.NEW} ${t(
        data.counts.NEW > 1 ? "nouvelles" : "nouvelle",
        "new",
      )})`}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(["NEW", "IN_PROGRESS", "DONE", "CANCELLED", "ALL"] as const).map((s) => {
          const active = filter === s;
          const label = s === "ALL" ? t("Toutes", "All") : DEMANDE_STATUS_LABEL[s][language];
          const count = s === "ALL" ? total : data.counts[s];
          return (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              aria-pressed={active}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                active
                  ? "bg-forest text-white"
                  : "border border-black/10 hover:bg-sand dark:border-slate-700 dark:hover:bg-slate-800"
              }`}
            >
              {label} ({count})
            </button>
          );
        })}
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value as DemandeKind | "ALL")}
          aria-label={t("Type de demande", "Request type")}
          className="rounded-full border border-black/10 bg-cream px-3 py-1.5 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800"
        >
          <option value="ALL">{t("Tous les types", "All types")}</option>
          {(Object.keys(KIND_LABEL) as DemandeKind[]).map((k) => (
            <option key={k} value={k}>
              {KIND_LABEL[k][language]}
            </option>
          ))}
        </select>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("Rechercher (nom, e-mail…)", "Search (name, email…)")}
          className="min-w-0 flex-1 rounded-full border border-black/10 bg-cream px-4 py-1.5 text-sm outline-none focus:border-forest sm:max-w-xs dark:border-slate-700 dark:bg-slate-800"
        />
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-ink/55 dark:text-slate-400">
          {t("Aucune demande à afficher.", "No request to show.")}
        </p>
      ) : (
        <ul className="divide-y divide-black/5 dark:divide-slate-800">
          {items.map((d) => (
            <DemandeItem key={d.id} d={d} t={t} language={language} busy={busy} run={run} />
          ))}
        </ul>
      )}
      {data.items.length >= 300 && (
        <p className="mt-3 text-xs text-ink/50 dark:text-slate-400">
          {t(
            "Seules les 300 demandes les plus récentes sont affichées.",
            "Only the 300 most recent requests are shown.",
          )}
        </p>
      )}
    </Panel>
  );
}

function DemandeItem({
  d,
  t,
  language,
  busy,
  run,
}: {
  d: Demande;
  t: T;
  language: Lang;
  busy: string | null;
  run: (key: string, action: () => Promise<unknown>) => Promise<void>;
}) {
  const [note, setNote] = useState(d.adminNote ?? "");
  const noteChanged = note.trim() !== (d.adminNote ?? "");
  const locale = language === "fr" ? "fr-FR" : "en-GB";
  const details = Object.entries(d.details);
  const replySubject = encodeURIComponent(
    `GabonMICE — ${KIND_LABEL[d.kind][language]} : ${d.subject}`,
  );

  return (
    <li className="py-4">
      <details className="group">
        <summary className="flex cursor-pointer list-none flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="font-semibold">
              <span className="mr-2 rounded-full bg-sand px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-ink/70 dark:bg-slate-800 dark:text-slate-300">
                {KIND_LABEL[d.kind][language]}
              </span>
              {d.subject}
            </p>
            <p className="truncate text-sm text-ink/65 dark:text-slate-400">
              {d.name} · {d.organisation} · {new Date(d.createdAt).toLocaleString(locale)}
              {d.adminNote ? ` · ${t("annotée", "has note")}` : ""}
            </p>
          </div>
          <span
            className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${DEMANDE_STATUS_LABEL[d.status].tone}`}
          >
            {DEMANDE_STATUS_LABEL[d.status][language]}
          </span>
        </summary>

        <div className="mt-4 grid gap-5 rounded-2xl bg-cream/60 p-4 text-sm md:grid-cols-2 dark:bg-slate-800/50">
          <div className="space-y-3">
            <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1.5">
              <dt className="text-ink/55 dark:text-slate-400">{t("Contact", "Contact")}</dt>
              <dd className="font-semibold">{d.name}</dd>
              <dt className="text-ink/55 dark:text-slate-400">
                {t("Organisation", "Organisation")}
              </dt>
              <dd>{d.organisation}</dd>
              <dt className="text-ink/55 dark:text-slate-400">E-mail</dt>
              <dd className="break-all">{d.email}</dd>
              <dt className="text-ink/55 dark:text-slate-400">{t("Téléphone", "Phone")}</dt>
              <dd>{d.phone}</dd>
              {d.attendees && (
                <>
                  <dt className="text-ink/55 dark:text-slate-400">
                    {t("Participants", "Attendees")}
                  </dt>
                  <dd>{d.attendees}</dd>
                </>
              )}
              {details.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-ink/55 dark:text-slate-400">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
              <dt className="text-ink/55 dark:text-slate-400">{t("Référence", "Reference")}</dt>
              <dd className="font-mono text-xs">{d.id}</dd>
            </dl>
            {d.message && (
              <p className="whitespace-pre-line rounded-xl bg-white p-3 dark:bg-slate-900">
                {d.message}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <a
                href={`mailto:${d.email}?subject=${replySubject}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-forest px-4 py-2 text-xs font-semibold text-white hover:bg-forest-deep"
              >
                <Mail className="h-3.5 w-3.5" /> {t("Répondre", "Reply")}
              </a>
              <a
                href={`tel:${d.phone.replace(/[^\d+]/g, "")}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-2 text-xs font-semibold hover:bg-sand dark:border-slate-700"
              >
                <Phone className="h-3.5 w-3.5" /> {t("Appeler", "Call")}
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink/55 dark:text-slate-400">
                {t("Statut", "Status")}
              </span>
              <select
                value={d.status}
                disabled={busy !== null}
                onChange={(e) =>
                  run(`ds-${d.id}`, () =>
                    adminUpdateDemande({
                      data: { id: d.id, status: e.target.value as DemandeStatus },
                    }),
                  )
                }
                className={`rounded-full px-3 py-1.5 text-xs font-semibold disabled:opacity-60 ${DEMANDE_STATUS_LABEL[d.status].tone}`}
              >
                {DEMANDE_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {DEMANDE_STATUS_LABEL[s][language]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink/55 dark:text-slate-400">
                {t("Note interne", "Internal note")}
              </span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                maxLength={2000}
                placeholder={t(
                  "Ex. : transmis à l'hôtel X le 12/11, relancer vendredi.",
                  "E.g. forwarded to hotel X on 12/11, follow up Friday.",
                )}
                className="w-full resize-y rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:border-forest dark:border-slate-700 dark:bg-slate-900"
              />
            </label>
            <button
              type="button"
              disabled={busy !== null || !noteChanged}
              onClick={() =>
                run(`dn-${d.id}`, () =>
                  adminUpdateDemande({ data: { id: d.id, adminNote: note.trim() } }),
                )
              }
              className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-2 text-xs font-semibold hover:bg-sand disabled:opacity-50 dark:border-slate-700"
            >
              <Save className="h-3.5 w-3.5" /> {t("Enregistrer la note", "Save note")}
            </button>
            <p className="text-xs text-ink/50 dark:text-slate-400">
              {t("Dernière mise à jour", "Last updated")} :{" "}
              {new Date(d.updatedAt).toLocaleString(locale)}
            </p>
          </div>
        </div>
      </details>
    </li>
  );
}
