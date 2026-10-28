import { useEffect, useRef, useState, type FormEvent } from "react";
import { CalendarCheck, CheckCircle2, FileText, Loader2, ShieldCheck, X } from "lucide-react";
import { submitRequest, validateContact, type RequestErrors } from "@/lib/requests";

export type RequestTarget = {
  kind: "reservation" | "devis";
  /** Nom de l'offre, de la salle, de l'hôtel… */
  subject: string;
  /** Prestataire ou lieu, affiché sous le titre. */
  provider?: string;
  minGroup?: number;
  /** Tarif unitaire en FCFA, pour l'estimation. */
  unitPrice?: number;
};

/**
 * Fenêtre de réservation ou de demande de devis. La demande est enregistrée
 * puis relayée par l'AGATOUR vers le prestataire concerné.
 */
export function RequestDialog({
  target,
  onClose,
  isFrench,
}: {
  target: RequestTarget | null;
  onClose: () => void;
  isFrench: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "partial" | "error">("idle");
  const [errors, setErrors] = useState<RequestErrors>({});
  const [attendees, setAttendees] = useState("");
  const t = (fr: string, en: string) => (isFrench ? fr : en);
  // Le parent recrée souvent onClose : on le garde dans une ref pour ne
  // réinitialiser le formulaire qu'à l'ouverture d'une nouvelle demande.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!target) return;
    setStatus("idle");
    setErrors({});
    setAttendees(target.minGroup ? String(target.minGroup) : "");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCloseRef.current();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [target]);

  if (!target) return null;
  const isBooking = target.kind === "reservation";
  const count = parseInt(attendees, 10);
  const estimate = target.unitPrice && count > 0 ? target.unitPrice * count : null;
  const belowMin = target.minGroup && count > 0 && count < target.minGroup;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!target) return;
    const form = new FormData(event.currentTarget);
    const get = (key: string) => String(form.get(key) ?? "").trim();
    const contact = {
      name: get("name"),
      organisation: get("organisation"),
      email: get("email"),
      phone: get("phone"),
      attendees: get("attendees"),
    };
    const validation = validateContact(contact, isFrench);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setStatus("sending");
    try {
      const result = await submitRequest({
        kind: target.kind,
        subject: target.subject,
        ...contact,
        details: {
          Prestataire: target.provider ?? "",
          "Date souhaitée": get("dateStart"),
          "Date de fin": get("dateEnd"),
          Estimation: estimate ? `${estimate.toLocaleString("fr-FR")} FCFA` : "",
        },
        message: get("message"),
      });
      setStatus(result === "sent" ? "sent" : "partial");
    } catch (error) {
      console.error("✗ Erreur d'enregistrement :", error);
      setStatus("error");
    }
  }

  const input =
    "w-full rounded-2xl border border-black/10 bg-cream px-4 py-3 text-sm outline-none transition focus:border-forest focus:bg-white focus:ring-4 focus:ring-forest/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800";

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center bg-ink/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isBooking ? t("Réserver", "Book") : t("Demander un devis", "Request a quote")}
        className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-[2rem] bg-white text-ink shadow-2xl dark:bg-slate-900 dark:text-slate-100 sm:rounded-[2rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-black/5 bg-white/95 px-6 py-5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:px-8">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sun/15 text-sun-deep">
              {isBooking ? <CalendarCheck className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sun-deep">
                {isBooking ? t("Réservation", "Booking") : t("Demande de devis", "Quote request")}
              </p>
              <h2 className="font-display text-xl font-extrabold leading-tight">
                {target.subject}
              </h2>
              {target.provider && (
                <p className="text-sm text-ink/60 dark:text-slate-400">{target.provider}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("Fermer", "Close")}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream hover:bg-sand dark:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {status === "sent" || status === "partial" ? (
          <div className="px-6 py-10 text-center sm:px-10">
            <CheckCircle2 className="mx-auto h-14 w-14 text-forest" />
            <h3 className="mt-4 font-display text-2xl font-extrabold">
              {t("Demande transmise !", "Request sent!")}
            </h3>
            <p className="mx-auto mt-3 max-w-md text-ink/70 dark:text-slate-300">
              {status === "sent"
                ? t(
                    "Un e-mail de confirmation vient de vous être envoyé. L'AGATOUR relaie votre demande au prestataire, qui vous recontacte rapidement.",
                    "A confirmation email has been sent. AGATOUR is relaying your request to the provider, who will contact you shortly.",
                  )
                : t(
                    "Votre demande est enregistrée, mais l'e-mail de confirmation n'a pas pu partir. L'AGATOUR vous recontactera tout de même.",
                    "Your request is recorded, but the confirmation email could not be sent. AGATOUR will still contact you.",
                  )}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-8 rounded-full bg-forest-deep px-7 py-3 text-sm font-semibold text-white hover:bg-forest"
            >
              {t("Fermer", "Close")}
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="grid gap-4 px-6 py-6 sm:grid-cols-2 sm:px-8"
          >
            <Field label={t("Nom complet", "Full name")} error={errors.name}>
              <input name="name" autoComplete="name" className={input} />
            </Field>
            <Field label={t("Organisation", "Organisation")} error={errors.organisation}>
              <input name="organisation" autoComplete="organization" className={input} />
            </Field>
            <Field label="E-mail" error={errors.email}>
              <input name="email" type="email" autoComplete="email" className={input} />
            </Field>
            <Field label={t("Téléphone", "Phone")} error={errors.phone}>
              <input name="phone" type="tel" autoComplete="tel" className={input} />
            </Field>
            <Field
              label={
                isBooking ? t("Date souhaitée", "Preferred date") : t("Date de début", "Start date")
              }
            >
              <input name="dateStart" type="date" className={input} />
            </Field>
            <Field label={t("Date de fin (optionnel)", "End date (optional)")}>
              <input name="dateEnd" type="date" className={input} />
            </Field>
            <Field
              label={t("Nombre de participants", "Number of attendees")}
              error={errors.attendees}
              hint={
                target.minGroup
                  ? t(
                      `Groupe à partir de ${target.minGroup} personnes`,
                      `Groups from ${target.minGroup} people`,
                    )
                  : undefined
              }
            >
              <input
                name="attendees"
                type="number"
                min={1}
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                className={input}
              />
            </Field>
            <div className="flex flex-col justify-end">
              {estimate ? (
                <div className="rounded-2xl bg-forest/10 px-4 py-3 dark:bg-forest/20">
                  <p className="text-xs text-ink/60 dark:text-slate-400">
                    {t("Estimation indicative", "Indicative estimate")}
                  </p>
                  <p className="font-display text-lg font-extrabold text-forest dark:text-emerald-300">
                    {estimate.toLocaleString("fr-FR")} FCFA
                  </p>
                </div>
              ) : null}
              {belowMin ? (
                <p className="mt-2 text-xs font-semibold text-sun-deep">
                  {t(
                    "En dessous du minimum : le prestataire vous proposera une alternative.",
                    "Below the minimum: the provider will suggest an alternative.",
                  )}
                </p>
              ) : null}
            </div>
            <Field
              label={t("Précisions (programme, besoins…)", "Details (schedule, needs…)")}
              className="sm:col-span-2"
            >
              <textarea name="message" rows={3} className={`${input} resize-y`} />
            </Field>

            <div className="flex items-start gap-2 rounded-2xl bg-cream px-4 py-3 text-xs text-ink/70 dark:bg-slate-800 dark:text-slate-300 sm:col-span-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
              {t(
                "Votre demande est transmise à l'AGATOUR, qui la relaie au prestataire labellisé. Aucun paiement n'est demandé à cette étape.",
                "Your request goes to AGATOUR, which relays it to the labelled provider. No payment is required at this stage.",
              )}
            </div>

            {status === "error" && (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 sm:col-span-2">
                {t(
                  "Impossible d'enregistrer votre demande. Réessayez ou contactez-nous directement.",
                  "Unable to save your request. Please try again or contact us directly.",
                )}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sun px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sun/30 transition hover:bg-sun-deep disabled:opacity-60 sm:col-span-2"
            >
              {status === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
              {status === "sending"
                ? t("Envoi en cours…", "Sending…")
                : isBooking
                  ? t("Envoyer ma réservation", "Send my booking")
                  : t("Envoyer ma demande de devis", "Send my quote request")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  hint,
  className = "",
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
      {hint && !error && (
        <span className="mt-1 block text-xs text-ink/50 dark:text-slate-400">{hint}</span>
      )}
      {error && <span className="mt-1 block text-xs font-semibold text-red-500">{error}</span>}
    </label>
  );
}
