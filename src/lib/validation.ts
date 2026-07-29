export interface FormErrors {
  name?: string;
  organisation?: string;
  email?: string;
  phone?: string;
  eventType?: string;
  attendees?: string;
  message?: string;
}

export function validateForm(data: Record<string, string>): FormErrors {
  const errors: FormErrors = {};

  const name = (data.name ?? "").trim();
  if (!name) {
    errors.name = "Le nom complet est obligatoire.";
  } else if (name.length < 2) {
    errors.name = "Le nom doit comporter au moins 2 caractères.";
  }

  const organisation = (data.organisation ?? "").trim();
  if (!organisation) {
    errors.organisation = "Le nom de l'organisation est obligatoire.";
  }

  const email = (data.email ?? "").trim();
  if (!email) {
    errors.email = "L'e-mail est obligatoire.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "L'e-mail doit être valide.";
  }

  const phone = (data.phone ?? "").trim();
  if (!phone) {
    errors.phone = "Le téléphone est obligatoire.";
  } else if (!/^[\d\s+\-().]{7,20}$/.test(phone)) {
    errors.phone = "Le numéro de téléphone n'est pas valide.";
  }

  const eventType = (data.eventType ?? "").trim();
  if (!eventType) {
    errors.eventType = "Le type d'événement est obligatoire.";
  }

  const attendeesRaw = (data.attendees ?? "").trim();
  if (!attendeesRaw) {
    errors.attendees = "Le nombre de participants est obligatoire.";
  } else if (!/^\d+$/.test(attendeesRaw) || parseInt(attendeesRaw, 10) <= 0) {
    errors.attendees = "Le nombre de participants doit être un nombre positif.";
  }

  const message = (data.message ?? "").trim();
  if (!message) {
    errors.message = "Le message est obligatoire.";
  } else if (message.length < 10) {
    errors.message = "Le message doit comporter au moins 10 caractères.";
  }

  return errors;
}

export function sanitizeFormData(data: Record<string, string>): Record<string, string> {
  const sanitized: Record<string, string> = {};
  for (const [key, value] of Object.entries(data)) {
    sanitized[key] = typeof value === "string" ? value.trim() : "";
  }
  return sanitized;
}

export function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
