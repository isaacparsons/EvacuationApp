import { Prisma, PrismaClient } from "@prisma/client";

export const getOrgMemberFromAnnouncementId = async (
  db: PrismaClient,
  userId: number,
  announcementId: number
) => {
  const organization = await db.announcement.findUnique({
    where: {
      id: announcementId
    }
  });
  if (!organization) {
    return new Error("Organization does not exist");
  }
  const member = await db.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: organization.organizationId
      }
    }
  });
  return member;
};
