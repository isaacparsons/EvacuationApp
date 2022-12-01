import { Prisma, PrismaClient } from "@prisma/client";

export const getOrgMemberFromOrgId = async (
  db: PrismaClient,
  userId: number,
  organizationId: number
) => {
  const member = await db.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId
      }
    }
  });
  return member;
};
