import { PrismaClient } from "@prisma/client";

export const getGroupMemberFromGroupId = async (
  db: PrismaClient,
  userId: number,
  groupId: number
) => {
  const member = await db.groupMember.findUnique({
    where: {
      userId_groupId: {
        userId,
        groupId
      }
    }
  });
  return member;
};
