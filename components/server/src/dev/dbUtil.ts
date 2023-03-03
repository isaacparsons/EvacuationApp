import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import TokenService from "../services/TokenService";
import { User, Group, Organization, GroupNotificationSettingInput } from "../generated/graphql";
import { GROUP, GROUP_NOTIFICATION_SETTING, ORG, ORG_NOTIFICATION_SETTINGS } from "./testData";

const prisma = new PrismaClient();
const tokenService = new TokenService();

export const deleteDb = async () => {
  await prisma.user.deleteMany({});
  await prisma.organization.deleteMany({});
  await prisma.organizationMember.deleteMany({});
  await prisma.group.deleteMany({});
  await prisma.groupMember.deleteMany({});
  await prisma.groupNotificationSetting.deleteMany({});
  await prisma.evacuationEvent.deleteMany({});
  await prisma.evacuationResponse.deleteMany({});
};

export const setupUser = async (data: {
  email: string;
  phoneNumber: string;
  password: string;
  accountCreated: boolean;
  firstName?: string;
  lastName?: string;
}) => {
  const hash = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      phoneNumber: data.phoneNumber,
      accountCreated: data.accountCreated,
      firstName: data.firstName,
      lastName: data.lastName,
      passwordHash: hash
    }
  });
  const token = tokenService.create(user);

  return { user, token };
};

export const createOrg = async (db: PrismaClient) => {
  return await db.organization.create({
    data: {
      ...ORG,
      notificationSetting: {
        create: ORG_NOTIFICATION_SETTINGS
      }
    }
  });
};

export const createAdminOrgMember = async (db: PrismaClient, user: User, org: Organization) => {
  return await db.organizationMember.create({
    data: {
      user: {
        connect: { id: user.id }
      },
      organization: {
        connect: { id: org.id }
      },
      status: "accepted",
      admin: true
    }
  });
};

export const createNonAdminOrgMember = async (db: PrismaClient, user: User, org: Organization) => {
  return await db.organizationMember.create({
    data: {
      user: {
        connect: { id: user.id }
      },
      organization: {
        connect: { id: org.id }
      },
      status: "accepted",
      admin: false
    }
  });
};

export const createGroup = async ({
  db,
  org,
  groupName,
  notificationSettings
}: {
  db: PrismaClient;
  org: Organization;
  groupName?: string;
  notificationSettings?: GroupNotificationSettingInput;
}) => {
  return await db.group.create({
    data: {
      name: groupName ?? GROUP.name,
      organizationId: org.id,
      notificationSetting: {
        create: notificationSettings ?? GROUP_NOTIFICATION_SETTING
      }
    },
    include: {
      notificationSetting: true
    }
  });
};

export const createAdminGroupMember = async (
  db: PrismaClient,
  user: User,
  org: Organization,
  group: Group
) => {
  return await db.groupMember.create({
    data: {
      group: {
        connect: {
          id: group.id
        }
      },
      organizationMember: {
        connect: {
          userId_organizationId: {
            userId: user.id,
            organizationId: org.id
          }
        }
      },
      admin: true,
      user: {
        connect: { id: user.id }
      }
    }
  });
};

export const createNonAdminGroupMember = async (
  db: PrismaClient,
  user: User,
  org: Organization,
  group: Group
) => {
  return await db.groupMember.create({
    data: {
      group: {
        connect: {
          id: group.id
        }
      },
      organizationMember: {
        connect: {
          userId_organizationId: {
            userId: user.id,
            organizationId: org.id
          }
        }
      },
      admin: false,
      user: {
        connect: { id: user.id }
      }
    }
  });
};
