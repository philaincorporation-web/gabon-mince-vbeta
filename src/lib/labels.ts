import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { audit } from "@/lib/auth/audit.server";
import { requireRole } from "@/lib/auth/guard.server";
import { getPrisma, isDatabaseConfigured } from "@/lib/db.server";
import { getListing } from "@/lib/mice-data";

/**
 * Badge « Labellisé AGATOUR » des fiches publiques.
 * Une fiche du catalogue associée à un compte prestataire (ProviderProfile.listingId)
 * affiche le badge selon le label accordé en base ; les autres gardent la valeur
 * `labelled` de mice-data.ts.
 */

/** Public : { idDeFiche: labellisé } pour les fiches associées à un compte. */
export const getLabelOverrides = createServerFn({ method: "GET" }).handler(async () => {
  if (!isDatabaseConfigured()) return {} as Record<string, boolean>;
  try {
    const now = new Date();
    const profiles = await getPrisma().providerProfile.findMany({
      where: { listingId: { not: null } },
      select: {
        listingId: true,
        labelStatus: true,
        labelExpiresAt: true,
        user: { select: { status: true } },
      },
    });
    return Object.fromEntries(
      profiles.map((p) => [
        p.listingId as string,
        p.labelStatus === "GRANTED" &&
          p.user.status === "ACTIVE" &&
          (!p.labelExpiresAt || p.labelExpiresAt > now),
      ]),
    ) as Record<string, boolean>;
  } catch (error) {
    // En cas de panne, les fiches gardent leur valeur par défaut.
    console.error("✗ Lecture des labels :", error);
    return {} as Record<string, boolean>;
  }
});

/** Admin : associe (ou dissocie avec null) un compte prestataire à une fiche du catalogue. */
export const adminLinkListing = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        userId: z.string().min(1).max(64),
        listingId: z.string().min(1).max(100).nullable(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const admin = await requireRole("ADMIN");
    if (data.listingId && !getListing(data.listingId)) throw new Error("Fiche introuvable.");
    const prisma = getPrisma();
    if (data.listingId) {
      const taken = await prisma.providerProfile.findUnique({
        where: { listingId: data.listingId },
        select: { userId: true },
      });
      if (taken && taken.userId !== data.userId)
        throw new Error("Cette fiche est déjà associée à un autre prestataire.");
    }
    const before = await prisma.providerProfile.findUniqueOrThrow({
      where: { userId: data.userId },
      select: { listingId: true },
    });
    await prisma.providerProfile.update({
      where: { userId: data.userId },
      data: { listingId: data.listingId },
    });
    await audit("LISTING_LINKED", {
      userId: data.userId,
      details: { by: admin.id, from: before.listingId, to: data.listingId },
    });
    return { ok: true };
  });
