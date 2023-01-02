import { PrismaClient } from "@prisma/client";
import { gql } from "apollo-server";
import * as bcrypt from "bcryptjs";
import { server } from "../server";
import TokenService from "../services/TokenService";
import { InviteUser, User } from "../types";

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

export const createOrg = async (orgName: string, token: string) => {};

export const inviteUsersToOrg = async (
  organizationId: number,
  users: InvitedOrganizationUser[],
  token: string
) => {
  return;
};

export const updateInvite = async (
  organizationId: number,
  status: string,
  token: string
) => {
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

export const removeOrgMembers = async (
  organizationId: string,
  memberIds: number[],
  token: string
) => {
  return;
};

export const deleteOrg = async (organizationId: string, token: string) => {};

export const createGroup = async (variables: any, token: string) => {
  return;
};
