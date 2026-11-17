-- CreateEnum
CREATE TYPE "DemandeKind" AS ENUM ('CONTACT', 'RESERVATION', 'DEVIS', 'EVENEMENT', 'LABELLISATION');

-- CreateEnum
CREATE TYPE "DemandeStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'DONE', 'CANCELLED');

-- CreateTable
CREATE TABLE "Demande" (
    "id" TEXT NOT NULL,
    "kind" "DemandeKind" NOT NULL,
    "subject" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organisation" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "attendees" TEXT,
    "message" TEXT,
    "details" JSONB,
    "status" "DemandeStatus" NOT NULL DEFAULT 'NEW',
    "adminNote" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Demande_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Demande_status_createdAt_idx" ON "Demande"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "Demande" ADD CONSTRAINT "Demande_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

