/**
 * Crée (ou met à jour) le compte administrateur initial.
 * Identifiants lus dans .env : ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_EMAIL (optionnel).
 *
 * Lancement : npx prisma db seed
 *
 * Le mot de passe n'est défini qu'à la création (ou si ADMIN_RESET_PASSWORD=1),
 * pour ne pas écraser celui choisi par l'administrateur à sa première connexion.
 */
import { config } from "dotenv";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

// Variables Neon (.env.local, écrit par `neon deploy`) puis .env.
config({ path: [".env.local", ".env"], quiet: true });

const BCRYPT_COST = 12;

async function main() {
  const username = process.env.ADMIN_USERNAME?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL manquante dans .env");
  if (!username || !password)
    throw new Error("ADMIN_USERNAME et ADMIN_PASSWORD sont requis dans .env");
  const email = (process.env.ADMIN_EMAIL ?? `${username}@gabonmice.local`).trim().toLowerCase();
  const resetPassword = process.env.ADMIN_RESET_PASSWORD === "1";

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });
  try {
    const existing = await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } });
    const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

    if (!existing) {
      const user = await prisma.user.create({
        data: {
          email,
          username,
          displayUsername: username,
          name: "Administrateur AGATOUR",
          role: "ADMIN",
          status: "ACTIVE",
          mustChangePassword: true,
          emailVerified: true,
          accounts: {
            create: {
              id: randomUUID(),
              providerId: "credential",
              accountId: "",
              password: passwordHash,
            },
          },
        },
      });
      // Better Auth attend accountId = id de l'utilisateur pour le compte "credential".
      await prisma.account.updateMany({
        where: { userId: user.id, providerId: "credential" },
        data: { accountId: user.id },
      });
      await prisma.auditLog.create({ data: { userId: user.id, action: "ADMIN_SEEDED" } });
      console.log(
        `✔ Administrateur créé : ${username} (${email}). Changement de mot de passe exigé à la 1re connexion.`,
      );
      return;
    }

    await prisma.user.update({
      where: { id: existing.id },
      data: {
        role: "ADMIN",
        status: "ACTIVE",
        username,
        failedLoginCount: 0,
        lockedUntil: null,
        ...(resetPassword ? { mustChangePassword: true } : {}),
      },
    });
    const credential = await prisma.account.findFirst({
      where: { userId: existing.id, providerId: "credential" },
    });
    if (!credential) {
      await prisma.account.create({
        data: {
          id: randomUUID(),
          userId: existing.id,
          providerId: "credential",
          accountId: existing.id,
          password: passwordHash,
        },
      });
    } else if (resetPassword) {
      await prisma.account.update({
        where: { id: credential.id },
        data: { password: passwordHash },
      });
    }
    await prisma.auditLog.create({
      data: {
        userId: existing.id,
        action: "ADMIN_SEEDED",
        details: { updated: true, resetPassword },
      },
    });
    console.log(
      `✔ Administrateur mis à jour : ${username}${resetPassword ? " (mot de passe réinitialisé)" : ""}.`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("✗ Seed :", error);
  process.exit(1);
});
