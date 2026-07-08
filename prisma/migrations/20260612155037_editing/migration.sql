/*
  Warnings:

  - A unique constraint covering the columns `[userId,businessId]` on the table `ChatRoom` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `businessId` to the `ChatRoom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `ChatRoom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatRoom" ADD COLUMN     "businessId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ChatRoom_userId_businessId_key" ON "ChatRoom"("userId", "businessId");
