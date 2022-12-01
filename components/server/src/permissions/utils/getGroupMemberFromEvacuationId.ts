import { Prisma, PrismaClient } from "@prisma/client";

export const getGroupMemberFromEvacuationId = async (
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
    throw new Error("Evacuation event does not exist");
  }

  const member = await db.groupMember.findUnique({
    where: {
      userId_groupId: {
        userId,
        groupId: evacuationEvent.groupId
      }
    }
  });
  return member;
};
