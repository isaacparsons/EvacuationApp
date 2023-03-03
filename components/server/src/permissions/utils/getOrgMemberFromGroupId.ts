import { PrismaClient } from "@prisma/client";

export const getOrgMemberFromGroupId = async (
  db: PrismaClient,
  userId: number,
  groupId: number
) => {
  const group = await db.group.findUnique({
    where: {
      id: groupId
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
