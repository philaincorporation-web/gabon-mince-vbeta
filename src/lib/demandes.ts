import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";
import { audit } from "@/lib/auth/audit.server";
import { loadSessionInfo } from "@/lib/auth/guard.server";
import { requirePermission } from "@/lib/admin/guard.server";
import { getPrisma } from "@/lib/db.server";

/**
 * Demandes des formulaires publics (contact, réservation, devis, événement,
 * labellisation) : enregistrées en base puis traitées dans le back office /admin.
 */

export const DEMANDE_KINDS = [
  "CONTACT",
  "RESERVATION",
  "DEVIS",
  "EVENEMENT",
  "LABELLISATION",
] as const;
export type DemandeKind = (typeof DEMANDE_KINDS)[number];

export const DEMANDE_STATUSES = ["NEW", "IN_PROGRESS", "DONE", "CANCELLED"] as const;
export type DemandeStatus = (typeof DEMANDE_STATUSES)[number];

const text = (max: number) => z.string().trim().max(max);

const createDemandeSchema = z.object({
  id: z.uuid(),
  kind: z.enum(DEMANDE_KINDS),
  subject: text(300).min(1),
  name: text(200).min(2),
  organisation: text(200).min(1),
  email: z.email().max(254),
  phone: text(30).min(7),
  attendees: text(20).optional(),
  message: text(5000).optional(),
  details: z.record(text(100), text(1000)).optional(),
});
export type CreateDemandeInput = z.input<typeof createDemandeSchema>;

/** Public : enregistre une demande. Lève une erreur si la base est indisponible. */
export const createDemande = createServerFn({ method: "POST" })
  .validator((input: unknown) => createDemandeSchema.parse(input))
  .handler(async ({ data }) => {
    let userId: string | null = null;
    try {
      userId = (await loadSessionInfo())?.id ?? null;
    } catch {
      // Visiteur anonyme ou authentification non configurée.
    }
    const details = Object.fromEntries(
      Object.entries(data.details ?? {}).filter(([, v]) => v !== ""),
    );
    await getPrisma().demande.create({
      data: {
        id: data.id,
        kind: data.kind,
        subject: data.subject,
        name: data.name,
        organisation: data.organisation,
        email: data.email,
        phone: data.phone,
        attendees: data.attendees || null,
        message: data.message || null,
        details: Object.keys(details).length > 0 ? details : undefined,
        userId,
      },
    });
    return { id: data.id };
  });

/** Admin : les 300 demandes les plus récentes et le nombre par statut. */
export const getAdminDemandes = createServerFn({ method: "GET" }).handler(async () => {
  await requirePermission("demandes");
  const prisma = getPrisma();
  const [items, grouped] = await Promise.all([
    prisma.demande.findMany({ orderBy: { createdAt: "desc" }, take: 300 }),
    prisma.demande.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);
  const counts = Object.fromEntries(DEMANDE_STATUSES.map((s) => [s, 0])) as Record<
    DemandeStatus,
    number
  >;
  for (const g of grouped) counts[g.status] = g._count._all;
  return {
    counts,
    items: items.map((d) => ({
      ...d,
      details: (d.details ?? {}) as Record<string, string>,
    })),
  };
});

/** Admin : change le statut et/ou la note interne d'une demande. */
export const adminUpdateDemande = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        id: z.string().min(1).max(64),
        status: z.enum(DEMANDE_STATUSES).optional(),
        adminNote: text(2000).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const admin = await requirePermission("demandes");
    const prisma = getPrisma();
    const before = await prisma.demande.findUniqueOrThrow({ where: { id: data.id } });
    await prisma.demande.update({
      where: { id: data.id },
      data: {
        ...(data.status ? { status: data.status } : {}),
        ...(data.adminNote !== undefined ? { adminNote: data.adminNote || null } : {}),
      },
    });
    await audit(data.status ? "REQUEST_STATUS_CHANGED" : "REQUEST_NOTE_UPDATED", {
      userId: admin.id,
      ip: getRequestIP({ xForwardedFor: true }) ?? null,
      details: {
        demandeId: data.id,
        ...(data.status ? { from: before.status, to: data.status } : {}),
      },
    });
    return { ok: true };
  });
