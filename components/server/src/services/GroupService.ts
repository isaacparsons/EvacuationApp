import { Group, GroupMember } from "@prisma/client";
import { AddGroupUser, GroupNotificationSettingInput, User } from "../generated/graphql";
import { Context } from "../context";
import { RequestError } from "../util/errors";

export const getGroup = async (data: { context: Context; groupId: number }) => {
  const { context, groupId } = data;

  const group = await context.db.group.findUnique({
    where: {
      id: groupId
    },
    include: {
      members: {
        include: {
          user: true,
          organizationMember: true
        }
      },
      notificationSetting: true
    }
  });
  if (!group) {
    throw new RequestError(`Group does not exist with id: ${groupId}`);
  }
  return group;
};

export const getGroupForUser = async (data: { context: Context; groupId: number }) => {
  const { context, groupId } = data;

  const userId = context.user!.id;
  const group = await context.db.user.findUnique({
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
                  user: true,
                  organizationMember: true
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
  if (!group) {
    throw new RequestError(`Group with id: ${groupId} does not exist`);
  }
  return group?.groups[0].group;
};

export const getGroupMembers = async (data: {
  context: Context;
  groupId: number;
  cursor?: number;
}) => {
  const { groupId, context, cursor } = data;
  const groupMembers = await context.db.groupMember.findMany({
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
      user: true,
      organizationMember: true
    }
  });

  return {
    data: groupMembers,
    cursor: groupMembers.length > 0 ? groupMembers[groupMembers.length - 1].id : cursor
  };
};

export const createGroup = async (data: {
  context: Context;
  name: string;
  organizationId: number;
  groupNotificationSetting: GroupNotificationSettingInput;
}) => {
  const { name, groupNotificationSetting, organizationId, context } = data;
  const group = await context.db.group.create({
    data: {
      name,
      organizationId,
      members: {
        create: {
          admin: true,
          organizationMember: {
            connect: {
              userId_organizationId: {
                userId: context.user!.id,
                organizationId
              }
            }
          },
          user: {
            connect: { id: context.user!.id }
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

export const deleteGroup = async (data: { context: Context; groupId: number }): Promise<Group> => {
  const { groupId, context } = data;
  const group = await context.db.group.delete({
    where: {
      id: groupId
    }
  });
  return group;
};

export const updateGroupNotificationOptions = async (data: {
  context: Context;
  groupId: number;
  groupNotificationSetting: GroupNotificationSettingInput;
}) => {
  const { groupId, groupNotificationSetting, context } = data;
  const setting = await context.db.groupNotificationSetting.update({
    where: {
      groupId
    },
    data: groupNotificationSetting
  });
  return setting;
};

export const addUsersToGroups = async (data: {
  context: Context;
  organizationId: number;
  userIds: number[];
  groupIds: number[];
}) => {
  const { userIds, organizationId, groupIds, context } = data;
  await Promise.all(
    groupIds.map(async (groupId) => {
      await Promise.all(
        userIds.map(async (userId) => {
          try {
            await context.db.groupMember.create({
              data: {
                organizationMember: {
                  connect: {
                    userId_organizationId: {
                      userId,
                      organizationId
                    }
                  }
                },
                admin: false,
                group: {
                  connect: { id: groupId }
                },
                user: {
                  connect: {
                    id: userId
                  }
                }
              }
            });
          } catch (error) {
            context.log.error(`Unable to add user: ${userId} to group with id: ${groupId}`, error);
          }
        })
      );
    })
  );
};

export const addUsersToGroup = async (data: {
  context: Context;
  groupId: number;
  users: AddGroupUser[];
}): Promise<GroupMember[]> => {
  const { users, groupId, context } = data;
  const group = await context.db.group.findUnique({
    where: {
      id: groupId
    }
  });
  if (!group) {
    throw new RequestError(`No group with id: ${groupId}`);
  }
  const groupMembers = await Promise.allSettled(
    users.map(async (user) => {
      try {
        const groupMember = await context.db.groupMember.create({
          data: {
            organizationMember: {
              connect: {
                userId_organizationId: {
                  userId: user.userId,
                  organizationId: group.organizationId
                }
              }
            },
            admin: user.admin,
            group: {
              connect: { id: groupId }
            },
            user: {
              connect: {
                id: user.userId
              }
            }
          },
          include: { user: true, group: true }
        });
        return groupMember;
      } catch (error) {
        context.log.error(`Unable to add user: ${user.userId} to group with id: ${groupId}`);
        throw error;
      }
    })
  );

  return groupMembers
    .filter((item) => item.status === "fulfilled")
    .map(
      (item) => (item as PromiseFulfilledResult<GroupMember & { user: User; group: Group }>).value
    );
};

export const updateGroupMember = async (data: {
  context: Context;
  groupId: number;
  userId: number;
  admin: boolean;
}) => {
  const { groupId, userId, admin, context } = data;
  if (context.user!.id === userId) {
    throw new RequestError("Can't edit your own admin status");
  }
  const groupMember = await context.db.groupMember.update({
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

export const removeMembers = async (data: {
  context: Context;
  userIds: number[];
  groupId: number;
}) => {
  const { groupId, userIds, context } = data;

  const succeeded: GroupMember[] = [];
  const failed: number[] = [];
  await Promise.all(
    userIds.map(async (userId) => {
      try {
        const member = await context.db.groupMember.delete({
          where: {
            userId_groupId: {
              userId,
              groupId
            }
          }
        });
        succeeded.push(member);
      } catch (error) {
        context.log.error(
          `Failed to remove member with userId: ${userId} from group: ${groupId}`,
          error
        );
        failed.push(userId);
      }
    })
  );
  return {
    succeeded,
    failed
  };
};

export const getGroupMembersByGroupIds = async (data: { context: Context; groupIds: number[] }) => {
  const { context, groupIds } = data;
  const uniqueUsers = new Map();
  const groups = await context.db.group.findMany({
    where: {
      OR: groupIds.map((id) => ({ id: id }))
    },
    include: {
      members: {
        where: {
          organizationMember: {
            status: "accepted"
          }
        },
        include: {
          user: true
        }
      }
    }
  });
  groups.forEach((group) => {
    group.members.forEach((member) => {
      uniqueUsers.set(member.userId, member.user);
    });
  });
  const users = Array.from(uniqueUsers).map((item) => item[1]);
  return users;
};
