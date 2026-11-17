import nodemailer from "nodemailer";
import { ROLE_LABEL, type Role } from "@/lib/auth/access";

/**
 * E-mails transactionnels envoyés depuis le serveur (validation des comptes…).
 * Mêmes identifiants Gmail que la fonction api/sendMail.ts : GMAIL_USER, GMAIL_APP_PASSWORD.
 * Un échec d'envoi ne bloque jamais l'action de l'administrateur.
 */

export type AccountEmailKind =
  | "ACCOUNT_APPROVED"
  | "ACCOUNT_REJECTED"
  | "ROLE_APPROVED"
  | "ROLE_REJECTED"
  | "LABEL_GRANTED"
  | "LABEL_REVOKED";

type Recipient = {
  name: string;
  email: string;
  role: Role;
  /** Labels prestataires : nom de l'établissement et date d'expiration du label. */
  businessName?: string;
  labelExpiresAt?: Date;
};

let transporter: nodemailer.Transporter | null = null;

export function isMailConfigured() {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

function getTransporter() {
  transporter ??= nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  });
  return transporter;
}

function siteUrl() {
  const url =
    process.env.AUTH_URL || process.env.SITE_URL || "https://gabon-mince-vbeta.vercel.app";
  return url.replace(/\/+$/, "");
}

/** Envoie l'e-mail correspondant à la décision. Renvoie false si l'envoi échoue. */
export async function sendAccountEmail(kind: AccountEmailKind, to: Recipient): Promise<boolean> {
  if (!isMailConfigured()) {
    console.warn("⚠ E-mail non envoyé : GMAIL_USER / GMAIL_APP_PASSWORD manquants.");
    return false;
  }
  const content = buildContent(kind, to);
  try {
    await getTransporter().sendMail({
      from: `"GabonMICE" <${process.env.GMAIL_USER}>`,
      to: to.email,
      subject: content.subject,
      html: layout(content, to.name),
      text: [
        `Bonjour ${to.name},`,
        "",
        ...content.paragraphs,
        ...(content.cta ? ["", `${content.cta.label} : ${content.cta.url}`] : []),
        "",
        "Cordialement,",
        "L'équipe GabonMICE — AGATOUR",
      ].join("\n"),
    });
    return true;
  } catch (error) {
    console.error("✗ Envoi de l'e-mail", kind, ":", error instanceof Error ? error.message : error);
    return false;
  }
}

type Content = {
  subject: string;
  title: string;
  paragraphs: string[];
  cta?: { label: string; url: string };
};

function buildContent(kind: AccountEmailKind, to: Recipient): Content {
  const role = ROLE_LABEL[to.role].fr.toLowerCase();
  const login = { label: "Se connecter", url: `${siteUrl()}/connexion` };
  switch (kind) {
    case "ACCOUNT_APPROVED":
      return {
        subject: "Votre compte GabonMICE est validé",
        title: "Votre compte est validé",
        paragraphs: [
          `Bonne nouvelle : votre compte ${role} sur GabonMICE a été validé par l'équipe AGATOUR.`,
          "Vous pouvez dès maintenant vous connecter et accéder à votre espace.",
        ],
        cta: login,
      };
    case "ACCOUNT_REJECTED":
      return {
        subject: "Votre demande de compte GabonMICE",
        title: "Votre demande n'a pas été retenue",
        paragraphs: [
          `Après examen, l'équipe AGATOUR n'a pas pu valider votre demande de compte ${role} sur GabonMICE.`,
          "Si vous pensez qu'il s'agit d'une erreur ou souhaitez compléter votre dossier, répondez simplement à cet e-mail.",
        ],
      };
    case "ROLE_APPROVED":
      return {
        subject: `Votre profil ${role} GabonMICE est activé`,
        title: "Votre nouveau profil est activé",
        paragraphs: [
          `Votre demande a été acceptée : votre compte GabonMICE dispose désormais du profil ${role}.`,
          "Connectez-vous pour découvrir votre nouvel espace.",
        ],
        cta: login,
      };
    case "ROLE_REJECTED":
      return {
        subject: "Votre demande de changement de profil GabonMICE",
        title: "Votre demande n'a pas été retenue",
        paragraphs: [
          `Après examen, l'équipe AGATOUR n'a pas pu donner suite à votre demande de profil ${role}. Votre compte actuel reste actif.`,
          "Pour plus d'informations, répondez simplement à cet e-mail.",
        ],
        cta: login,
      };
    case "LABEL_GRANTED": {
      const business = to.businessName ? ` pour « ${to.businessName} »` : "";
      const until = to.labelExpiresAt
        ? ` Il est valable jusqu'au ${to.labelExpiresAt.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "Africa/Libreville",
          })}.`
        : "";
      return {
        subject: "Votre label GabonMICE est accordé",
        title: "Félicitations, votre label est accordé",
        paragraphs: [
          `L'équipe AGATOUR a examiné votre dossier et vous accorde le label prestataire GabonMICE${business}.${until}`,
          "Vous retrouvez son statut dans votre espace prestataire. Pensez à renouveler votre dossier avant son expiration.",
        ],
        cta: { label: "Accéder à mon espace", url: `${siteUrl()}/espace/prestataire` },
      };
    }
    case "LABEL_REVOKED": {
      const business = to.businessName ? ` pour « ${to.businessName} »` : "";
      return {
        subject: "Votre label GabonMICE a été retiré",
        title: "Votre label a été retiré",
        paragraphs: [
          `L'équipe AGATOUR vous informe que le label prestataire GabonMICE${business} a été retiré. Votre compte prestataire reste actif.`,
          "Pour connaître les raisons de cette décision ou déposer un nouveau dossier, répondez simplement à cet e-mail ou ajoutez vos justificatifs depuis votre espace.",
        ],
        cta: { label: "Accéder à mon espace", url: `${siteUrl()}/espace/prestataire` },
      };
    }
  }
}

function layout({ title, paragraphs, cta }: Content, name: string): string {
  const body = [`Bonjour ${name},`, ...paragraphs]
    .map(
      (p) =>
        `<p style="color:#4a5568;font-size:15px;line-height:1.6;margin:0 0 16px;">${escapeHtml(p)}</p>`,
    )
    .join("");
  const button = cta
    ? `<p style="margin:24px 0;text-align:center;"><a href="${escapeHtml(cta.url)}" style="display:inline-block;background-color:#276749;color:#ffffff;padding:12px 28px;border-radius:25px;text-decoration:none;font-size:14px;font-weight:600;">${escapeHtml(cta.label)}</a></p>`
    : "";
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;"><tr><td align="center" style="padding:20px 10px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;">
<tr><td style="background-color:#1a365d;padding:24px 30px;text-align:center;">
<h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;">GabonMICE</h1>
<p style="color:#c8e6c9;margin:6px 0 0;font-size:13px;">Plateforme officielle de tourisme d'affaires au Gabon</p>
</td></tr>
<tr><td style="padding:30px;">
<h2 style="color:#1a365d;margin:0 0 16px;font-size:18px;">${escapeHtml(title)}</h2>
${body}${button}
<p style="color:#4a5568;font-size:14px;line-height:1.6;margin:0;">Cordialement,<br><strong style="color:#1a365d;">L'équipe GabonMICE — AGATOUR</strong></p>
</td></tr>
<tr><td style="padding:16px 30px;border-top:1px solid #e2e8f0;"><p style="color:#a0aec0;font-size:11px;margin:0;line-height:1.5;">Cet e-mail vous a été envoyé suite à une décision concernant votre compte GabonMICE.</p></td></tr>
</table></td></tr></table></body></html>`;
}

function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return String(str).replace(/[&<>"']/g, (c) => map[c]);
}
