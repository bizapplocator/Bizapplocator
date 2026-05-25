/*
  Warnings:

  - The `role` column on the `Accounts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `signInMethod` to the `Accounts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER', 'SUBSCRIBER');

-- CreateEnum
CREATE TYPE "IdentificationType" AS ENUM ('NATIONAL_ID', 'VOTERS_CARD', 'DRIVERS_LICENSE', 'INTERNATIONAL_PASSPORT');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('APPROVED', 'PENDING', 'REJECTED');

-- AlterTable
ALTER TABLE "Accounts" ADD COLUMN     "signInMethod" TEXT NOT NULL DEFAULT 'EMAIL',
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "business_owner_auths" (
    "id" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "businessRegistrationNumber" TEXT,
    "ownerFullName" TEXT NOT NULL,
    "dateOfBirth" DATE NOT NULL,
    "nin" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "businessAddress" TEXT NOT NULL,
    "typeOfBusiness" TEXT NOT NULL,
    "meansOfIdentification" "IdentificationType" NOT NULL,
    "identificationNumber" TEXT NOT NULL,
    "declarationConfirmed" BOOLEAN NOT NULL,
    "ownerSignature" TEXT NOT NULL,
    "signatureDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "business_owner_auths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_documents" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "label" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "businessOwnerAuthId" TEXT NOT NULL,

    CONSTRAINT "business_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_updates" (
    "id" TEXT NOT NULL,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "remarks" TEXT,
    "dateVerified" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedById" TEXT,
    "businessOwnerAuthId" TEXT NOT NULL,

    CONSTRAINT "verification_updates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "business_owner_auths_nin_key" ON "business_owner_auths"("nin");

-- CreateIndex
CREATE UNIQUE INDEX "business_owner_auths_emailAddress_key" ON "business_owner_auths"("emailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "business_owner_auths_accountId_key" ON "business_owner_auths"("accountId");

-- CreateIndex
CREATE INDEX "business_owner_auths_businessName_idx" ON "business_owner_auths"("businessName");

-- CreateIndex
CREATE INDEX "business_owner_auths_phoneNumber_idx" ON "business_owner_auths"("phoneNumber");

-- CreateIndex
CREATE INDEX "business_owner_auths_meansOfIdentification_idx" ON "business_owner_auths"("meansOfIdentification");

-- CreateIndex
CREATE INDEX "business_owner_auths_createdAt_idx" ON "business_owner_auths"("createdAt");

-- CreateIndex
CREATE INDEX "business_documents_businessOwnerAuthId_idx" ON "business_documents"("businessOwnerAuthId");

-- CreateIndex
CREATE UNIQUE INDEX "verification_updates_businessOwnerAuthId_key" ON "verification_updates"("businessOwnerAuthId");

-- CreateIndex
CREATE INDEX "verification_updates_verificationStatus_idx" ON "verification_updates"("verificationStatus");

-- CreateIndex
CREATE INDEX "verification_updates_verifiedById_idx" ON "verification_updates"("verifiedById");

-- CreateIndex
CREATE INDEX "verification_updates_dateVerified_idx" ON "verification_updates"("dateVerified");

-- AddForeignKey
ALTER TABLE "business_owner_auths" ADD CONSTRAINT "business_owner_auths_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_documents" ADD CONSTRAINT "business_documents_businessOwnerAuthId_fkey" FOREIGN KEY ("businessOwnerAuthId") REFERENCES "business_owner_auths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_updates" ADD CONSTRAINT "verification_updates_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "Accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_updates" ADD CONSTRAINT "verification_updates_businessOwnerAuthId_fkey" FOREIGN KEY ("businessOwnerAuthId") REFERENCES "business_owner_auths"("id") ON DELETE CASCADE ON UPDATE CASCADE;
