import { Pool } from "pg";
import { attachDatabasePool } from "@vercel/functions";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * Client Prisma créé à la première utilisation : le site public continue de
 * fonctionner même si DATABASE_URL n'est pas configurée (ex. aperçu Lovable).
 *
 * Neon : l'application utilise l'URL poolée (DATABASE_URL, hôte « -pooler ») ;
 * les migrations Prisma utilisent l'URL directe (DATABASE_URL_UNPOOLED, voir prisma.config.ts).
 * Sur Vercel (Fluid compute), attachDatabasePool ferme proprement les connexions
 * inactives avant la suspension de l'instance ; ailleurs, l'appel est sans effet.
 */
const globalForPrisma = globalThis as unknown as { __gabonmicePrisma?: PrismaClient };

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function getPrisma(): PrismaClient {
  if (!globalForPrisma.__gabonmicePrisma) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL n'est pas configurée.");
    const pool = new Pool({ connectionString, max: 5, idleTimeoutMillis: 10_000 });
    attachDatabasePool(pool);
    globalForPrisma.__gabonmicePrisma = new PrismaClient({ adapter: new PrismaPg(pool) });
  }
  return globalForPrisma.__gabonmicePrisma;
}
