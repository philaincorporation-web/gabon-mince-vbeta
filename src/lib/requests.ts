import { generateUUID } from "@/lib/validation";
import { saveToSheetDB } from "@/lib/sheetdb";

/**
 * Toutes les demandes de l'application (réservation, devis, inscription
 * d'événement, demande de labellisation) suivent le même circuit que le
 * formulaire de contact : enregistrement SheetDB puis e-mails via /api/sendMail.
 * L'AGATOUR les reçoit et les relaie vers les prestataires concernés.
 */
export type RequestKind = "reservation" | "devis" | "evenement" | "labellisation";

export const requestKindLabel: Record<RequestKind, string> = {
  reservation: "Réservation",
  devis: "Demande de devis",
  evenement: "Inscription d'événement",
  labellisation: "Demande de labellisation prestataire",
};

export interface AppRequest {
  kind: RequestKind;
  /** Élément concerné (offre, salle, hôtel…) ou intitulé de l'événement. */
  subject: string;
  name: string;
  organisation: string;
  email: string;
  phone: string;
  attendees: string;
  /** Détails structurés, ajoutés au message sous forme de lignes « clé : valeur ». */
  details: Record<string, string>;
  message: string;
}

export type SubmitResult = "sent" | "saved-without-email";

export async function submitRequest(request: AppRequest): Promise<SubmitResult> {
  const uuid = generateUUID();
  const now = new Date();
  const dateCreation = now.toISOString().slice(0, 10);
  const hourCreation = now.toTimeString().slice(0, 8);
  const eventType = `${requestKindLabel[request.kind]} — ${request.subject}`;
  const detailLines = Object.entries(request.details)
    .filter(([, value]) => value.trim() !== "")
    .map(([key, value]) => `${key} : ${value}`);
  const message = [...detailLines, request.message.trim()].filter(Boolean).join("\n");

  // Lève une erreur si l'enregistrement échoue : l'appelant affiche l'erreur.
  await saveToSheetDB({
    id: uuid,
    date_creation: dateCreation,
    nom_complet: request.name,
    organisation: request.organisation,
    email: request.email,
    telephone: request.phone,
    type_evenement: eventType,
    nombre_participants: request.attendees,
    message,
    statut: "Nouveau",
  });

  try {
    const response = await fetch("/api/sendMail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: request.email,
        nom: request.name,
        organisation: request.organisation,
        telephone: request.phone,
        eventType,
        attendees: request.attendees,
        message: message || "—",
        date: dateCreation,
        heure: hourCreation,
        uuid,
      }),
    });
    if (!response.ok) throw new Error("Email API error");
    return "sent";
  } catch (error) {
    console.warn("⚠ Demande enregistrée mais e-mail non envoyé :", error);
    return "saved-without-email";
  }
}

export interface RequestErrors {
  name?: string;
  organisation?: string;
  email?: string;
  phone?: string;
  attendees?: string;
}

export function validateContact(
  data: Pick<AppRequest, "name" | "organisation" | "email" | "phone" | "attendees">,
  isFrench: boolean,
): RequestErrors {
  const errors: RequestErrors = {};
  if (data.name.trim().length < 2)
    errors.name = isFrench ? "Indiquez votre nom complet." : "Enter your full name.";
  if (!data.organisation.trim())
    errors.organisation = isFrench ? "Indiquez votre organisation." : "Enter your organisation.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
    errors.email = isFrench ? "E-mail invalide." : "Invalid email.";
  if (!/^[\d\s+\-().]{7,20}$/.test(data.phone.trim()))
    errors.phone = isFrench ? "Numéro de téléphone invalide." : "Invalid phone number.";
  if (!/^\d+$/.test(data.attendees.trim()) || parseInt(data.attendees, 10) <= 0)
    errors.attendees = isFrench
      ? "Nombre de participants invalide."
      : "Invalid number of attendees.";
  return errors;
}
