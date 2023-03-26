import { PrismaClient } from "@prisma/client";
import { OrganizationNotificationSettingInput } from "../generated/graphql";

export default class OrganizationRepository {
  db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  getOrganizationsForUser = async (data: { userId: number }) => {
    const { userId } = data;
    const organizations = await this.db.organizationMember.findMany({
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

  getOrganization = async (data: { organizationId: number }) => {
    const { organizationId } = data;
    const organization = await this.db.organization.findUnique({
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

  getOrganizationById = async (data: { organizationId: number }) => {
    const { organizationId } = data;
    const organization = await this.db.organization.findUnique({
      where: {
        id: organizationId
      }
    });
    return organization;
  };

  getAnnouncementById = async (data: { announcementId: number }) => {
    const { announcementId } = data;
    const announcement = await this.db.announcement.findUnique({
      where: {
        id: announcementId
      }
    });
    return announcement;
  };

  getOrganizationMembers = async (data: { organizationId: number; cursor?: number | null }) => {
    const { organizationId, cursor } = data;
    const organizationMembers = await this.db.organizationMember.findMany({
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

  getOrganizationMember = async (data: { userId: number; organizationId: number }) => {
    const { organizationId, userId } = data;
    const organizationMember = await this.db.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId: organizationId
        }
      }
    });

    return organizationMember;
  };

  getOrgWithAcceptedMembers = async (data: { organizationId: number }) => {
    const { organizationId } = data;
    const organization = await this.db.organization.findUnique({
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

    return organization;
  };

  getOrganizationForUser = async (data: { organizationId: number; userId: number }) => {
    const { organizationId } = data;
    const organization = await this.db.organization.findUnique({
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

    return organization;
  };

  createOrganization = async (data: {
    name: string;
    organizationNotificationSetting: OrganizationNotificationSettingInput;
    userId: number;
  }) => {
    const { name, organizationNotificationSetting, userId } = data;
    const organization = await this.db.organization.create({
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

  deleteOrganization = async (data: { organizationId: number }) => {
    const { organizationId } = data;
    const organization = await this.db.organization.delete({
      where: {
        id: organizationId
      }
    });
    return organization;
  };

  updateOrganizationNotificationOptions = async (data: {
    organizationId: number;
    organizationNotificationSetting: OrganizationNotificationSettingInput;
  }) => {
    const { organizationId, organizationNotificationSetting } = data;
    const setting = await this.db.organizationNotificationSetting.update({
      where: {
        organizationId
      },
      data: organizationNotificationSetting
    });
    return setting;
  };

  createOrganizationMember = async (data: {
    organizationId: number;
    admin: boolean;
    email: string;
  }) => {
    const { admin, email, organizationId } = data;

    const member = await this.db.organizationMember.create({
      data: {
        status: "pending",
        admin: admin,
        organization: {
          connect: { id: organizationId }
        },
        user: {
          connectOrCreate: {
            where: {
              email: email.toLowerCase()
            },
            create: {
              email: email.toLowerCase(),
              accountCreated: false
            }
          }
        }
      },
      include: { user: true }
    });
    return member;
  };

  updateOrgInvite = async (data: { organizationId: number; status: string; userId: number }) => {
    const { organizationId, status, userId } = data;
    if (status === "declined") {
      const orgMember = await this.db.organizationMember.delete({
        where: {
          userId_organizationId: {
            userId: userId,
            organizationId
          }
        }
      });
      return orgMember;
    }
    if (status === "accepted") {
      const orgMember = await this.db.organizationMember.update({
        where: {
          userId_organizationId: {
            userId: userId,
            organizationId
          }
        },
        data: {
          status
        }
      });
      return orgMember;
    }
  };

  removeFromOrganization = async (data: { organizationId: number; userId: number }) => {
    const { userId, organizationId } = data;
    return await this.db.organizationMember.delete({
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
  };

  createOrganizationAnnouncement = async (data: {
    organizationId: number;
    userId: number;
    title: string;
    description?: string | null;
  }) => {
    const { title, description, organizationId, userId } = data;
    const announcement = await this.db.announcement.create({
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

  deleteOrganizationAnnouncement = async (data: { announcementId: number }) => {
    const { announcementId } = data;
    const announcement = await this.db.announcement.delete({
      where: {
        id: announcementId
      }
    });
    return announcement;
  };

  getAnnouncements = async (data: { organizationId: number; cursor?: number | null }) => {
    const { organizationId, cursor } = data;
    const announcements = await this.db.announcement.findMany({
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
}
