import { PrismaClient } from "@prisma/client";
import { gql } from "apollo-server";
import * as bcrypt from "bcryptjs";
import { server } from "../server";
import TokenService from "../services/TokenService";
import {
  User,
  Group,
  Organization,
  GroupNotificationSetting,
  GroupNotificationSettingInput
} from "../../dist/generated/graphql";
import { GROUP, GROUP_NOTIFICATION_SETTING, ORG, ORG_NOTIFICATION_SETTINGS } from "./testData";

const prisma = new PrismaClient();
const tokenService = new TokenService();

interface InvitedOrganizationUser {
  admin: boolean;
  email: string;
}

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
  return await prisma.organization.create({
    data: {
      ...ORG,
      notificationSetting: {
        create: ORG_NOTIFICATION_SETTINGS
      }
    }
  });
};

export const createAdminOrgMember = async (db: PrismaClient, user: User, org: Organization) => {
  return await prisma.organizationMember.create({
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
  return await prisma.organizationMember.create({
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
  return await prisma.group.create({
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
  return await prisma.groupMember.create({
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
  return await prisma.groupMember.create({
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

export const inviteUsersToOrg = async (
  organizationId: number,
  users: InvitedOrganizationUser[],
  token: string
) => {
  return;
};

export const updateInvite = async (organizationId: number, status: string, token: string) => {
  return server.executeOperation(
    {
      query: gql`
        mutation UpdateOrgInvite($organizationId: Int!, $status: String!) {
          updateOrgInvite(organizationId: $organizationId, status: $status) {
            id
            userId
            organizationId
            status
            admin
          }
        }
      `,
      variables: { organizationId, status }
    },
    { req: { headers: { authorization: `Bearer ${token}` } } } as any
  );
};
