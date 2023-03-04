/*
  Warnings:

  - You are about to drop the column `organizationId` on the `GroupMember` table. All the data in the column will be lost.
  - Added the required column `organizationMemberId` to the `GroupMember` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GroupMember" DROP CONSTRAINT "GroupMember_organizationId_fkey";

-- AlterTable
ALTER TABLE "GroupMember" DROP COLUMN "organizationId",
ADD COLUMN     "organizationMemberId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_organizationMemberId_fkey" FOREIGN KEY ("organizationMemberId") REFERENCES "OrganizationMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
