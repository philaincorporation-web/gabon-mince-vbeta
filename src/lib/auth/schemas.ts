import { z } from "zod";
import { SIGNUP_ROLES } from "@/lib/auth/access";

/** Schémas partagés : validés dans le navigateur ET revalidés par le serveur. */

export const passwordSchema = z
  .string()
  .min(8, "8 caractères minimum.")
  .max(128)
  .regex(/[A-Za-z]/, "Au moins une lettre.")
  .regex(/\d/, "Au moins un chiffre.");

const optionalText = (max: number) => z.string().trim().max(max).optional();

export const registerSchema = z
  .object({
    profile: z.enum(SIGNUP_ROLES), // ADMIN impossible : absent de l'énumération
    name: z.string().trim().min(2, "Nom trop court.").max(100),
    email: z.string().trim().toLowerCase().email("E-mail invalide."),
    username: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9_.]{3,32}$/, "3 à 32 caractères : lettres, chiffres, point ou _.")
      .optional()
      .or(z.literal("").transform(() => undefined)),
    phone: optionalText(30),
    password: passwordSchema,
    // Organisateur
    organization: optionalText(150),
    position: optionalText(100),
    // Prestataire
    businessName: optionalText(150),
    category: optionalText(60),
    address: optionalText(250),
    // Touriste
    country: optionalText(80),
    company: optionalText(150),
  })
  .superRefine((data, ctx) => {
    if (data.profile === "ORGANIZER" && !data.organization) {
      ctx.addIssue({ code: "custom", path: ["organization"], message: "Organisation requise." });
    }
    if (data.profile === "PROVIDER") {
      if (!data.businessName) {
        ctx.addIssue({
          code: "custom",
          path: ["businessName"],
          message: "Raison sociale requise.",
        });
      }
      if (!data.category) {
        ctx.addIssue({ code: "custom", path: ["category"], message: "Catégorie requise." });
      }
    }
  });

export type RegisterInput = z.input<typeof registerSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Mot de passe actuel requis."),
    newPassword: passwordSchema,
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    message: "Le nouveau mot de passe doit être différent de l'actuel.",
    path: ["newPassword"],
  });

export const roleUpgradeSchema = z.discriminatedUnion("role", [
  z.object({
    role: z.literal("ORGANIZER"),
    organization: z.string().trim().min(2, "Organisation requise.").max(150),
    position: optionalText(100),
  }),
  z.object({
    role: z.literal("PROVIDER"),
    businessName: z.string().trim().min(2, "Raison sociale requise.").max(150),
    category: z.string().trim().min(2, "Catégorie requise.").max(60),
    address: optionalText(250),
  }),
]);

/** Transforme une erreur zod en { champ: message } pour l'affichage. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}

/** Message lisible à partir d'une erreur renvoyée par une server function. */
export function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    try {
      const parsed = JSON.parse(error.message);
      if (Array.isArray(parsed) && parsed[0]?.message) return parsed[0].message;
    } catch {
      // message texte
    }
    return error.message;
  }
  return fallback;
}

export const PROVIDER_CATEGORIES = [
  { value: "Hôtel", fr: "Hôtel / lodge", en: "Hotel / lodge" },
  { value: "Salle", fr: "Salle de conférence", en: "Conference venue" },
  { value: "Restaurant", fr: "Restaurant / traiteur", en: "Restaurant / catering" },
  { value: "Agence", fr: "Agence de tourisme", en: "Travel agency" },
  { value: "Transport", fr: "Transport", en: "Transport" },
  { value: "Événementiel", fr: "Prestataire événementiel", en: "Event services" },
] as const;
