import { generateUUID } from "@/lib/validation";
import { saveToSheetDB } from "@/lib/sheetdb";
import { createDemande, type DemandeKind } from "@/lib/demandes";

/**
 * Toutes les demandes de l'application (contact, réservation, devis, inscription
 * d'événement, demande de labellisation) suivent le même circuit :
 * enregistrement en base (suivi dans le back office /admin) et copie SheetDB,
 * puis e-mails via /api/sendMail.
 * L'AGATOUR les reçoit et les relaie vers les prestataires concernés.
 */
export type RequestKind = "contact" | "reservation" | "devis" | "evenement" | "labellisation";

export const requestKindLabel: Record<RequestKind, string> = {
  contact: "Contact",
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
  await saveRequest({
    id: uuid,
    kind: request.kind.toUpperCase() as DemandeKind,
    subject: request.subject,
    name: request.name,
    organisation: request.organisation,
    email: request.email,
    phone: request.phone,
    attendees: request.attendees,
    message: request.message.trim(),
    details: request.details,
    sheetType: eventType,
    sheetMessage: message,
    dateCreation,
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

export interface SaveRequestInput {
  id: string;
  kind: DemandeKind;
  subject: string;
  name: string;
  organisation: string;
  email: string;
  phone: string;
  attendees: string;
  message: string;
  details: Record<string, string>;
  /** Colonnes de la feuille SheetDB historique. */
  sheetType: string;
  sheetMessage: string;
  dateCreation: string;
}

/**
 * Enregistre la demande en base et dans SheetDB, en parallèle.
 * Réussit si au moins un des deux enregistrements aboutit (la base peut être
 * absente en aperçu Lovable) ; sinon lève la première erreur.
 */
export async function saveRequest(input: SaveRequestInput): Promise<void> {
  const [db, sheet] = await Promise.allSettled([
    createDemande({
      data: {
        id: input.id,
        kind: input.kind,
        subject: input.subject,
        name: input.name,
        organisation: input.organisation,
        email: input.email,
        phone: input.phone,
        attendees: input.attendees,
        message: input.message,
        details: input.details,
      },
    }),
    saveToSheetDB({
      id: input.id,
      date_creation: input.dateCreation,
      nom_complet: input.name,
      organisation: input.organisation,
      email: input.email,
      telephone: input.phone,
      type_evenement: input.sheetType,
      nombre_participants: input.attendees,
      message: input.sheetMessage,
      statut: "Nouveau",
    }),
  ]);
  if (db.status === "rejected")
    console.error("✗ Enregistrement de la demande en base :", db.reason);
  if (sheet.status === "rejected") console.warn("⚠ Copie SheetDB :", sheet.reason);
  if (db.status === "rejected" && sheet.status === "rejected") throw db.reason;
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
