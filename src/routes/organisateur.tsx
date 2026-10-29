import { useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ClipboardList, Loader2, Megaphone, Send, Sparkles } from "lucide-react";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { PageHero, PageShell } from "@/components/layout/PageShell";
import { cities, organiserNeeds } from "@/lib/mice-data";
import { submitRequest, validateContact, type RequestErrors } from "@/lib/requests";
import { saveMyEvent } from "@/lib/my-events";

export const Route = createFileRoute("/organisateur")({
  head: () => ({
    meta: [
      { title: "Espace organisateur — répertoriez votre événement | GabonMICE" },
      {
        name: "description",
        content:
          "Répertoriez votre événement au Gabon, précisez thème, cible et nombre de participants, et exprimez vos besoins en prestations et location de salles.",
      },
    ],
  }),
  component: OrganiserPage,
});

const eventTypes = [
  ["Congrès", "Congress"],
  ["Conférence", "Conference"],
  ["Séminaire", "Seminar"],
  ["Salon / exposition", "Trade show / exhibition"],
  ["Voyage incentive", "Incentive trip"],
  ["Réunion institutionnelle", "Institutional meeting"],
  ["Autre", "Other"],
] as const;

const targets = [
  ["Professionnels / B2B", "Professionals / B2B"],
  ["Institutionnels", "Institutions"],
  ["Investisseurs", "Investors"],
  ["Grand public", "General public"],
  ["Collaborateurs internes", "Internal staff"],
  ["International", "International"],
] as const;

const layouts = [
  ["Théâtre", "Theatre"],
  ["Classe", "Classroom"],
  ["En U", "U-shape"],
  ["Banquet", "Banquet"],
  ["Cocktail", "Cocktail"],
] as const;

function OrganiserPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "partial" | "error">("idle");
  const [errors, setErrors] = useState<RequestErrors & { title?: string; theme?: string }>({});
  const [needs, setNeeds] = useState<string[]>([]);
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);

  const toggle = (list: string[], value: string, set: (v: string[]) => void) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>, isFrench: boolean) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    const get = (key: string) => String(form.get(key) ?? "").trim();
    const contact = {
      name: get("name"),
      organisation: get("organisation"),
      email: get("email"),
      phone: get("phone"),
      attendees: get("attendees"),
    };
    const validation: RequestErrors & { title?: string; theme?: string } = validateContact(
      contact,
      isFrench,
    );
    if (!get("title"))
      validation.title = isFrench
        ? "Indiquez l'intitulé de l'événement."
        : "Enter the event title.";
    if (!get("theme")) validation.theme = isFrench ? "Précisez le thème." : "Specify the theme.";
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      formEl.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }

    const target = [...selectedTargets, get("targetOther")].filter(Boolean).join(", ");
    const publish = form.get("publish") === "on";
    setStatus("sending");
    try {
      const result = await submitRequest({
        kind: "evenement",
        subject: get("title"),
        ...contact,
        details: {
          "Type d'événement": get("eventType"),
          Thème: get("theme"),
          Cible: target,
          Dates: [get("startDate"), get("endDate")].filter(Boolean).join(" → "),
          Ville: get("city"),
          "Lieu souhaité": get("venue"),
          "Besoins en prestations": needs.join(", "),
          "Configuration de salle": get("layout"),
          "Chambres à réserver": get("rooms"),
          "Budget indicatif": get("budget"),
          "Publication dans l'agenda": publish ? "Oui" : "Non",
        },
        message: get("message"),
      });
      saveMyEvent({
        id: crypto.randomUUID?.() ?? String(Date.now()),
        title: get("title"),
        theme: get("theme"),
        target,
        city: get("city"),
        startDate: get("startDate"),
        endDate: get("endDate"),
        attendees: contact.attendees,
        publish,
      });
      setStatus(result === "sent" ? "sent" : "partial");
      formEl.reset();
      setNeeds([]);
      setSelectedTargets([]);
      window.scrollTo({ top: 0, behavior: "smooth" });
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
          "w-full rounded-2xl border border-black/10 bg-cream px-4 py-3 text-sm outline-none transition focus:border-forest focus:bg-white focus:ring-4 focus:ring-forest/10 aria-[invalid=true]:border-red-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white";

        return (
          <>
            <PageHero
              image="/formulaire.png"
              eyebrow={t("Espace organisateur", "Organiser space")}
              title={t("Répertoriez votre événement,", "List your event,")}
              highlight={t("on s'occupe du reste.", "we handle the rest.")}
              intro={t(
                "Décrivez votre événement, sa cible et vos besoins en salles et prestations. L'AGATOUR consulte les prestataires labellisés et vous transmet leurs propositions.",
                "Describe your event, its audience and your venue and service needs. AGATOUR consults labelled providers and forwards their proposals.",
              )}
              crumb={t("Espace organisateur", "Organiser space")}
              homeLabel={t("Accueil", "Home")}
            />

            <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
              <ol className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    icon: ClipboardList,
                    fr: "Répertoriez",
                    en: "List",
                    dFr: "Thème, cible, participants, dates et besoins.",
                    dEn: "Theme, audience, attendees, dates and needs.",
                  },
                  {
                    icon: Megaphone,
                    fr: "L'AGATOUR relaie",
                    en: "AGATOUR relays",
                    dFr: "Votre demande part vers les prestataires labellisés adaptés.",
                    dEn: "Your request goes to the relevant labelled providers.",
                  },
                  {
                    icon: Send,
                    fr: "Recevez vos devis",
                    en: "Receive quotes",
                    dFr: "Salles, hébergement, traiteur, transport : propositions consolidées.",
                    dEn: "Venues, accommodation, catering, transport: consolidated proposals.",
                  },
                ].map(({ icon: Icon, fr, en, dFr, dEn }, i) => (
                  <li
                    key={fr}
                    className="flex gap-4 rounded-[1.5rem] bg-white p-5 shadow-soft dark:bg-slate-900"
                  >
                    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-forest/10 text-forest dark:text-emerald-300">
                      <Icon className="h-6 w-6" />
                      <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-sun text-[10px] font-bold text-white">
                        {i + 1}
                      </span>
                    </span>
                    <div>
                      <p className="font-display font-extrabold">{t(fr, en)}</p>
                      <p className="mt-1 text-sm text-ink/65 dark:text-slate-400">{t(dFr, dEn)}</p>
                    </div>
                  </li>
                ))}
              </ol>

              {status === "sent" || status === "partial" ? (
                <div className="mt-10 rounded-[2rem] bg-white p-10 text-center shadow-soft dark:bg-slate-900">
                  <CheckCircle2 className="mx-auto h-14 w-14 text-forest" />
                  <h2 className="mt-4 font-display text-2xl font-extrabold">
                    {t("Événement répertorié !", "Event listed!")}
                  </h2>
                  <p className="mx-auto mt-3 max-w-lg text-ink/70 dark:text-slate-300">
                    {status === "sent"
                      ? t(
                          "Un e-mail de confirmation vous a été envoyé. L'AGATOUR étudie vos besoins et revient vers vous avec les propositions des prestataires.",
                          "A confirmation email has been sent. AGATOUR is reviewing your needs and will come back with provider proposals.",
                        )
                      : t(
                          "Votre événement est enregistré, mais l'e-mail de confirmation n'a pas pu partir. L'AGATOUR vous recontactera.",
                          "Your event is recorded, but the confirmation email could not be sent. AGATOUR will contact you.",
                        )}
                  </p>
                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Link
                      to="/evenements"
                      className="rounded-full bg-forest-deep px-6 py-3 text-sm font-semibold text-white hover:bg-forest"
                    >
                      {t("Voir l'agenda", "See the calendar")}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      className="rounded-full border border-forest/20 px-6 py-3 text-sm font-semibold text-forest dark:text-slate-200"
                    >
                      {t("Répertorier un autre événement", "List another event")}
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={(e) => handleSubmit(e, isFrench)}
                  noValidate
                  className="mt-10 space-y-6"
                >
                  <Block title={t("1. Votre événement", "1. Your event")}>
                    <Field
                      label={t("Intitulé de l'événement *", "Event title *")}
                      error={errors.title}
                      className="sm:col-span-2"
                    >
                      <input
                        name="title"
                        className={input}
                        aria-invalid={!!errors.title}
                        placeholder={t(
                          "Ex. Forum régional de l'énergie",
                          "e.g. Regional Energy Forum",
                        )}
                      />
                    </Field>
                    <Field label={t("Type d'événement", "Event type")}>
                      <select name="eventType" className={input}>
                        {eventTypes.map(([fr, en]) => (
                          <option key={fr} value={fr}>
                            {t(fr, en)}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label={t("Thème *", "Theme *")} error={errors.theme}>
                      <input
                        name="theme"
                        className={input}
                        aria-invalid={!!errors.theme}
                        placeholder={t("Ex. Transition énergétique", "e.g. Energy transition")}
                      />
                    </Field>
                    <div className="sm:col-span-2">
                      <p className="mb-2 text-sm font-semibold">
                        {t("Cible visée", "Target audience")}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {targets.map(([fr, en]) => (
                          <Toggle
                            key={fr}
                            active={selectedTargets.includes(fr)}
                            onClick={() => toggle(selectedTargets, fr, setSelectedTargets)}
                          >
                            {t(fr, en)}
                          </Toggle>
                        ))}
                      </div>
                      <input
                        name="targetOther"
                        className={`${input} mt-3`}
                        placeholder={t(
                          "Précisez la cible (secteur, profils…)",
                          "Specify the audience (sector, profiles…)",
                        )}
                      />
                    </div>
                    <Field
                      label={t("Participants attendus *", "Expected attendees *")}
                      error={errors.attendees}
                    >
                      <input
                        name="attendees"
                        type="number"
                        min={1}
                        className={input}
                        aria-invalid={!!errors.attendees}
                      />
                    </Field>
                    <Field label={t("Ville", "City")}>
                      <select name="city" className={input}>
                        {cities.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                        <option>{t("Autre / à définir", "Other / to be defined")}</option>
                      </select>
                    </Field>
                    <Field label={t("Date de début", "Start date")}>
                      <input name="startDate" type="date" className={input} />
                    </Field>
                    <Field label={t("Date de fin", "End date")}>
                      <input name="endDate" type="date" className={input} />
                    </Field>
                  </Block>

                  <Block
                    title={t(
                      "2. Vos besoins en prestations et salles",
                      "2. Your service and venue needs",
                    )}
                  >
                    <div className="sm:col-span-2">
                      <div className="flex flex-wrap gap-2">
                        {organiserNeeds.map((need) => (
                          <Toggle
                            key={need.fr}
                            active={needs.includes(need.fr)}
                            onClick={() => toggle(needs, need.fr, setNeeds)}
                          >
                            {need[language]}
                          </Toggle>
                        ))}
                      </div>
                    </div>
                    <Field label={t("Lieu souhaité (si connu)", "Preferred venue (if known)")}>
                      <input
                        name="venue"
                        className={input}
                        placeholder={t("Ex. Palais des Congrès", "e.g. Congress Palace")}
                      />
                    </Field>
                    <Field label={t("Configuration de salle", "Room layout")}>
                      <select name="layout" className={input}>
                        <option value="">{t("Non précisé", "Not specified")}</option>
                        {layouts.map(([fr, en]) => (
                          <option key={fr} value={fr}>
                            {t(fr, en)}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label={t("Chambres à réserver", "Rooms needed")}>
                      <input name="rooms" type="number" min={0} className={input} />
                    </Field>
                    <Field label={t("Budget indicatif", "Indicative budget")}>
                      <input name="budget" className={input} placeholder="FCFA" />
                    </Field>
                    <Field label={t("Précisions", "Details")} className="sm:col-span-2">
                      <textarea
                        name="message"
                        rows={4}
                        className={`${input} resize-y`}
                        placeholder={t(
                          "Programme, contraintes, attentes particulières…",
                          "Schedule, constraints, special requests…",
                        )}
                      />
                    </Field>
                  </Block>

                  <Block title={t("3. Vos coordonnées", "3. Your contact details")}>
                    <Field label={t("Nom complet *", "Full name *")} error={errors.name}>
                      <input
                        name="name"
                        autoComplete="name"
                        className={input}
                        aria-invalid={!!errors.name}
                      />
                    </Field>
                    <Field
                      label={t("Organisation *", "Organisation *")}
                      error={errors.organisation}
                    >
                      <input
                        name="organisation"
                        autoComplete="organization"
                        className={input}
                        aria-invalid={!!errors.organisation}
                      />
                    </Field>
                    <Field label="E-mail *" error={errors.email}>
                      <input
                        name="email"
                        type="email"
                        autoComplete="email"
                        className={input}
                        aria-invalid={!!errors.email}
                      />
                    </Field>
                    <Field label={t("Téléphone *", "Phone *")} error={errors.phone}>
                      <input
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        className={input}
                        aria-invalid={!!errors.phone}
                      />
                    </Field>
                    <label className="flex items-start gap-3 rounded-2xl bg-cream p-4 text-sm dark:bg-slate-800 sm:col-span-2">
                      <input
                        type="checkbox"
                        name="publish"
                        defaultChecked
                        className="mt-0.5 h-4 w-4 accent-[var(--color-forest)]"
                      />
                      <span>
                        <span className="font-semibold">
                          {t(
                            "Publier l'événement dans l'agenda GabonMICE",
                            "Publish the event in the GabonMICE calendar",
                          )}
                        </span>
                        <span className="block text-ink/60 dark:text-slate-400">
                          {t(
                            "Après validation par l'AGATOUR, il sera visible des participants.",
                            "Once validated by AGATOUR, it will be visible to participants.",
                          )}
                        </span>
                      </span>
                    </label>
                  </Block>

                  {status === "error" && (
                    <p className="rounded-2xl bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
                      {t(
                        "Impossible d'enregistrer votre événement. Réessayez ou contactez-nous.",
                        "Unable to save your event. Please try again or contact us.",
                      )}
                    </p>
                  )}
                  {Object.keys(errors).length > 0 && (
                    <p className="text-sm font-semibold text-red-500">
                      {t("Certains champs sont à corriger.", "Some fields need fixing.")}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-sun px-8 py-4 font-semibold text-white shadow-lg shadow-sun/30 transition hover:bg-sun-deep disabled:opacity-60 sm:w-auto"
                  >
                    {status === "sending" ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Sparkles className="h-5 w-5" />
                    )}
                    {status === "sending"
                      ? t("Envoi en cours…", "Sending…")
                      : t("Répertorier mon événement", "List my event")}
                  </button>
                  <LoadingOverlay
                    show={status === "sending"}
                    message={{ fr: "Envoi de votre demande…", en: "Sending your request…" }}
                  />
                </form>
              )}
            </section>
          </>
        );
      }}
    </PageShell>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="rounded-[2rem] bg-white p-6 shadow-soft dark:bg-slate-900 sm:p-8">
      <legend className="sr-only">{title}</legend>
      <h2 className="mb-5 font-display text-xl font-extrabold text-forest-deep dark:text-white">
        {title}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
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

function Toggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-forest bg-forest text-white"
          : "border-black/10 bg-cream text-ink/75 hover:border-forest/40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
      }`}
    >
      {children}
    </button>
  );
}
