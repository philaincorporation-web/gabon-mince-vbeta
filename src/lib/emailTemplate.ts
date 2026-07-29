export function buildConfirmationEmail(nom: string, data: Record<string, string>): string {
  const siteUrl = "https://gabonmice.com";
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Confirmation de réception</title></head><body style="margin:0;padding:0;background-color:#f4f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;">
<tr><td align="center" style="padding:20px 10px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
<tr><td style="background-color:#1a365d;padding:24px 30px;text-align:center;">
<h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;font-family:inherit;">GabonMICE</h1>
<p style="color:#c8e6c9;margin:6px 0 0;font-size:13px;font-family:inherit;">Plateforme officielle de tourisme d'affaires au Gabon</p>
</td></tr>
<tr><td style="padding:30px;">
<h2 style="color:#1a365d;margin:0 0 8px;font-size:18px;">Bonjour ${escapeHtml(nom)},</h2>
<p style="color:#4a5568;font-size:15px;line-height:1.6;margin:0 0 16px;">Nous vous remercions pour votre demande concernant votre projet d'événement. Nous confirmons que votre demande a bien été enregistrée.</p>
<p style="color:#1a365d;font-size:14px;font-weight:600;margin:0 0 10px;">Récapitulatif :</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 20px;">
${buildRow("Nom", data.name)}
${buildRow("Organisation", data.organisation)}
${buildRow("Téléphone", data.phone)}
${buildRow("Type d'événement", data.eventType)}
${buildRow("Nombre de participants", data.attendees)}
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

export function buildNotificationEmail(
  data: Record<string, string>,
  uuid: string,
  dateStr: string,
  timeStr: string,
): string {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Nouvelle demande GabonMICE</title></head><body style="margin:0;padding:0;background-color:#f4f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;">
<tr><td align="center" style="padding:20px 10px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
<tr><td style="background-color:#1a365d;padding:20px 24px;">
<h1 style="color:#ffffff;margin:0;font-size:20px;">📩 Nouvelle demande reçue</h1>
</td></tr>
<tr><td style="padding:24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 16px;">
<tr><td style="padding:6px 10px;background-color:#f7fafc;border:1px solid #e2e8f0;border-radius:6px;font-weight:600;color:#1a365d;width:180px;">Date</td><td style="padding:6px 10px;border:1px solid #e2e8f0;border-radius:6px;">${escapeHtml(dateStr)}</td></tr>
<tr><td style="padding:6px 10px;background-color:#f7fafc;border:1px solid #e2e8f0;border-radius:6px;font-weight:600;color:#1a365d;">Heure</td><td style="padding:6px 10px;border:1px solid #e2e8f0;border-radius:6px;">${escapeHtml(timeStr)}</td></tr>
<tr><td style="padding:6px 10px;background-color:#f7fafc;border:1px solid #e2e8f0;border-radius:6px;font-weight:600;color:#1a365d;">UUID</td><td style="padding:6px 10px;border:1px solid #e2e8f0;border-radius:6px;word-break:break-all;font-size:12px;">${escapeHtml(uuid)}</td></tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:16px 0;">
${buildRow("Nom complet", data.name)}
${buildRow("Organisation", data.organisation)}
${buildRow("E-mail", data.email)}
${buildRow("Téléphone", data.phone)}
${buildRow("Type d'événement", data.eventType)}
${buildRow("Nombre de participants", data.attendees)}
${buildRow("Message", data.message)}
</table>
<p style="color:#718096;font-size:13px;margin:0;">Cette notification a été générée automatiquement par le système GabonMICE.</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function buildRow(label: string, value: string): string {
  const safeVal = escapeHtml(value || "—");
  return `<tr><td style="padding:8px 10px;background-color:#f7fafc;border:1px solid #e2e8f0;border-radius:6px;font-weight:600;color:#1a365d;width:180px;font-size:13px;">${escapeHtml(label)}</td><td style="padding:8px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;">${safeVal}</td></tr>`;
}

function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return str.replace(/[&<>"']/g, (c) => map[c]);
}
