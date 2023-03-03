import { OrganizationMember, User } from "@prisma/client";
import {
  InvitedOrganizationUser,
  OrganizationNotificationSettingInput
} from "../generated/graphql";
import doesAlreadyExistError from "../util/doesAlreadyExistError";
import { RequestError } from "../util/errors";
import { Context } from "../context";

export const getOrganizationsForUser = async (data: { context: Context }) => {
  const { context } = data;
  const organizations = await context.db.organizationMember.findMany({
    where: {
      userId: context.user!.id
    },
    include: {
      organization: {
        include: {
          members: true
        }
      }
    }
  });

  return organizations;
};

export const getOrganization = async (data: { context: Context; organizationId: number }) => {
  const { organizationId, context } = data;
  const organization = await context.db.organization.findUnique({
    where: {
      id: organizationId
    },
    include: {
      groups: true,
      members: {
        include: {
          user: true
        }
      },
      notificationSetting: true,
      announcements: true
    }
  });
  if (!organization) {
    throw new RequestError(`Organization does not exist with id: ${organizationId}`);
  }
  return organization;
};

export const getOrganizationById = async (data: { context: Context; organizationId: number }) => {
  const { organizationId, context } = data;
  const organization = await context.db.organization.findUnique({
    where: {
      id: organizationId
    }
  });
  if (!organization) {
    throw new RequestError(`Organization does not exist with id: ${organizationId}`);
  }
  return organization;
};

export const getOrganizationMembers = async (data: {
  context: Context;
  organizationId: number;
  cursor?: number | null;
}) => {
  const { organizationId, context, cursor } = data;
  const organizationMembers = await context.db.organizationMember.findMany({
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
      organizationId
    },
    include: {
      user: true
    }
  });

  return {
    data: organizationMembers,
    cursor:
      organizationMembers.length > 0
        ? organizationMembers[organizationMembers.length - 1].id
        : cursor
  };
};

export const getOrgWithAcceptedMembers = async (data: {
  context: Context;
  organizationId: number;
}) => {
  const { organizationId, context } = data;
  const organization = await context.db.organization.findUnique({
    where: {
      id: organizationId
    },
    include: {
      members: {
        where: {
          status: "accepted"
        },
        include: {
          user: true
        }
      },
      notificationSetting: true
    }
  });
  if (!organization) {
    throw new RequestError(`No organization exists with id: ${organizationId}`);
  }
  return organization;
};

export const getOrganizationForUser = async (data: {
  context: Context;
  organizationId: number;
}) => {
  const { context, organizationId } = data;
  const organization = await context.db.organization.findUnique({
    where: {
      id: organizationId
    },
    include: {
      members: {
        include: {
          user: true
        }
      },
      notificationSetting: true,
      announcements: true
    }
  });
  if (!organization) {
    throw new RequestError(`Organization with id: ${organizationId} does not exist`);
  }
  const allGroups = await context.db.user.findUnique({
    where: {
      id: context.user!.id
    },
    include: {
      groups: {
        include: {
          group: true,
          organizationMember: true
        }
      }
    }
  });

  const groups = allGroups
    ? allGroups.groups.filter((groupMember) => groupMember.group.organizationId === organizationId)
    : [];

  return { ...organization, groups };
};

export const createOrganization = async (data: {
  context: Context;
  name: string;
  organizationNotificationSetting: OrganizationNotificationSettingInput;
}) => {
  const { name, context, organizationNotificationSetting } = data;
  const organization = await context.db.organization.create({
    data: {
      name,
      members: {
        create: {
          status: "accepted",
          admin: true,
          user: {
            connect: { id: context.user!.id }
          }
        }
      },
      notificationSetting: {
        create: organizationNotificationSetting
      }
    },
    include: {
      groups: true,
      notificationSetting: true,
      members: {
        include: {
          user: true
        }
      }
    }
  });
  return organization;
};

export const deleteOrganization = async (data: { context: Context; organizationId: number }) => {
  const { organizationId, context } = data;
  const organization = await context.db.organization.delete({
    where: {
      id: organizationId
    }
  });
  return organization;
};

export const updateOrganizationNotificationOptions = async (data: {
  context: Context;
  organizationId: number;
  organizationNotificationSetting: OrganizationNotificationSettingInput;
}) => {
  const { organizationId, organizationNotificationSetting, context } = data;
  const setting = await context.db.organizationNotificationSetting.update({
    where: {
      organizationId
    },
    data: organizationNotificationSetting
  });
  return setting;
};

export const inviteToOrganization = async (data: {
  context: Context;
  organizationId: number;
  users: InvitedOrganizationUser[];
}) => {
  const { users, organizationId, context } = data;

  const succeeded: Array<OrganizationMember & { user: User }> = [];
  const failed: string[] = [];

  await Promise.all(
    users.map(async (user) => {
      try {
        const member = await context.db.organizationMember.create({
          data: {
            status: "pending",
            admin: user.admin,
            organization: {
              connect: { id: organizationId }
            },
            user: {
              connectOrCreate: {
                where: {
                  email: user.email.toLowerCase()
                },
                create: {
                  email: user.email.toLowerCase(),
                  accountCreated: false
                }
              }
            }
          },
          include: { user: true }
        });
        succeeded.push(member);
      } catch (error) {
        if (!doesAlreadyExistError(error)) {
          context.log.error(
            `Failed to add member with email: ${user.email} to organization: ${organizationId}`,
            error
          );
          failed.push(user.email);
        }
      }
    })
  );
  return {
    succeeded,
    failed
  };
};

export const updateOrgInvite = async (data: {
  context: Context;
  organizationId: number;
  status: string;
}) => {
  const { organizationId, status, context } = data;
  if (status === "declined") {
    const orgMember = await context.db.organizationMember.delete({
      where: {
        userId_organizationId: {
          userId: context.user!.id,
          organizationId
        }
      }
    });
    return orgMember;
  }
  if (status === "accepted") {
    const orgMember = await context.db.organizationMember.update({
      where: {
        userId_organizationId: {
          userId: context.user!.id,
          organizationId
        }
      },
      data: {
        status
      }
    });
    return orgMember;
  }
  throw new RequestError("Not a valid invitation response");
};

export const removeFromOrganization = async (data: {
  context: Context;
  organizationId: number;
  userIds: number[];
}) => {
  const { userIds, organizationId, context } = data;
  const succeeded: Array<OrganizationMember & { user: User }> = [];
  const failed: number[] = [];
  await Promise.all(
    userIds.map(async (userId) => {
      try {
        const member = await context.db.organizationMember.delete({
          where: {
            userId_organizationId: {
              userId,
              organizationId
            }
          },
          include: {
            user: true
          }
        });
        succeeded.push(member);
      } catch (error) {
        context.log.error(
          `Failed to remove member with userId: ${userId} from organization: ${organizationId}`,
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

export const createOrganizationAnnouncement = async (data: {
  context: Context;
  organizationId: number;
  title: string;
  description?: string | null;
}) => {
  const { title, description, organizationId, context } = data;
  const announcement = await context.db.announcement.create({
    data: {
      title,
      description,
      date: new Date().toISOString(),
      createdBy: context.user!.id,
      organizationId
    }
  });
  return announcement;
};

export const deleteOrganizationAnnouncement = async (data: {
  context: Context;
  announcementId: number;
}) => {
  const { announcementId, context } = data;
  const announcement = await context.db.announcement.delete({
    where: {
      id: announcementId
    }
  });
  return announcement;
};

export const getAnnouncements = async (data: {
  context: Context;
  organizationId: number;
  cursor?: number | null;
}) => {
  const { organizationId, context, cursor } = data;
  const announcements = await context.db.announcement.findMany({
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
      organizationId
    }
  });
  return {
    data: announcements,
    cursor: announcements.length > 0 ? announcements[announcements.length - 1].id : cursor
  };
};
