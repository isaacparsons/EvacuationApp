import { Group, User, PrismaClient } from "@prisma/client";
import { GroupNotificationSettingInput } from "../generated/graphql";

export default class GroupRepository {
  db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  getGroupById = async (data: { groupId: number }) => {
    const { groupId } = data;

    const group = await this.db.group.findUnique({
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
    return group;
  };

  getGroupForUser = async (data: { userId: number; groupId: number }) => {
    const { userId, groupId } = data;

    const group = await this.db.user.findUnique({
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
    return group?.groups && group.groups.length > 0 ? group?.groups[0].group : null;
  };

  getGroupsForUserInOrganization = async (data: { userId: number; organizationId: number }) => {
    const { userId, organizationId } = data;
    const groups = await this.db.user.findUnique({
      where: {
        id: userId
      },
      include: {
        groups: {
          where: {
            group: {
              organizationId
            }
          },
          include: {
            group: true,
            organizationMember: true
          }
        }
      }
    });
    return groups?.groups ?? [];
  };

  getGroupMembers = async (data: { groupId: number; cursor?: number | null }) => {
    const { groupId, cursor } = data;
    const groupMembers = await this.db.groupMember.findMany({
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

  getGroupMember = async (data: { userId: number; groupId: number }) => {
    const { userId, groupId } = data;
    const groupMember = await this.db.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId
        }
      }
    });

    return groupMember;
  };

  getGroupWithAcceptedMembers = async (data: { groupId: number }) => {
    const { groupId } = data;
    const group = await this.db.group.findUnique({
      where: {
        id: groupId
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
        },
        notificationSetting: true
      }
    });
    return group;
  };

  getAcceptedUsersByGroupIds = async (data: { groupIds: number[] }) => {
    const { groupIds } = data;
    const uniqueUsers = new Map<number, User>();
    const groups = await this.db.group.findMany({
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

  createGroup = async (data: {
    name: string;
    userId: number;
    organizationId: number;
    groupNotificationSetting: GroupNotificationSettingInput;
  }) => {
    const { name, userId, groupNotificationSetting, organizationId } = data;
    const group = await this.db.group.create({
      data: {
        name,
        organizationId,
        members: {
          create: {
            admin: true,
            organizationMember: {
              connect: {
                userId_organizationId: {
                  userId: userId,
                  organizationId
                }
              }
            },
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

  deleteGroup = async (data: { groupId: number }): Promise<Group> => {
    const { groupId } = data;
    const group = await this.db.group.delete({
      where: {
        id: groupId
      }
    });
    return group;
  };

  updateGroupNotificationOptions = async (data: {
    groupId: number;
    groupNotificationSetting: GroupNotificationSettingInput;
  }) => {
    const { groupId, groupNotificationSetting } = data;
    const setting = await this.db.groupNotificationSetting.update({
      where: {
        groupId
      },
      data: groupNotificationSetting
    });
    return setting;
  };

  createGroupMember = async (data: {
    userId: number;
    organizationId: number;
    groupId: number;
    admin: boolean;
  }) => {
    const { userId, organizationId, groupId, admin } = data;
    return await this.db.groupMember.create({
      data: {
        organizationMember: {
          connect: {
            userId_organizationId: {
              userId,
              organizationId
            }
          }
        },
        admin,
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
  };

  updateGroupMember = async (data: { groupId: number; userId: number; admin: boolean }) => {
    const { groupId, userId, admin } = data;
    const groupMember = await this.db.groupMember.update({
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

  removeMember = async (data: { userId: number; groupId: number }) => {
    const { groupId, userId } = data;

    return await this.db.groupMember.delete({
      where: {
        userId_groupId: {
          userId,
          groupId
        }
      }
    });
  };
}
