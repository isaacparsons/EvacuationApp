import { PrismaClient } from "@prisma/client";
import { gql } from "apollo-server";
import { deleteDb, setupUser } from "../dev/dbUtil";
import {
  ORG,
  ORG_ADMIN_MEMBER,
  ORG_NON_ADMIN_MEMBER,
  ORG_NOTIFICATION_SETTINGS,
  USER1,
  USER2
} from "../dev/testData";
import { server } from "../server";
import { INVITE_TO_ORG, REMOVE_FROM_ORG, UPDATE_ORG_INVITE } from "../dev/gql/organizations";
import Mailhog from "../dev/Mailhog";

const prisma = new PrismaClient();
const mailhog = new Mailhog();

describe("organization tests", () => {
  beforeEach(async () => {
    await deleteDb();
    await mailhog.deleteAllEmails();
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
    it("should invite users to org if user is admin and send complete signup email", async () => {
      const { user: adminUser, token: adminUserToken } = await setupUser(USER1);

      const users = [{ admin: false, email: USER2.email }];

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
          query: INVITE_TO_ORG,
          variables: { organizationId: org.id, users }
        },
        {
          req: { headers: { authorization: `Bearer ${adminUserToken}` } }
        } as any
      );
      const invitedUser = await prisma.user.findUnique({
        where: {
          email: USER2.email
        }
      });
      const invitedOrgMember = await prisma.organizationMember.findUnique({
        where: {
          userId_organizationId: {
            userId: invitedUser?.id!,
            organizationId: org.id
          }
        }
      });
      const emails = await mailhog.getEmails();

      const email = emails[0];
      const recepients = mailhog.getRecepients(email);
      expect(mailhog.getSender(email)).toEqual(process.env.EMAIL);
      expect(recepients[0]).toEqual(USER2.email);
      expect(recepients.length).toEqual(1);
      expect(email.Content.Headers.Subject[0]).toEqual("Complete Signup");
      expect(invitedUser).toEqual({
        id: expect.any(Number),
        email: USER2.email,
        firstName: null,
        lastName: null,
        phoneNumber: null,
        passwordHash: null,
        accountCreated: false
      });
      expect(invitedOrgMember).toEqual({
        id: expect.any(Number),
        userId: invitedUser?.id,
        organizationId: org.id,
        status: "pending",
        admin: false
      });
    });
    it("should not invite users to org if user is not admin", async () => {
      const { user: adminUser, token: adminUserToken } = await setupUser(USER1);
      const { user: invitedUser, token: invitedUserToken } = await setupUser(USER2);

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
          query: INVITE_TO_ORG,
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
      const { user: memberUser, token: memberUserToken } = await setupUser(USER2);

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
          query: REMOVE_FROM_ORG,
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
      const { user: memberUser, token: memberUserToken } = await setupUser(USER2);

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
          query: REMOVE_FROM_ORG,
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
      const { user: invitedUser, token: invitedUserToken } = await setupUser(USER2);
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
          query: UPDATE_ORG_INVITE,
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
