// import { Group, GroupMember, Prisma, PrismaClient } from "@prisma/client";
import { Group, GroupMember, Prisma, PrismaClient } from "@prisma/client";
// import EmailService from './EmailService';
import { InviteUser } from "../types";

interface GetGroupInput {
  db: PrismaClient;
  groupId: number;
}

interface GetGroupForUserInput {
  db: PrismaClient;
  groupId: number;
  userId: number;
}
interface GetGroupMembersInput {
  db: PrismaClient;
  groupId: number;
  cursor?: number;
}

interface GroupNotificationSettingInput {
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
}
interface CreateGroupInput {
  db: PrismaClient;
  name: string;
  organizationId: number;
  userId: number;
  groupNotificationSetting: GroupNotificationSettingInput;
}

interface DeleteGroupInput {
  db: PrismaClient;
  groupId: number;
}

interface UpdateGroupNotificationSettingInput {
  db: PrismaClient;
  groupId: number;
  groupNotificationSetting: GroupNotificationSettingInput;
}

interface InvitedUsersInput {
  db: PrismaClient;
  groupId: number;
  userId: number;
  users: [InviteUser];
}

interface RemoveMembersInput {
  db: PrismaClient;
  memberIds: [number];
}

interface UpdateInviteInput {
  db: PrismaClient;
  groupId: number;
  userId: number;
  response: string;
}

interface UpdateGroupMemberInput {
  db: PrismaClient;
  groupId: number;
  userId: number;
  editorId: number;
  admin: boolean;
}

export const getGroup = async (data: GetGroupInput) => {
  const { db, groupId } = data;

  const group = await db.group.findUnique({
    where: {
      id: groupId
    },
    include: {
      members: {
        include: {
          user: true
        }
      },
      evacuationEvents: {
        include: {
          responses: {
            include: {
              user: true
            }
          }
        }
      },
      notificationSetting: true
    }
  });
  return group;
};

export const getGroupForUser = async (data: GetGroupForUserInput) => {
  const { db, groupId, userId } = data;

  const group = await db.user.findUnique({
    where: {
      id: userId
    },
    include: {
      groups: {
        where: {
          groupId
        },
        include: {
          group: {
            include: {
              members: {
                include: {
                  user: true
                }
              },
              evacuationEvents: {
                where: {
                  status: "in-progress"
                },
                include: {
                  responses: {
                    where: {
                      userId
                    },
                    include: {
                      user: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });
  return group?.groups ? group?.groups[0].group : null;
};

export const getGroupMembers = async (data: GetGroupMembersInput) => {
  const { groupId, db, cursor } = data;
  const groupMembers = await db.groupMember.findMany({
    ...(cursor && { skip: 1 }),
    ...(cursor && {
      cursor: {
        id: cursor
      }
    }),
    take: 5,
    orderBy: {
      id: "asc"
    },
    where: {
      groupId
    },
    include: {
      user: true
    }
  });

  return {
    data: groupMembers,
    cursor:
      groupMembers.length > 0
        ? groupMembers[groupMembers.length - 1].id
        : cursor
  };
};

export const createGroup = async (data: CreateGroupInput): Promise<Group> => {
  const { name, userId, groupNotificationSetting, organizationId, db } = data;
  const group = await db.group.create({
    data: {
      name,
      organizationId,
      members: {
        create: {
          status: "accepted",
          admin: true,
          user: {
            connect: { id: userId }
          }
        }
      },

      notificationSetting: {
        create: groupNotificationSetting
      }
    },
    include: {
      members: true,
      notificationSetting: true
    }
  });
  return group;
};

export const deleteGroup = async (data: DeleteGroupInput): Promise<Group> => {
  const { groupId, db } = data;
  const group = await db.group.delete({
    where: {
      id: groupId
    }
  });
  return group;
};

export const updateGroupNotificationOptions = async (
  data: UpdateGroupNotificationSettingInput
) => {
  const { groupId, groupNotificationSetting, db } = data;
  const setting = await db.groupNotificationSetting.update({
    where: {
      groupId
    },
    data: groupNotificationSetting
  });
  return setting;
};

export const inviteUsers = async (
  data: InvitedUsersInput
): Promise<GroupMember[]> => {
  const { users, groupId, db } = data;
  const groupMembers = await Promise.all(
    users.map(async (user) => {
      const groupMember = await db.groupMember.create({
        data: {
          status: "pending",
          admin: user.admin,
          group: {
            connect: { id: groupId }
          },
          user: {
            connect: {
              email: user.email.toLowerCase()
            }
          }
        },
        include: { user: true, group: true }
      });
      return groupMember;
    })
  );

  return groupMembers;
};

export const updateInvite = async (
  data: UpdateInviteInput
): Promise<GroupMember> => {
  const { groupId, userId, response, db } = data;
  if (response === "declined") {
    const groupMember = await db.groupMember.delete({
      where: {
        userId_groupId: {
          userId,
          groupId
        }
      }
    });
    return groupMember;
  }
  const groupMember = await db.groupMember.update({
    where: {
      userId_groupId: {
        userId,
        groupId
      }
    },
    data: {
      status: response
    }
  });
  return groupMember;
};

export const updateGroupMember = async (data: UpdateGroupMemberInput) => {
  const { groupId, userId, editorId, admin, db } = data;
  if (editorId === userId) {
    throw new Error("Can't edit your own admin status");
  }
  const groupMember = await db.groupMember.update({
    where: {
      userId_groupId: {
        userId,
        groupId
      }
    },
    data: {
      admin
    }
  });
  return groupMember;
};

export const removeMembers = async (data: RemoveMembersInput) => {
  const { memberIds, db } = data;
  return Promise.all(
    memberIds.map(async (memberId) => {
      try {
        return await db.groupMember.delete({
          where: {
            id: memberId
          }
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            return null;
          }
        }
      }
    })
  );
};
