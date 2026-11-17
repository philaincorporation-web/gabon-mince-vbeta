-- AlterTable
ALTER TABLE "ProviderProfile" ADD COLUMN     "listingId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ProviderProfile_listingId_key" ON "ProviderProfile"("listingId");

