import nodemailer from "nodemailer";

interface VercelRequest {
  method?: string;
  body?: Record<string, unknown>;
}

interface VercelResponse {
  status(code: number): VercelResponse;
  json(body: unknown): VercelResponse;
  setHeader(name: string, value: string): VercelResponse;
}

interface SendMailBody {
  email: string;
  nom: string;
  organisation: string;
  telephone: string;
  eventType: string;
  attendees: string;
  message: string;
  date: string;
  heure: string;
  uuid: string;
}
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailPassword = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailPassword) {
    console.error("Missing GMAIL_USER or GMAIL_APP_PASSWORD environment variables.");
    return res.status(500).json({ error: "Server configuration missing" });
  }

  try {
    const body = (req.body ?? {}) as unknown as SendMailBody;

    if (
      !body.email ||
      !body.nom ||
      !body.organisation ||
      !body.telephone ||
      !body.eventType ||
      !body.attendees ||
      !body.message
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPassword,
      },
    });

    await transporter.verify();
    console.log("✔ Transporter Gmail vérifié avec succès");

    const clientMail = buildClientMail(body);
    const internalMail = buildInternalMail(body);

    const clientResult = await transporter.sendMail({
      from: gmailUser,
      to: body.email,
      subject: "Confirmation de réception de votre demande",
      html: clientMail,
    });
    console.log("✔ Email client envoyé:", clientMessageId(clientResult));

    const internalResult = await transporter.sendMail({
      from: gmailUser,
      to: gmailUser,
      subject: "Nouvelle demande reçue depuis le site",
      html: internalMail,
    });
    console.log("✔ Notification interne envoyée:", clientMessageId(internalResult));

    return res.status(200).json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown email error";
    console.error("✗ Erreur envoi email:", message);
    return res.status(500).json({ error: "Failed to send emails", details: message });
  }
}

function buildClientMail(body: SendMailBody): string {
  const siteUrl = process.env.SITE_URL ?? "https://gabon-mince-vbeta.vercel.app/";
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Confirmation de réception</title></head><body style="margin:0;padding:0;background-color:#f4f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;">
<tr><td align="center" style="padding:20px 10px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
<tr><td style="background-color:#1a365d;padding:24px 30px;text-align:center;">
<h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;">GabonMICE</h1>
<p style="color:#c8e6c9;margin:6px 0 0;font-size:13px;">Plateforme officielle de tourisme d'affaires au Gabon</p>
</td></tr>
<tr><td style="padding:30px;">
<h2 style="color:#1a365d;margin:0 0 8px;font-size:18px;">Bonjour ${escapeHtml(body.nom)},</h2>
<p style="color:#4a5568;font-size:15px;line-height:1.6;margin:0 0 16px;">Nous vous remercions pour votre demande concernant votre projet d'événement. Nous confirmons que votre demande a bien été enregistrée.</p>
<p style="color:#1a365d;font-size:14px;font-weight:600;margin:0 0 10px;">Récapitulatif :</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 20px;">
${mailRow("Nom", body.nom)}
${mailRow("Organisation", body.organisation)}
${mailRow("Téléphone", body.telephone)}
${mailRow("Type d'événement", body.eventType)}
${mailRow("Nombre de participants", body.attendees)}
${mailRow("Message", body.message)}
</table>
<p style="color:#4a5568;font-size:14px;line-height:1.6;margin:0 0 20px;">Notre équipe analysera votre demande et reviendra vers vous dans les meilleurs délais.</p>
<p style="color:#4a5568;font-size:14px;line-height:1.6;margin:0;">Cordialement,<br><strong style="color:#1a365d;">PHILA INCORPORATION</strong></p>
</td></tr>
<tr><td style="background-color:#1a365d;padding:16px 30px;text-align:center;">
<a href="${siteUrl}" style="display:inline-block;background-color:#276749;color:#ffffff;padding:12px 28px;border-radius:25px;text-decoration:none;font-size:14px;font-weight:600;">Visiter notre site</a>
</td></tr>
<tr><td style="padding:16px 30px;border-top:1px solid #e2e8f0;">
<p style="color:#a0aec0;font-size:11px;margin:0;line-height:1.5;">Cet email a été envoyé automatiquement.<br>Merci de ne pas y répondre.</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function buildInternalMail(body: SendMailBody): string {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Nouvelle demande GabonMICE</title></head><body style="margin:0;padding:0;background-color:#f4f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;">
<tr><td align="center" style="padding:20px 10px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
<tr><td style="background-color:#1a365d;padding:20px 24px;">
<h1 style="color:#ffffff;margin:0;font-size:20px;">Nouvelle demande reçue</h1>
</td></tr>
<tr><td style="padding:24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 16px;">
${mailRow("Date", body.date)}
${mailRow("Heure", body.heure)}
${mailRow("UUID", body.uuid)}
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:16px 0;">
${mailRow("Nom complet", body.nom)}
${mailRow("Organisation", body.organisation)}
${mailRow("E-mail", body.email)}
${mailRow("Téléphone", body.telephone)}
${mailRow("Type d'événement", body.eventType)}
${mailRow("Nombre de participants", body.attendees)}
${mailRow("Message", body.message)}
</table>
<p style="color:#718096;font-size:13px;margin:0;">Cette notification a été générée automatiquement par le système GabonMICE.</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function mailRow(label: string, value: string): string {
  return `<tr><td style="padding:8px 10px;background-color:#f7fafc;border:1px solid #e2e8f0;border-radius:6px;font-weight:600;color:#1a365d;width:180px;font-size:13px;">${escapeHtml(label)}</td><td style="padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;">${escapeHtml(value ?? "—")}</td></tr>`;
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

function clientMessageId(result: { messageId?: string }): string {
  return result.messageId ? result.messageId : "ok";
}
