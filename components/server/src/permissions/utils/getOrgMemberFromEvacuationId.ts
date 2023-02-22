import { Prisma, PrismaClient } from "@prisma/client";

export const getOrgMemberFromEvacuationId = async (
  db: PrismaClient,
  userId: number,
  evacuationId: number
) => {
  const evacuationEvent = await db.evacuationEvent.findUnique({
    where: {
      id: evacuationId
    }
  });
  if (!evacuationEvent) {
    return new Error("Evacuation event does not exist");
  }
  const group = await db.group.findUnique({
    where: {
      id: evacuationEvent.groupId
    }
  });
  if (!group) {
    return new Error("Group does not exist");
  }
  const member = await db.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: group.organizationId
      }
    }
  });
  return member;
};
