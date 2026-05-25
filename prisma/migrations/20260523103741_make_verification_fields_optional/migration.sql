-- DropForeignKey
ALTER TABLE "verification_updates" DROP CONSTRAINT "verification_updates_verifiedById_fkey";

-- AlterTable
ALTER TABLE "verification_updates" ALTER COLUMN "verifiedById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "verification_updates" ADD CONSTRAINT "verification_updates_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "Accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
