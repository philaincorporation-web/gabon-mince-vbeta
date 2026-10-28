import { useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  FileSignature,
  FileText,
  Loader2,
  SearchCheck,
  Store,
} from "lucide-react";
import { PageHero, PageShell, SectionTitle } from "@/components/layout/PageShell";
import { ListingCard } from "@/components/mice/Cards";
import { ListingDetailDialog } from "@/components/mice/DetailDialogs";
import { RequestDialog, type RequestTarget } from "@/components/mice/RequestDialog";
import { categoryMeta, categoryOrder, cities, listings, type Listing } from "@/lib/mice-data";
import { submitRequest, validateContact, type RequestErrors } from "@/lib/requests";

export const Route = createFileRoute("/prestataires")({
  head: () => ({
    meta: [
      { title: "Espace prestataire — labellisation AGATOUR | GabonMICE" },
      {
        name: "description",
        content:
          "Hôteliers, salles, restaurateurs, agences : faites-vous labelliser par l'AGATOUR et recevez réservations et demandes de devis via GabonMICE.",
      },
    ],
  }),
  component: ProvidersPage,
});

const labelled = listings.filter((l) => l.labelled && l.category !== "agence");

function ProvidersPage() {
  const [selected, setSelected] = useState<Listing | null>(null);
  const [request, setRequest] = useState<RequestTarget | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "partial" | "error">("idle");
  const [errors, setErrors] = useState<RequestErrors & { company?: string }>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>, isFrench: boolean) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    const get = (key: string) => String(form.get(key) ?? "").trim();
    const contact = {
      name: get("name"),
      organisation: get("company"),
      email: get("email"),
      phone: get("phone"),
      attendees: get("capacity"),
    };
    const validation: RequestErrors & { company?: string } = validateContact(contact, isFrench);
    if (validation.organisation) {
      validation.company = isFrench ? "Indiquez la raison sociale." : "Enter the company name.";
      delete validation.organisation;
    }
    if (validation.attendees)
      validation.attendees = isFrench ? "Indiquez une capacité d'accueil." : "Enter a capacity.";
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setStatus("sending");
    try {
      const result = await submitRequest({
        kind: "labellisation",
        subject: get("company"),
        ...contact,
        details: {
          Catégorie: get("category"),
          Ville: get("city"),
          "Capacité d'accueil": get("capacity"),
          Services: get("services"),
          "Site web / réseaux": get("website"),
        },
        message: get("message"),
      });
      setStatus(result === "sent" ? "sent" : "partial");
      formEl.reset();
    } catch (error) {
      console.error("✗ Erreur d'enregistrement :", error);
      setStatus("error");
    }
  }

  return (
    <PageShell>
      {({ language, t }) => {
        const isFrench = language === "fr";
        const input =
          "w-full rounded-2xl border border-black/10 bg-cream px-4 py-3 text-sm outline-none transition focus:border-forest focus:bg-white focus:ring-4 focus:ring-forest/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white";
        return (
          <>
            <PageHero
              image="/tortue3.jpg"
              eyebrow={t("Espace prestataire", "Provider space")}
              title={t("Labellisé AGATOUR,", "AGATOUR labelled,")}
              highlight={t("visible et réservable.", "visible and bookable.")}
              intro={t(
                "Hôtels, lodges, salles, restaurants, agences, guides : rejoignez l'annuaire officiel du tourisme d'affaires et recevez réservations et demandes de devis relayées par l'AGATOUR.",
                "Hotels, lodges, venues, restaurants, agencies, guides: join the official business tourism directory and receive bookings and quote requests relayed by AGATOUR.",
              )}
              crumb={t("Prestataires", "Providers")}
              homeLabel={t("Accueil", "Home")}
            >
              <a
                href="#candidature"
                className="inline-flex rounded-full bg-sun px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-sun-deep"
              >
                {t("Demander la labellisation", "Apply for labelling")}
              </a>
            </PageHero>

            <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 sm:py-20">
              <SectionTitle
                eyebrow={t("Comment ça marche", "How it works")}
                title={t("Du label à vos premières demandes", "From label to your first requests")}
              />
              <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    icon: FileSignature,
                    fr: "Candidature",
                    en: "Application",
                    dFr: "Vous présentez votre établissement et vos services.",
                    dEn: "Present your business and services.",
                  },
                  {
                    icon: SearchCheck,
                    fr: "Évaluation",
                    en: "Assessment",
                    dFr: "L'AGATOUR vérifie la qualité et la conformité de l'offre.",
                    dEn: "AGATOUR checks the quality and compliance of your offer.",
                  },
                  {
                    icon: BadgeCheck,
                    fr: "Labellisation",
                    en: "Labelling",
                    dFr: "Votre fiche est publiée avec le badge « Labellisé AGATOUR ».",
                    dEn: "Your listing goes live with the “AGATOUR labelled” badge.",
                  },
                  {
                    icon: CalendarCheck,
                    fr: "Réservations & devis",
                    en: "Bookings & quotes",
                    dFr: "Vous recevez les demandes des participants et des organisateurs.",
                    dEn: "You receive requests from participants and organisers.",
                  },
                ].map(({ icon: Icon, fr, en, dFr, dEn }, i) => (
                  <li
                    key={fr}
                    className="rounded-[1.75rem] bg-white p-6 shadow-soft dark:bg-slate-900"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest text-white">
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="font-display text-4xl font-extrabold text-sand dark:text-slate-800">
                        0{i + 1}
                      </span>
                    </div>
                    <p className="mt-4 font-display text-lg font-extrabold">{t(fr, en)}</p>
                    <p className="mt-1 text-sm text-ink/65 dark:text-slate-400">{t(dFr, dEn)}</p>
                  </li>
                ))}
              </ol>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Benefit
                  icon={<CalendarCheck className="h-5 w-5" />}
                  title={t("Réservations directes", "Direct bookings")}
                >
                  {t(
                    "Les participants réservent vos prestations depuis l'application ; vous recevez la demande avec dates et nombre de personnes.",
                    "Participants book your services from the app; you receive the request with dates and group size.",
                  )}
                </Benefit>
                <Benefit
                  icon={<FileText className="h-5 w-5" />}
                  title={t("Demandes de devis relayées", "Relayed quote requests")}
                >
                  {t(
                    "Les besoins des organisateurs (salles, traiteur, transport…) vous sont transmis par l'AGATOUR selon votre catégorie.",
                    "Organisers' needs (venues, catering, transport…) are forwarded to you by AGATOUR according to your category.",
                  )}
                </Benefit>
              </div>
            </section>

            <section className="bg-sand/60 py-14 dark:bg-slate-900/50 sm:py-20">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionTitle
                  eyebrow={t("Annuaire", "Directory")}
                  title={t("Prestataires labellisés", "Labelled providers")}
                  text={t(
                    `${labelled.length} prestataires labellisés à ce jour.`,
                    `${labelled.length} labelled providers to date.`,
                  )}
                />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {labelled.map((l) => (
                    <ListingCard
                      key={l.id}
                      listing={l}
                      language={language}
                      onOpen={() => setSelected(l)}
                      onRequest={() =>
                        setRequest({ kind: l.booking, subject: l.name, provider: l.city })
                      }
                    />
                  ))}
                </div>
              </div>
            </section>

            <section
              id="candidature"
              className="mx-auto max-w-4xl scroll-mt-24 px-4 py-14 sm:px-6 sm:py-20"
            >
              <SectionTitle
                eyebrow={t("Candidature", "Application")}
                title={t("Demander la labellisation", "Apply for labelling")}
                text={t(
                  "Réponse de l'AGATOUR sous quelques jours ouvrés.",
                  "AGATOUR will reply within a few working days.",
                )}
              />
              {status === "sent" || status === "partial" ? (
                <div className="rounded-[2rem] bg-white p-10 text-center shadow-soft dark:bg-slate-900">
                  <CheckCircle2 className="mx-auto h-14 w-14 text-forest" />
                  <h3 className="mt-4 font-display text-2xl font-extrabold">
                    {t("Candidature envoyée !", "Application sent!")}
                  </h3>
                  <p className="mx-auto mt-3 max-w-md text-ink/70 dark:text-slate-300">
                    {t(
                      "L'AGATOUR étudie votre dossier et vous contactera pour la suite de la procédure.",
                      "AGATOUR is reviewing your application and will contact you about next steps.",
                    )}
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => handleSubmit(e, isFrench)}
                  noValidate
                  className="grid gap-4 rounded-[2rem] bg-white p-6 shadow-soft dark:bg-slate-900 sm:grid-cols-2 sm:p-8"
                >
                  <Field label={t("Raison sociale *", "Company name *")} error={errors.company}>
                    <input name="company" className={input} />
                  </Field>
                  <Field label={t("Catégorie", "Category")}>
                    <select name="category" className={input}>
                      {categoryOrder.map((c) => (
                        <option key={c} value={categoryMeta[c].label.fr}>
                          {categoryMeta[c].label[language]}
                        </option>
                      ))}
                      <option value="Traiteur / événementiel">
                        {t("Traiteur / événementiel", "Catering / events")}
                      </option>
                      <option value="Transport">{t("Transport", "Transport")}</option>
                    </select>
                  </Field>
                  <Field label={t("Ville", "City")}>
                    <select name="city" className={input}>
                      {cities.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                      <option>{t("Autre", "Other")}</option>
                    </select>
                  </Field>
                  <Field
                    label={t("Capacité d'accueil (pers.) *", "Capacity (people) *")}
                    error={errors.attendees}
                  >
                    <input name="capacity" type="number" min={1} className={input} />
                  </Field>
                  <Field
                    label={t("Services proposés", "Services offered")}
                    className="sm:col-span-2"
                  >
                    <input
                      name="services"
                      className={input}
                      placeholder={t(
                        "Ex. 3 salles, 45 chambres, traiteur, navette",
                        "e.g. 3 rooms, 45 bedrooms, catering, shuttle",
                      )}
                    />
                  </Field>
                  <Field
                    label={t("Site web / réseaux", "Website / social")}
                    className="sm:col-span-2"
                  >
                    <input name="website" className={input} />
                  </Field>
                  <Field label={t("Nom du contact *", "Contact name *")} error={errors.name}>
                    <input name="name" autoComplete="name" className={input} />
                  </Field>
                  <Field label="E-mail *" error={errors.email}>
                    <input name="email" type="email" autoComplete="email" className={input} />
                  </Field>
                  <Field label={t("Téléphone *", "Phone *")} error={errors.phone}>
                    <input name="phone" type="tel" autoComplete="tel" className={input} />
                  </Field>
                  <Field label={t("Message", "Message")} className="sm:col-span-2">
                    <textarea name="message" rows={3} className={`${input} resize-y`} />
                  </Field>
                  {status === "error" && (
                    <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 sm:col-span-2">
                      {t(
                        "Impossible d'envoyer la candidature. Réessayez.",
                        "Unable to send the application. Please try again.",
                      )}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-sun px-7 py-3.5 font-semibold text-white shadow-lg shadow-sun/30 hover:bg-sun-deep disabled:opacity-60 sm:col-span-2"
                  >
                    {status === "sending" ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Store className="h-5 w-5" />
                    )}
                    {status === "sending"
                      ? t("Envoi en cours…", "Sending…")
                      : t("Envoyer ma candidature", "Send my application")}
                  </button>
                </form>
              )}
            </section>

            {selected && (
              <ListingDetailDialog
                listing={selected}
                language={language}
                onClose={() => setSelected(null)}
                onRequest={() => {
                  const l = selected;
                  setSelected(null);
                  setRequest({ kind: l.booking, subject: l.name, provider: l.city });
                }}
              />
            )}
            <RequestDialog target={request} onClose={() => setRequest(null)} isFrench={isFrench} />
          </>
        );
      }}
    </PageShell>
  );
}

function Benefit({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-4 rounded-[1.75rem] bg-forest-deep p-6 text-white">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sun">
        {icon}
      </span>
      <div>
        <p className="font-display text-lg font-extrabold">{title}</p>
        <p className="mt-1 text-sm text-white/75">{children}</p>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  className = "",
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs font-semibold text-red-500">{error}</span>}
    </label>
  );
}
