import { useRef, useState, type FormEvent } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
  BadgeCheck,
  CalendarCheck,
  Clock3,
  ExternalLink,
  FileText,
  Loader2,
  ShieldOff,
  Trash2,
  Upload,
} from "lucide-react";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { PageShell } from "@/components/layout/PageShell";
import { Panel, SpaceHeader } from "@/components/auth/SpaceLayout";
import { Notice } from "@/components/auth/AuthUI";
import {
  deleteProviderDocument,
  getMyProfile,
  listMyDocuments,
  uploadProviderDocument,
} from "@/lib/auth/functions";
import { errorMessage } from "@/lib/auth/schemas";

export const Route = createFileRoute("/espace/prestataire")({
  loader: async () => {
    const [profile, docs] = await Promise.all([getMyProfile(), listMyDocuments()]);
    return { profile, docs };
  },
  head: () => ({ meta: [{ title: "Mon espace prestataire | GabonMICE" }] }),
  component: ProviderSpace,
});

const labelInfo = {
  GRANTED: {
    icon: BadgeCheck,
    tone: "bg-forest/10 text-forest dark:text-emerald-300",
    fr: "Labellisé AGATOUR",
    en: "AGATOUR labelled",
  },
  PENDING: {
    icon: Clock3,
    tone: "bg-sun/15 text-sun-deep",
    fr: "Labellisation en cours d'examen",
    en: "Labelling under review",
  },
  REVOKED: {
    icon: ShieldOff,
    tone: "bg-red-50 text-red-600 dark:bg-red-950/40",
    fr: "Label retiré",
    en: "Label revoked",
  },
  NONE: {
    icon: Clock3,
    tone: "bg-cream text-ink/70 dark:bg-slate-800",
    fr: "Non labellisé",
    en: "Not labelled",
  },
} as const;

function ProviderSpace() {
  const { session } = Route.useRouteContext();
  const { profile, docs } = Route.useLoaderData();
  const provider = profile?.providerProfile;
  const label = labelInfo[provider?.labelStatus ?? "NONE"];
  const LabelIcon = label.icon;

  return (
    <PageShell>
      {({ t, language }) => (
        <>
          <SpaceHeader
            session={session}
            language={language}
            title={t("Mon espace prestataire", "My provider space")}
            subtitle={provider?.businessName ?? ""}
          />
          <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
            <Panel title={t("Label AGATOUR", "AGATOUR label")}>
              <div
                className={`flex items-center gap-3 rounded-2xl p-4 font-semibold ${label.tone}`}
              >
                <LabelIcon className="h-6 w-6 shrink-0" />
                {t(label.fr, label.en)}
              </div>
              {provider?.labelExpiresAt && provider.labelStatus === "GRANTED" && (
                <p className="mt-3 text-sm text-ink/60 dark:text-slate-400">
                  {t("Valide jusqu'au", "Valid until")}{" "}
                  {new Date(provider.labelExpiresAt).toLocaleDateString(
                    language === "fr" ? "fr-FR" : "en-GB",
                  )}
                </p>
              )}
              <p className="mt-3 text-sm text-ink/60 dark:text-slate-400">
                {t(
                  "Seuls les prestataires labellisés apparaissent dans l'annuaire et reçoivent les demandes.",
                  "Only labelled providers appear in the directory and receive requests.",
                )}
              </p>
            </Panel>

            <Panel
              title={t("Réservations et devis", "Bookings and quotes")}
              className="lg:col-span-2"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-cream p-4 dark:bg-slate-800">
                  <CalendarCheck className="h-6 w-6 text-forest dark:text-sun" />
                  <p className="mt-2 font-semibold">
                    {t("Demandes de réservation", "Booking requests")}
                  </p>
                  <p className="mt-1 text-sm text-ink/60 dark:text-slate-400">
                    {t(
                      "Transmises par l'AGATOUR depuis l'application.",
                      "Forwarded by AGATOUR from the app.",
                    )}
                  </p>
                </div>
                <div className="rounded-2xl bg-cream p-4 dark:bg-slate-800">
                  <FileText className="h-6 w-6 text-forest dark:text-sun" />
                  <p className="mt-2 font-semibold">{t("Demandes de devis", "Quote requests")}</p>
                  <p className="mt-1 text-sm text-ink/60 dark:text-slate-400">
                    {t(
                      "Besoins des organisateurs relayés par l'AGATOUR.",
                      "Organiser needs relayed by AGATOUR.",
                    )}
                  </p>
                </div>
              </div>
              <p className="mt-4 rounded-2xl border border-dashed border-black/10 p-4 text-sm text-ink/55 dark:border-slate-700 dark:text-slate-400">
                {t(
                  "Bientôt : la liste de vos demandes et leur suivi apparaîtront ici. En attendant, l'AGATOUR vous les transmet directement.",
                  "Coming soon: your requests and their follow-up will appear here. Meanwhile, AGATOUR forwards them to you directly.",
                )}
              </p>
            </Panel>

            <Panel title={t("Mon établissement", "My business")} className="lg:col-span-3">
              <dl className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
                <Row label={t("Raison sociale", "Company name")} value={provider?.businessName} />
                <Row label={t("Catégorie", "Category")} value={provider?.category} />
                <Row label={t("Adresse", "Address")} value={provider?.address} />
                <Row label={t("Téléphone", "Phone")} value={profile?.phone} />
              </dl>
            </Panel>

            <DocumentsPanel data={docs} language={language} className="lg:col-span-3" />
          </section>
        </>
      )}
    </PageShell>
  );
}

type DocsData = Awaited<ReturnType<typeof listMyDocuments>>;

/** Justificatifs de labellisation : envoi vers Neon Object Storage, liste et suppression. */
function DocumentsPanel({
  data,
  language,
  className,
}: {
  data: DocsData;
  language: "fr" | "en";
  className?: string;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const t = (fr: string, en: string) => (language === "fr" ? fr : en);

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const file = inputRef.current?.files?.[0];
    if (!file) return setError(t("Choisissez un fichier.", "Choose a file."));
    setError(null);
    setBusy("upload");
    try {
      const form = new FormData();
      form.append("file", file);
      await uploadProviderDocument({ data: form });
      if (inputRef.current) inputRef.current.value = "";
      await router.invalidate();
    } catch (e) {
      setError(errorMessage(e, t("Envoi impossible.", "Upload failed.")));
    } finally {
      setBusy(null);
    }
  }

  async function handleDelete(id: string) {
    setBusy(id);
    setError(null);
    try {
      await deleteProviderDocument({ data: { id } });
      await router.invalidate();
    } catch (e) {
      setError(errorMessage(e, t("Suppression impossible.", "Delete failed.")));
    } finally {
      setBusy(null);
    }
  }

  return (
    <Panel title={t("Documents de labellisation", "Labelling documents")} className={className}>
      <p className="mb-4 text-sm text-ink/60 dark:text-slate-400">
        {t(
          "Déposez vos justificatifs (licence, assurance, photos de l'établissement…) : l'AGATOUR les consulte pour accorder le label. PDF, JPG, PNG ou WebP, 5 Mo maximum.",
          "Upload your supporting documents (licence, insurance, photos…): AGATOUR reviews them to grant the label. PDF, JPG, PNG or WebP, 5 MB max.",
        )}
      </p>
      {!data.storage ? (
        <Notice tone="info">
          {t("Le stockage de fichiers n'est pas configuré.", "File storage is not configured.")}
        </Notice>
      ) : (
        <form onSubmit={handleUpload} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            ref={inputRef}
            name="file"
            type="file"
            accept="application/pdf,image/jpeg,image/png,image/webp"
            className="min-w-0 flex-1 rounded-2xl border border-dashed border-black/15 bg-cream px-4 py-3 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-forest-deep file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-white dark:border-slate-700 dark:bg-slate-800"
          />
          <button
            type="submit"
            disabled={busy !== null}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-sun px-5 py-3 text-sm font-semibold text-white hover:bg-sun-deep disabled:opacity-60"
          >
            {busy === "upload" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {t("Envoyer", "Upload")}
          </button>
          <LoadingOverlay
            show={busy !== null}
            message={
              busy === "upload"
                ? { fr: "Envoi du justificatif…", en: "Uploading document…" }
                : { fr: "Suppression…", en: "Deleting…" }
            }
          />
        </form>
      )}
      {error && (
        <div className="mt-3">
          <Notice tone="error">{error}</Notice>
        </div>
      )}
      <ul className="mt-4 divide-y divide-black/5 dark:divide-slate-800">
        {data.documents.length === 0 && (
          <li className="py-3 text-sm text-ink/50 dark:text-slate-400">
            {t("Aucun document pour l'instant.", "No documents yet.")}
          </li>
        )}
        {data.documents.map((d) => (
          <li key={d.id} className="flex items-center gap-3 py-3 text-sm">
            <FileText className="h-5 w-5 shrink-0 text-forest dark:text-sun" />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-semibold">{d.fileName}</span>
              <span className="text-xs text-ink/50 dark:text-slate-400">
                {(d.size / 1024).toFixed(0)} Ko ·{" "}
                {new Date(d.createdAt).toLocaleDateString(language === "fr" ? "fr-FR" : "en-GB")}
              </span>
            </span>
            {d.url && (
              <a
                href={d.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-forest hover:bg-cream dark:text-emerald-300 dark:hover:bg-slate-800"
              >
                <ExternalLink className="h-3.5 w-3.5" /> {t("Ouvrir", "Open")}
              </a>
            )}
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => handleDelete(d.id)}
              aria-label={t("Supprimer", "Delete")}
              className="rounded-full p-2 text-red-600 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950/40"
            >
              {busy === d.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-4 border-b border-black/5 pb-2 dark:border-slate-800">
      <dt className="text-ink/55 dark:text-slate-400">{label}</dt>
      <dd className="truncate font-medium">{value || "—"}</dd>
    </div>
  );
}
