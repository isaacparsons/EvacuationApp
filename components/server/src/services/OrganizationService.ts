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

interface CreateOrganizationInput {
  db: PrismaClient;
  name: string;
  userId: number;
}

interface DeleteOrganizationInput {
  db: PrismaClient;
  organizationId: number;
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
      organization: true
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
      announcements: true
    }
  });
  return organization;
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
  const { name, userId, db } = data;
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
      }
    },
    include: {
      groups: true,
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
                email: user.email
              },
              create: {
                email: user.email,
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
