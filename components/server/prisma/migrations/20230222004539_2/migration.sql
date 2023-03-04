/*
  Warnings:

  - You are about to drop the column `status` on the `GroupMember` table. All the data in the column will be lost.
  - Added the required column `organizationId` to the `GroupMember` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GroupMember" DROP COLUMN "status",
ADD COLUMN     "organizationId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "OrganizationMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
