import { getPrisma } from "@/lib/db.server";

/** Adresse IP du client à partir des en-têtes du proxy (Vercel). */
export function clientIp(headers: Headers | undefined | null): string | null {
  if (!headers) return null;
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip");
}

/** Trace une action dans AuditLog. Ne bloque jamais l'action en cas d'erreur d'écriture. */
export async function audit(
  action: string,
  opts: { userId?: string | null; ip?: string | null; details?: Record<string, unknown> } = {},
) {
  try {
    await getPrisma().auditLog.create({
      data: {
        action,
        userId: opts.userId ?? null,
        ip: opts.ip ?? null,
        details: opts.details ? JSON.parse(JSON.stringify(opts.details)) : undefined,
      },
    });
  } catch (error) {
    console.error("✗ AuditLog :", action, error);
  }
}
