import { PrismaClient } from "@prisma/client";
import { gql } from "apollo-server";
import { setupUser, deleteDb } from "../dev/dbUtil";
import {
  ORG,
  ORG_NOTIFICATION_SETTINGS,
  ORG_ADMIN_MEMBER,
  ORG_NON_ADMIN_MEMBER,
  USER1,
  USER2
} from "../dev/testData";
import { server } from "../server";

const prisma = new PrismaClient();

describe("organization tests", () => {
  beforeEach(async () => {
    await deleteDb();
  });

  describe("create org", () => {
    it("should create organization", async () => {
      const { user, token } = await setupUser(USER1);
      const result = await server.executeOperation(
        {
          query: gql`
            mutation Mutation(
              $name: String!
              $organizationNotificationSetting: OrganizationNotificationSettingInput!
            ) {
              createOrganization(
                name: $name
                organizationNotificationSetting: $organizationNotificationSetting
              ) {
                id
                members {
                  admin
                  id
                  organizationId
                  status
                  userId
                }
                name
                notificationSetting {
                  emailEnabled
                  id
                  organizationId
                  pushEnabled
                  smsEnabled
                }
              }
            }
          `,
          variables: {
            name: ORG.name,
            organizationNotificationSetting: ORG_NOTIFICATION_SETTINGS
          }
        },
        { req: { headers: { authorization: `Bearer ${token}` } } } as any
      );
      const org = result.data?.createOrganization;
      expect(org).toEqual({
        id: expect.any(Number),
        name: ORG.name,
        notificationSetting: {
          ...ORG_NOTIFICATION_SETTINGS,
          id: expect.any(Number),
          organizationId: expect.any(Number)
        },
        members: [
          {
            id: expect.any(Number),
            userId: user.id,
            organizationId: expect.any(Number),
            status: "accepted",
            admin: true
          }
        ]
      });
    });
  });

  describe("delete org", () => {
    it("should delete org if user is admin", async () => {
      const { user, token } = await setupUser(USER1);
      const org = await prisma.organization.create({
        data: {
          ...ORG,
          members: {
            create: {
              user: {
                connect: { id: user.id }
              },
              ...ORG_ADMIN_MEMBER
            }
          }
        },
        include: {
          members: true
        }
      });
      const result = await server.executeOperation(
        {
          query: gql`
            mutation RemoveFromOrganization($organizationId: Int!) {
              deleteOrganization(organizationId: $organizationId) {
                id
                name
              }
            }
          `,
          variables: { organizationId: org.id }
        },
        { req: { headers: { authorization: `Bearer ${token}` } } } as any
      );
      const orgInDb = await prisma.organization.findUnique({
        where: {
          id: org.id
        }
      });
      expect(orgInDb).toEqual(null);
    });
    it("should not delete org if user is not admin", async () => {
      const { user, token } = await setupUser(USER1);
      const org = await prisma.organization.create({
        data: {
          ...ORG,
          members: {
            create: {
              user: {
                connect: { id: user.id }
              },
              ...ORG_NON_ADMIN_MEMBER
            }
          }
        },
        include: {
          members: true
        }
      });
      const result = await server.executeOperation(
        {
          query: gql`
            mutation RemoveFromOrganization($organizationId: Int!) {
              deleteOrganization(organizationId: $organizationId) {
                id
                name
              }
            }
          `,
          variables: { organizationId: org.id }
        },
        { req: { headers: { authorization: `Bearer ${token}` } } } as any
      );

      expect(result.errors?.length).toEqual(1);
      expect(result.errors?.[0]?.message).toEqual("Not Authorised!");
    });
  });

  describe("invite users", () => {
    it("should invite users to org if user is admin", async () => {
      const { user: adminUser, token: adminUserToken } = await setupUser(USER1);
      const { user: invitedUser, token: invitedUserToken } = await setupUser(
        USER2
      );

      const users = [{ admin: false, email: invitedUser.email }];

      const org = await prisma.organization.create({
        data: {
          ...ORG,
          members: {
            create: {
              user: {
                connect: { id: adminUser.id }
              },
              ...ORG_ADMIN_MEMBER
            }
          }
        },
        include: {
          members: true
        }
      });

      const result = await server.executeOperation(
        {
          query: gql`
            mutation InviteToOrganization(
              $organizationId: Int!
              $users: [InvitedOrganizationUser]
            ) {
              inviteToOrganization(
                organizationId: $organizationId
                users: $users
              ) {
                id
                userId
                organizationId
              }
            }
          `,
          variables: { organizationId: org.id, users }
        },
        {
          req: { headers: { authorization: `Bearer ${adminUserToken}` } }
        } as any
      );
      const invitedOrgMember = await prisma.organizationMember.findUnique({
        where: {
          userId_organizationId: {
            userId: invitedUser.id,
            organizationId: org.id
          }
        }
      });
      expect(invitedOrgMember).toEqual({
        id: expect.any(Number),
        userId: invitedUser.id,
        organizationId: org.id,
        status: "pending",
        admin: false
      });
    });
    it("should not invite users to org if user is not admin", async () => {
      const { user: adminUser, token: adminUserToken } = await setupUser(USER1);
      const { user: invitedUser, token: invitedUserToken } = await setupUser(
        USER2
      );

      const users = [{ admin: false, email: invitedUser.email }];

      const org = await prisma.organization.create({
        data: {
          ...ORG,
          members: {
            create: {
              user: {
                connect: { id: adminUser.id }
              },
              ...ORG_NON_ADMIN_MEMBER
            }
          }
        },
        include: {
          members: true
        }
      });

      const result = await server.executeOperation(
        {
          query: gql`
            mutation InviteToOrganization(
              $organizationId: Int!
              $users: [InvitedOrganizationUser]
            ) {
              inviteToOrganization(
                organizationId: $organizationId
                users: $users
              ) {
                id
                userId
                organizationId
              }
            }
          `,
          variables: { organizationId: org.id, users }
        },
        {
          req: { headers: { authorization: `Bearer ${adminUserToken}` } }
        } as any
      );
      const invitedOrgMember = await prisma.organizationMember.findUnique({
        where: {
          userId_organizationId: {
            userId: invitedUser.id,
            organizationId: org.id
          }
        }
      });
      expect(result.errors?.length).toEqual(1);
      expect(result.errors?.[0]?.message).toEqual("Not Authorised!");
      expect(invitedOrgMember).toEqual(null);
    });
  });

  describe("remove users", () => {
    it("should remove users from org if user is admin", async () => {
      const { user: adminUser, token: adminUserToken } = await setupUser(USER1);
      const { user: memberUser, token: memberUserToken } = await setupUser(
        USER2
      );

      const org = await prisma.organization.create({
        data: {
          ...ORG,
          members: {
            createMany: {
              data: [
                {
                  userId: adminUser.id,
                  ...ORG_ADMIN_MEMBER
                },
                {
                  userId: memberUser.id,
                  ...ORG_NON_ADMIN_MEMBER
                }
              ]
            }
          }
        },
        include: {
          members: {
            include: {
              user: true
            }
          }
        }
      });
      const result = await server.executeOperation(
        {
          query: gql`
            mutation RemoveFromOrganization(
              $organizationId: Int!
              $userIds: [Int]
            ) {
              removeFromOrganization(
                organizationId: $organizationId
                userIds: $userIds
              ) {
                id
                organizationId
                user {
                  email
                  firstName
                  id
                  lastName
                }
              }
            }
          `,
          variables: { organizationId: org.id, userIds: [memberUser.id] }
        },
        {
          req: { headers: { authorization: `Bearer ${adminUserToken}` } }
        } as any
      );

      expect(result.data?.removeFromOrganization).toEqual([
        {
          id: expect.any(Number),
          organizationId: org.id,
          user: {
            email: USER2.email,
            firstName: USER2.firstName,
            lastName: USER2.lastName,
            id: expect.any(Number)
          }
        }
      ]);
    });
    it("should not remove users from org if user is not admin", async () => {
      const { user: adminUser, token: adminUserToken } = await setupUser(USER1);
      const { user: memberUser, token: memberUserToken } = await setupUser(
        USER2
      );

      const org = await prisma.organization.create({
        data: {
          ...ORG,
          members: {
            createMany: {
              data: [
                {
                  userId: adminUser.id,
                  ...ORG_ADMIN_MEMBER
                },
                {
                  userId: memberUser.id,
                  ...ORG_NON_ADMIN_MEMBER
                }
              ]
            }
          }
        },
        include: {
          members: {
            include: {
              user: true
            }
          }
        }
      });
      const result = await server.executeOperation(
        {
          query: gql`
            mutation RemoveFromOrganization(
              $organizationId: Int!
              $userIds: [Int]
            ) {
              removeFromOrganization(
                organizationId: $organizationId
                userIds: $userIds
              ) {
                id
                organizationId
                user {
                  email
                  firstName
                  id
                  lastName
                }
              }
            }
          `,
          variables: { organizationId: org.id, userIds: [adminUser.id] }
        },
        {
          req: { headers: { authorization: `Bearer ${memberUserToken}` } }
        } as any
      );

      expect(result.errors?.length).toEqual(1);
      expect(result.errors?.[0]?.message).toEqual("Not Authorised!");
    });
  });
  describe("update invite", () => {
    it("should update invite if the invite is for the user", async () => {
      const { user: adminUser, token: adminUserToken } = await setupUser(USER1);
      const { user: invitedUser, token: invitedUserToken } = await setupUser(
        USER2
      );
      const org = await prisma.organization.create({
        data: {
          ...ORG,
          members: {
            createMany: {
              data: [
                {
                  userId: adminUser.id,
                  ...ORG_ADMIN_MEMBER
                },
                {
                  userId: invitedUser.id,
                  status: "pending",
                  admin: false
                }
              ]
            }
          }
        },
        include: {
          members: true
        }
      });

      const result = await server.executeOperation(
        {
          query: gql`
            mutation UpdateOrgInvite($organizationId: Int!, $status: String!) {
              updateOrgInvite(
                organizationId: $organizationId
                status: $status
              ) {
                id
                userId
                organizationId
                status
                admin
              }
            }
          `,
          variables: { organizationId: org.id, status: "accepted" }
        },
        {
          req: { headers: { authorization: `Bearer ${invitedUserToken}` } }
        } as any
      );
      const orgMember = await prisma.organizationMember.findUnique({
        where: {
          userId_organizationId: {
            userId: invitedUser.id,
            organizationId: org.id
          }
        }
      });
      expect(orgMember).toEqual({
        id: expect.any(Number),
        userId: invitedUser.id,
        organizationId: org.id,
        status: "accepted",
        admin: false
      });
    });
  });
});
