/*
  Warnings:

  - Made the column `dateVerified` on table `verification_updates` required. This step will fail if there are existing NULL values in that column.
  - Made the column `verifiedById` on table `verification_updates` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Accounts" ALTER COLUMN "signInMethod" DROP DEFAULT;

-- AlterTable
ALTER TABLE "verification_updates" ALTER COLUMN "dateVerified" SET NOT NULL,
ALTER COLUMN "verifiedById" SET NOT NULL;
