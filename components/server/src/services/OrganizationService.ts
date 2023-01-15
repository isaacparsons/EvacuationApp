import { Prisma, PrismaClient } from "@prisma/client";
import { InviteUser } from "src/types";

interface GetOrganizationsInput {
  db: PrismaClient;
  userId: number;
}

interface GetOrganizationInput {
  db: PrismaClient;
  organizationId: number;
}

interface GetOrganizationMembersInput {
  db: PrismaClient;
  organizationId: number;
  cursor?: number;
}

interface GetAnnouncementsInput {
  db: PrismaClient;
  organizationId: number;
  cursor?: number;
}

interface GetOrganizationForUserInput {
  db: PrismaClient;
  organizationId: number;
  userId: number;
}

interface IsOrgAdminInput {
  db: PrismaClient;
  userId: number;
  organizationId: number;
}

interface OrganizationNotificationSettingInput {
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
}

interface CreateOrganizationInput {
  db: PrismaClient;
  name: string;
  userId: number;
  organizationNotificationSetting: OrganizationNotificationSettingInput;
}

interface DeleteOrganizationInput {
  db: PrismaClient;
  organizationId: number;
}

interface UpdateOrganizationNotificationSettingInput {
  db: PrismaClient;
  organizationId: number;
  organizationNotificationSetting: OrganizationNotificationSettingInput;
}

interface InvitedOrganizationUser {
  admin: boolean;
  email: string;
  inviteToGroups: InviteUser[];
}

interface UpdateOrgInviteInput {
  db: PrismaClient;
  organizationId: number;
  userId: number;
  status: string;
}

interface InviteToOrganizationInput {
  db: PrismaClient;
  organizationId: number;
  users: InvitedOrganizationUser[];
}

interface RemoveFromOrganizationInput {
  db: PrismaClient;
  organizationId: number;
  userIds: number[];
}

interface CreateOrganizationAnnouncementInput {
  db: PrismaClient;
  userId: number;
  organizationId: number;
  title: string;
  description?: string;
}

interface DeleteOrganizationAnnouncementInput {
  db: PrismaClient;
  userId: number;
  announcementId: number;
}

export const getOrganizationsForUser = async (data: GetOrganizationsInput) => {
  const { userId, db } = data;
  const organizations = await db.organizationMember.findMany({
    where: {
      userId
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

export const getOrganization = async (data: GetOrganizationInput) => {
  const { organizationId, db } = data;
  const organization = await db.organization.findUnique({
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
  return organization;
};

export const getOrganizationMembers = async (
  data: GetOrganizationMembersInput
) => {
  const { organizationId, db, cursor } = data;
  const organizationMembers = await db.organizationMember.findMany({
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

export const getOrganizationForUser = async (
  data: GetOrganizationForUserInput
) => {
  const { db, userId, organizationId } = data;
  const organization = await db.organization.findUnique({
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
  const allGroups = await db.user.findUnique({
    where: {
      id: userId
    },
    include: {
      groups: {
        include: {
          group: true
        }
      }
    }
  });

  const groups = allGroups
    ? allGroups.groups.filter(
        (groupMember) => groupMember.group.organizationId === organizationId
      )
    : [];

  return { ...organization, groups };
};

export const createOrganization = async (data: CreateOrganizationInput) => {
  const { name, userId, db, organizationNotificationSetting } = data;
  const organization = await db.organization.create({
    data: {
      name,
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

export const deleteOrganization = async (data: DeleteOrganizationInput) => {
  const { organizationId, db } = data;
  const organization = await db.organization.delete({
    where: {
      id: organizationId
    }
  });
  return organization;
};

export const updateOrganizationNotificationOptions = async (
  data: UpdateOrganizationNotificationSettingInput
) => {
  const { organizationId, organizationNotificationSetting, db } = data;
  const setting = await db.organizationNotificationSetting.update({
    where: {
      organizationId
    },
    data: organizationNotificationSetting
  });
  return setting;
};

export const inviteToOrganization = async (data: InviteToOrganizationInput) => {
  const { users, organizationId, db } = data;

  const orgMembers = await Promise.all(
    users.map(async (user) => {
      const orgMember = await db.organizationMember.create({
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
        include: { user: true, organization: true }
      });
      return orgMember;
    })
  );
  return orgMembers;
};

export const updateOrgInvite = async (data: UpdateOrgInviteInput) => {
  const { organizationId, status, userId, db } = data;
  if (status === "declined") {
    const orgMember = await db.organizationMember.delete({
      where: {
        userId_organizationId: {
          userId,
          organizationId
        }
      }
    });
    return orgMember;
  }
  const orgMember = await db.organizationMember.update({
    where: {
      userId_organizationId: {
        userId,
        organizationId
      }
    },
    data: {
      status
    }
  });
  return orgMember;
};

export const removeFromOrganization = async (
  data: RemoveFromOrganizationInput
) => {
  const { userIds, organizationId, db } = data;
  return Promise.all(
    userIds.map(async (userId) => {
      try {
        return await db.organizationMember.delete({
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

export const createOrganizationAnnouncement = async (
  data: CreateOrganizationAnnouncementInput
) => {
  const { title, description, userId, organizationId, db } = data;
  const announcement = await db.announcement.create({
    data: {
      title,
      description,
      date: new Date().toISOString(),
      createdBy: userId,
      organizationId
    }
  });
  return announcement;
};

export const deleteOrganizationAnnouncement = async (
  data: DeleteOrganizationAnnouncementInput
) => {
  const { announcementId, db } = data;
  const announcement = await db.announcement.delete({
    where: {
      id: announcementId
    }
  });
  return announcement;
};

export const getAnnouncements = async (data: GetAnnouncementsInput) => {
  const { organizationId, db, cursor } = data;
  const announcements = await db.announcement.findMany({
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
    cursor:
      announcements.length > 0
        ? announcements[announcements.length - 1].id
        : cursor
  };
};
