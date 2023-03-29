import { PrismaClient } from "@prisma/client";
import {
  deleteDb,
  setupUser,
  createOrg,
  createAdminOrgMember,
  createNonAdminOrgMember
} from "../dev/dbUtil";
import {
  ORG,
  ORG_NOTIFICATION_SETTINGS,
  USER1,
  USER2,
  USER3,
  USER4,
  USER5,
  USER6
} from "../dev/testData";
import { server } from "../server";
import {
  DELETE_ORG,
  INVITE_TO_ORG,
  REMOVE_FROM_ORG,
  UPDATE_ORG_INVITE,
  CREATE_ORG,
  CREATE_ORGANIZATION_ANNOUNCEMENT
} from "../dev/gql/organizations";
import Mailhog from "../dev/Mailhog";
import { GET_ORGANIZATION_MEMBERS } from "../dev/gql/organizations";
import { createGroup, createNonAdminGroupMember } from "../dev/dbUtil";

const prisma = new PrismaClient();
const mailhog = new Mailhog();

describe("organization tests", () => {
  beforeEach(async () => {
    await deleteDb();
    await mailhog.deleteAllEmails();
  });

  // describe("get organizations", () => {
  //   it("should get organizations a user has joined and has been invited to", async () => {});
  // });
  // describe("get organization for user", () => {
  //   it("should get organization for a user", async () => {});
  // });
  // describe("get organization", () => {
  //   it("should get organization if user is an admin", async () => {});
  //   it("should throw error if user is not an admin", async () => {});
  // });
  // describe("get announcements", () => {
  //   it("should get organization if user is an admin", async () => {});
  // });
  describe("get organization members", () => {
    it("should get 1 page of organization members, then use the cursor to get the second page", async () => {
      const { user: memberUser1, token: adminUserToken } = await setupUser(USER1);
      const { user: memberUser2 } = await setupUser(USER2);
      const { user: memberUser3 } = await setupUser(USER3);
      const { user: memberUser4 } = await setupUser(USER4);
      const { user: memberUser5 } = await setupUser(USER5);
      const { user: memberUser6 } = await setupUser(USER6);
      const org = await createOrg({ db: prisma });
      const member1 = await createAdminOrgMember({ db: prisma, user: memberUser1, org });
      const member2 = await createNonAdminOrgMember({ db: prisma, user: memberUser2, org });
      const member3 = await createNonAdminOrgMember({ db: prisma, user: memberUser3, org });
      const member4 = await createNonAdminOrgMember({ db: prisma, user: memberUser4, org });
      const member5 = await createNonAdminOrgMember({ db: prisma, user: memberUser5, org });
      const member6 = await createNonAdminOrgMember({ db: prisma, user: memberUser6, org });

      const result1 = await server.executeOperation(
        {
          query: GET_ORGANIZATION_MEMBERS,
          variables: { organizationId: org.id }
        },
        {
          req: { headers: { authorization: `Bearer ${adminUserToken}` } }
        } as any
      );
      expect(result1?.data?.getOrganizationMembers).toEqual({
        cursor: member5.id,
        data: [
          {
            admin: true,
            id: member1.id,
            organizationId: org.id,
            status: "accepted",
            user: {
              accountCreated: USER1.accountCreated,
              email: USER1.email,
              firstName: USER1.firstName,
              id: memberUser1.id,
              lastName: USER1.lastName,
              phoneNumber: USER1.phoneNumber
            },
            userId: memberUser1.id
          },
          {
            admin: false,
            id: member2.id,
            organizationId: org.id,
            status: "accepted",
            user: {
              accountCreated: USER2.accountCreated,
              email: USER2.email,
              firstName: USER2.firstName,
              id: memberUser2.id,
              lastName: USER2.lastName,
              phoneNumber: USER2.phoneNumber
            },
            userId: memberUser2.id
          },
          {
            admin: false,
            id: member3.id,
            organizationId: org.id,
            status: "accepted",
            user: {
              accountCreated: USER3.accountCreated,
              email: USER3.email,
              firstName: USER3.firstName,
              id: memberUser3.id,
              lastName: USER3.lastName,
              phoneNumber: USER3.phoneNumber
            },
            userId: memberUser3.id
          },
          {
            admin: false,
            id: member4.id,
            organizationId: org.id,
            status: "accepted",
            user: {
              accountCreated: USER4.accountCreated,
              email: USER4.email,
              firstName: USER4.firstName,
              id: memberUser4.id,
              lastName: USER4.lastName,
              phoneNumber: USER4.phoneNumber
            },
            userId: memberUser4.id
          },
          {
            admin: false,
            id: member5.id,
            organizationId: org.id,
            status: "accepted",
            user: {
              accountCreated: USER5.accountCreated,
              email: USER5.email,
              firstName: USER5.firstName,
              id: memberUser5.id,
              lastName: USER5.lastName,
              phoneNumber: USER5.phoneNumber
            },
            userId: memberUser5.id
          }
        ]
      });
      const result2 = await server.executeOperation(
        {
          query: GET_ORGANIZATION_MEMBERS,
          variables: {
            organizationId: org.id,
            cursor: result1?.data?.getOrganizationMembers.cursor
          }
        },
        {
          req: { headers: { authorization: `Bearer ${adminUserToken}` } }
        } as any
      );
      expect(result2?.data?.getOrganizationMembers).toEqual({
        cursor: member6.id,
        data: [
          {
            admin: false,
            id: member6.id,
            organizationId: org.id,
            status: "accepted",
            user: {
              accountCreated: USER6.accountCreated,
              email: USER6.email,
              firstName: USER6.firstName,
              id: memberUser6.id,
              lastName: USER6.lastName,
              phoneNumber: USER6.phoneNumber
            },
            userId: memberUser6.id
          }
        ]
      });
    });
  });
  describe("create org", () => {
    it("should create organization", async () => {
      const { user, token } = await setupUser(USER1);
      await server.executeOperation(
        {
          query: CREATE_ORG,
          variables: {
            name: ORG.name,
            organizationNotificationSetting: ORG_NOTIFICATION_SETTINGS
          }
        },
        { req: { headers: { authorization: `Bearer ${token}` } } } as any
      );
      const orgInDb = await prisma.organization.findFirst({
        where: {
          name: ORG.name
        },
        include: {
          members: true,
          notificationSetting: true
        }
      });
      expect(orgInDb).toEqual({
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
      const org = await createOrg({ db: prisma });
      await createAdminOrgMember({ db: prisma, user, org });
      await server.executeOperation(
        {
          query: DELETE_ORG,
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
      const org = await createOrg({ db: prisma });
      await createNonAdminOrgMember({ db: prisma, user, org });

      const result = await server.executeOperation(
        {
          query: DELETE_ORG,
          variables: { organizationId: org.id }
        },
        { req: { headers: { authorization: `Bearer ${token}` } } } as any
      );

      expect(result.errors?.length).toEqual(1);
      expect(result.errors?.[0]?.message).toEqual("Not Authorised!");
    });
  });

  describe("invite users", () => {
    it("should invite users to org if user is admin and send complete signup email if user is not signed up", async () => {
      const { user: adminUser, token: adminUserToken } = await setupUser(USER1);

      const users = [{ admin: false, email: USER2.email }];
      const org = await createOrg({ db: prisma });
      await createAdminOrgMember({ db: prisma, user: adminUser, org });

      await server.executeOperation(
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
            userId: invitedUser!.id,
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
    // it("should invite users to org if user is admin and send email notification if user is signed up", async () => {})
    // it("should invite users to org and add to groups if groupIds are selected", async () => {});
    it("should not invite users to org if user is not admin", async () => {
      const { user: adminUser, token: adminUserToken } = await setupUser(USER1);
      const { user: invitedUser } = await setupUser(USER2);

      const users = [{ admin: false, email: invitedUser.email }];
      const org = await createOrg({ db: prisma });
      await createNonAdminOrgMember({ db: prisma, user: adminUser, org });

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
      const { user: memberUser } = await setupUser(USER2);

      const org = await createOrg({ db: prisma });
      await createNonAdminOrgMember({ db: prisma, user: memberUser, org });
      await createAdminOrgMember({ db: prisma, user: adminUser, org });
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
      const { user: adminUser } = await setupUser(USER1);
      const { user: memberUser, token: memberUserToken } = await setupUser(USER2);

      const org = await createOrg({ db: prisma });
      await createNonAdminOrgMember({ db: prisma, user: memberUser, org });
      await createAdminOrgMember({ db: prisma, user: adminUser, org });

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
      const { user: adminUser } = await setupUser(USER1);
      const { user: invitedUser, token: invitedUserToken } = await setupUser(USER2);
      const org = await createOrg({ db: prisma });
      await createAdminOrgMember({ db: prisma, user: adminUser, org });
      await prisma.organizationMember.create({
        data: {
          status: "pending",
          admin: false,
          user: {
            connect: {
              id: invitedUser.id
            }
          },
          organization: {
            connect: {
              id: org.id
            }
          }
        }
      });

      await server.executeOperation(
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

  describe("create announcement", () => {
    it("if we dont have groupIds selected, should create announcement and send email to all accepted users in org ", async () => {
      const { user: adminUser, token: adminUserToken } = await setupUser(USER1);
      const { user: user1 } = await setupUser(USER2);

      const org = await createOrg({
        db: prisma,
        notificationSettings: {
          pushEnabled: false,
          emailEnabled: true,
          smsEnabled: false
        }
      });
      await createAdminOrgMember({ db: prisma, user: adminUser, org });
      await createNonAdminOrgMember({ db: prisma, user: user1, org, status: "pending" });

      const mockAnnouncementTitle = "test title";
      const mockAnnouncementDescription = "test description";
      await server.executeOperation(
        {
          query: CREATE_ORGANIZATION_ANNOUNCEMENT,
          variables: {
            organizationId: org.id,
            title: mockAnnouncementTitle,
            description: mockAnnouncementDescription
          }
        },
        {
          req: { headers: { authorization: `Bearer ${adminUserToken}` } }
        } as any
      );

      const announcements = await prisma.announcement.findMany({
        where: {
          organizationId: org.id
        }
      });
      const emails = await mailhog.getEmails();

      const email = emails[0];
      const recepients = mailhog.getRecepients(email);
      expect(mailhog.getSender(email)).toEqual(process.env.EMAIL);
      expect(recepients[0]).toEqual(USER1.email);
      expect(recepients.length).toEqual(1);
      expect(mailhog.getSubject(email)).toEqual(`Announcement - ${mockAnnouncementTitle}`);

      expect(announcements.length).toEqual(1);
      expect(announcements[0]).toEqual({
        id: expect.any(Number),
        title: mockAnnouncementTitle,
        description: mockAnnouncementDescription,
        date: expect.any(String),
        organizationId: org.id,
        createdBy: adminUser.id
      });
    });

    it("if we have groupIds selected, should create announcement and send email to users in group who have accepted ", async () => {
      const { user: adminUser, token: adminUserToken } = await setupUser(USER1);
      const { user: user1 } = await setupUser(USER2);
      const { user: user2 } = await setupUser(USER3);

      const org = await createOrg({
        db: prisma,
        notificationSettings: {
          pushEnabled: false,
          emailEnabled: true,
          smsEnabled: false
        }
      });
      await createAdminOrgMember({ db: prisma, user: adminUser, org });
      await createNonAdminOrgMember({ db: prisma, user: user1, org, status: "pending" });
      await createNonAdminOrgMember({ db: prisma, user: user2, org });

      const group = await createGroup({
        db: prisma,
        org
      });
      await createNonAdminGroupMember({ db: prisma, user: user1, org, group });

      const mockAnnouncementTitle = "test title";
      const mockAnnouncementDescription = "test description";
      await server.executeOperation(
        {
          query: CREATE_ORGANIZATION_ANNOUNCEMENT,
          variables: {
            organizationId: org.id,
            title: mockAnnouncementTitle,
            description: mockAnnouncementDescription,
            groupIds: [group.id]
          }
        },
        {
          req: { headers: { authorization: `Bearer ${adminUserToken}` } }
        } as any
      );

      const announcements = await prisma.announcement.findMany({
        where: {
          organizationId: org.id
        }
      });
      const emails = await mailhog.getEmails();
      const email = emails[0];
      const recepients = mailhog.getRecepients(email);
      expect(mailhog.getSender(email)).toEqual(process.env.EMAIL);
      expect(recepients[0]).toEqual(user1.email);
      expect(recepients.length).toEqual(1);
      expect(mailhog.getSubject(email)).toEqual(`Announcement - ${mockAnnouncementTitle}`);

      expect(announcements.length).toEqual(1);
      expect(announcements[0]).toEqual({
        id: expect.any(Number),
        title: mockAnnouncementTitle,
        description: mockAnnouncementDescription,
        date: expect.any(String),
        organizationId: org.id,
        createdBy: adminUser.id
      });
    });
  });
});
