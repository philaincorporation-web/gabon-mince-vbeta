import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// `neon deploy` / `neon env pull` écrivent les variables dans .env.local ; .env reste pris en compte.
config({ path: [".env.local", ".env"], quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Migrations sur la connexion directe Neon (sans PgBouncer) ; vide autorisé pour `prisma generate`.
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? "",
  },
});
