import { useState, type FormEvent } from "react";
import { useToast } from "./Toast";
import { validateForm, sanitizeFormData, generateUUID } from "@/lib/validation";
import { saveToSheetDB } from "@/lib/sheetdb";
import type { FormErrors } from "@/lib/validation";

interface ContactFormProps {
  language: "fr" | "en";
  theme: "light" | "dark";
}

export function ContactForm({ language, theme }: ContactFormProps) {
  const addToast = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const isFrench = language === "fr";
  const isDark = theme === "dark";
  const muted = isDark ? "text-slate-300" : "text-slate-600";
  const input = isDark
    ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-400 focus:bg-slate-800"
    : "border-slate-200 bg-slate-50 text-slate-900 focus:bg-white";
  const required = isFrench
    ? "Les champs marqués d'un astérisque sont obligatoires."
    : "Fields marked with an asterisk are required.";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    const form = event.currentTarget;
    const rawData = new FormData(form);
    const data: Record<string, string> = {};
    rawData.forEach((value, key) => {
      data[key] = typeof value === "string" ? value : "";
    });

    const sanitized = sanitizeFormData(data);
    const validationErrors = validateForm(sanitized);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const uuid = generateUUID();
      const now = new Date();
      const dateCreation = now.toISOString().slice(0, 10);
      const hourCreation = now.toTimeString().slice(0, 8);

      const sheetData = {
        id: uuid,
        date_creation: dateCreation,
        nom_complet: sanitized.name,
        organisation: sanitized.organisation,
        email: sanitized.email,
        telephone: sanitized.phone,
        type_evenement: sanitized.eventType,
        nombre_participants: sanitized.attendees,
        message: sanitized.message,
        statut: "Nouveau",
      };

      console.log("✔ Données enregistrées dans SheetDB");
      await saveToSheetDB(sheetData);

      try {
        const emailResponse = await fetch("/api/sendMail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: sanitized.email,
            nom: sanitized.name,
            organisation: sanitized.organisation,
            telephone: sanitized.phone,
            eventType: sanitized.eventType,
            attendees: sanitized.attendees,
            message: sanitized.message,
            date: dateCreation,
            heure: hourCreation,
            uuid,
          }),
        });

        if (!emailResponse.ok) {
          throw new Error("Email API error");
        }

        console.log("✔ Email client envoyé");
        console.log("✔ Notification interne envoyée");

        addToast(
          "success",
          isFrench ? "Demande envoyée !" : "Request sent!",
          isFrench
            ? "Votre demande a été enregistrée. Un email de confirmation vient de vous être envoyé."
            : "Your request has been recorded. A confirmation email has been sent to you.",
        );
      } catch (emailErr) {
        console.warn("⚠ SheetDB OK mais erreur lors de l'envoi des emails:", emailErr);
        addToast(
          "info",
          isFrench ? "Demande enregistrée" : "Request recorded",
          isFrench
            ? "Votre demande a bien été enregistrée. Cependant une erreur est survenue lors de l'envoi du mail de confirmation. Notre équipe prendra tout de même contact avec vous."
            : "Your request has been recorded. However, an error occurred while sending the confirmation email. Our team will still contact you.",
        );
      }

      form.reset();
      setErrors({});
    } catch (err) {
      console.error("✗ Erreur SheetDB:", err);
      addToast(
        "error",
        "Erreur",
        isFrench
          ? "Impossible d'enregistrer votre demande. Veuillez réessayer ou nous contacter directement."
          : "Unable to save your request. Please try again or contact us directly.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-5 sm:grid-cols-2" noValidate>
      <Field
        label={isFrench ? "Nom complet" : "Full name"}
        name="name"
        inputClass={input}
        required
        error={errors.name}
      />
      <Field
        label={isFrench ? "Organisation" : "Organisation"}
        name="organisation"
        inputClass={input}
        required
        error={errors.organisation}
      />
      <Field
        label={isFrench ? "E-mail" : "Email"}
        name="email"
        type="email"
        inputClass={input}
        required
        error={errors.email}
      />
      <Field
        label={isFrench ? "Téléphone" : "Phone"}
        name="phone"
        type="tel"
        inputClass={input}
        required
        error={errors.phone}
      />
      <Field
        label={isFrench ? "Type d'événement" : "Event type"}
        name="eventType"
        inputClass={input}
        required
        error={errors.eventType}
      />
      <Field
        label={isFrench ? "Nombre de participants" : "Attendees"}
        name="attendees"
        type="number"
        inputClass={input}
        required
        error={errors.attendees}
      />
      <label className="sm:col-span-2">
        <span className={`mb-2 block text-sm font-semibold ${muted}`}>
          {isFrench ? "Votre message" : "Your message"} <span className="text-forest">*</span>
        </span>
        <textarea
          required
          name="message"
          rows={5}
          className={`w-full resize-y rounded-xl border px-4 py-3 outline-none transition focus:border-forest focus:ring-4 focus:ring-forest/10 ${input}`}
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-500 font-semibold">{errors.message}</p>
        )}
      </label>
      <button
        type="submit"
        disabled={loading}
        className={`sm:col-span-2 rounded-full px-7 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg transition hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed ${
          isDark ? "bg-forest shadow-forest/25" : "bg-forest shadow-forest/25"
        }`}
      >
        {loading
          ? isFrench
            ? "Envoi en cours..."
            : "Sending..."
          : isFrench
            ? "Envoyer la demande"
            : "Send request"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  inputClass,
  required = false,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  inputClass: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-semibold">
        {label} {required && <span className="text-forest">*</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:border-forest focus:ring-4 focus:ring-forest/10 ${inputClass}`}
      />
      {error && <p className="mt-1 text-xs text-red-500 font-semibold">{error}</p>}
    </label>
  );
}
