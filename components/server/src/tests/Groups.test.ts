import { PrismaClient } from "@prisma/client";
import {
  createAdminGroupMember,
  createAdminOrgMember,
  createGroup,
  createNonAdminGroupMember,
  createNonAdminOrgMember,
  deleteDb,
  setupUser
} from "../dev/dbUtil";
import { GROUP, GROUP_NOTIFICATION_SETTING, USER1, USER2 } from "../dev/testData";
import { server } from "../server";
import { createOrg } from "../dev/dbUtil";
import { GET_ORGANIZATION, GET_ORGANIZATION_FOR_USER } from "../dev/gql/organizations";
import {
  CREATE_GROUP,
  ADD_USERS_TO_GROUP,
  REMOVE_USERS,
  UPDATE_NOTIFICATION_SETTINGS
} from "../dev/gql/groups";

const prisma = new PrismaClient();

describe("group tests", () => {
  beforeEach(async () => {
    await deleteDb();
  });

  describe("Create group", () => {
    it("org admin should be able to create a group in an organization", async () => {
      const { user, token } = await setupUser(USER1);

      const org = await createOrg(prisma);
      await createAdminOrgMember(prisma, user, org);

      await server.executeOperation(
        {
          query: CREATE_GROUP,
          variables: {
            name: GROUP.name,
            groupNotificationSetting: GROUP_NOTIFICATION_SETTING,
            organizationId: org.id
          }
        },
        { req: { headers: { authorization: `Bearer ${token}` } } } as any
      );
      const groupInDb = await prisma.group.findFirst({
        where: {
          organizationId: org.id,
          name: GROUP.name
        },
        include: {
          notificationSetting: true,
          members: true
        }
      });
      expect(groupInDb).toEqual({
        ...GROUP,
        id: expect.any(Number),
        organizationId: org.id,
        notificationSetting: {
          id: expect.any(Number),
          groupId: groupInDb?.id,
          ...GROUP_NOTIFICATION_SETTING
        },
        members: [
          {
            id: expect.any(Number),
            userId: user.id,
            groupId: groupInDb?.id,
            organizationMemberId: adminOrgMember.id,
            admin: true
          }
        ]
      });
    });
    it("non org admin should not be able to create a group in an organization", async () => {
      const adminUser = await setupUser(USER1);
      const nonAdminUser = await setupUser(USER2);
      const org = await createOrg(prisma);
      await createAdminOrgMember(prisma, adminUser.user, org);
      await createNonAdminOrgMember(prisma, nonAdminUser.user, org);
      const result = await server.executeOperation(
        {
          query: CREATE_GROUP,
          variables: {
            name: GROUP.name,
            groupNotificationSetting: GROUP_NOTIFICATION_SETTING,
            organizationId: org.id
          }
        },
        {
          req: { headers: { authorization: `Bearer ${nonAdminUser.token}` } }
        } as any
      );
      expect(result.errors?.length).toEqual(1);
      expect(result.errors?.[0]?.message).toEqual("Not Authorised!");
    });
  });
  describe("Add users to group", () => {
    it("org admin should be able to add users to a group", async () => {
      const { user: user1, token: token1 } = await setupUser(USER1);
      const { user: user2 } = await setupUser(USER2);
      const org = await createOrg(prisma);
      await createAdminOrgMember(prisma, user1, org);
      const invitedOrgMember = await createNonAdminOrgMember(prisma, user2, org);
      const group = await createGroup({ db: prisma, org });
      await createNonAdminGroupMember(prisma, user1, org, group);
      await createNonAdminGroupMember(prisma, user2, org, group);
      await server.executeOperation(
        {
          query: ADD_USERS_TO_GROUP,
          variables: {
            groupId: group.id,
            users: [
              {
                userId: user2.id,
                admin: false
              }
            ]
          }
        },
        { req: { headers: { authorization: `Bearer ${token1}` } } } as any
      );
      const groupMemberInDb = await prisma.groupMember.findFirst({
        where: {
          groupId: group.id,
          userId: user2.id
        }
      });
      expect(groupMemberInDb).toEqual({
        id: expect.any(Number),
        userId: user2.id,
        groupId: group.id,
        organizationMemberId: invitedOrgMember.id,
        admin: false
      });
    });
    it("group admin should be able to add users to a group", async () => {
      const { user: user1, token: token1 } = await setupUser(USER1);
      const { user: user2 } = await setupUser(USER2);
      const org = await createOrg(prisma);
      await createAdminOrgMember(prisma, user1, org);
      const invitedOrgMember = await createNonAdminOrgMember(prisma, user2, org);
      const group = await createGroup({ db: prisma, org });
      await createAdminGroupMember(prisma, user1, org, group);
      await server.executeOperation(
        {
          query: ADD_USERS_TO_GROUP,
          variables: {
            groupId: group.id,
            users: [
              {
                userId: user2.id,
                admin: false
              }
            ]
          }
        },
        { req: { headers: { authorization: `Bearer ${token1}` } } } as any
      );
      const groupMemberInDb = await prisma.groupMember.findFirst({
        where: {
          groupId: group.id,
          userId: user2.id
        }
      });
      expect(groupMemberInDb).toEqual({
        id: expect.any(Number),
        userId: user2.id,
        groupId: group.id,
        organizationMemberId: invitedOrgMember.id,
        admin: false
      });
    });
    it("non org/group admin should not be able to add users to a group", async () => {
      const { user: user1, token: token1 } = await setupUser(USER1);
      const { user: user2 } = await setupUser(USER2);
      const org = await createOrg(prisma);
      await createNonAdminOrgMember(prisma, user1, org);
      await createNonAdminOrgMember(prisma, user2, org);

      const group = await createGroup({ db: prisma, org });
      await createNonAdminGroupMember(prisma, user1, org, group);
      const result = await server.executeOperation(
        {
          query: ADD_USERS_TO_GROUP,
          variables: {
            groupId: group.id,
            users: [
              {
                userId: user2.id,
                admin: false
              }
            ]
          }
        },
        { req: { headers: { authorization: `Bearer ${token1}` } } } as any
      );
      const groupMemberInDb = await prisma.groupMember.findFirst({
        where: {
          groupId: group.id,
          userId: user2.id
        }
      });
      expect(result.errors?.length).toEqual(1);
      expect(result.errors?.[0]?.message).toEqual("Not Authorised!");
      expect(groupMemberInDb).toBeNull();
    });
  });
  describe("Remove users", () => {
    it("org admin should be able to remove users from a group", async () => {
      const { user: user1, token: token1 } = await setupUser(USER1);
      const { user: user2 } = await setupUser(USER2);
      const org = await createOrg(prisma);
      await createAdminOrgMember(prisma, user1, org);
      await createNonAdminOrgMember(prisma, user2, org);

      const group = await createGroup({ db: prisma, org });

      await createNonAdminGroupMember(prisma, user1, org, group);
      await createNonAdminGroupMember(prisma, user2, org, group);
      await server.executeOperation(
        {
          query: REMOVE_USERS,
          variables: {
            groupId: group.id,
            userIds: [user2.id]
          }
        },
        { req: { headers: { authorization: `Bearer ${token1}` } } } as any
      );
      const groupMemberInDb = await prisma.groupMember.findFirst({
        where: {
          groupId: group.id,
          userId: user2.id
        }
      });
      expect(groupMemberInDb).toBeNull();
    });
    it("group admin should be able to remove users from a group", async () => {
      const { user: user1, token: token1 } = await setupUser(USER1);
      const { user: user2 } = await setupUser(USER2);
      const org = await createOrg(prisma);
      await createNonAdminOrgMember(prisma, user1, org);
      await createNonAdminOrgMember(prisma, user2, org);

      const group = await createGroup({ db: prisma, org });

      await createAdminGroupMember(prisma, user1, org, group);
      await createNonAdminGroupMember(prisma, user2, org, group);
      await server.executeOperation(
        {
          query: REMOVE_USERS,
          variables: {
            groupId: group.id,
            userIds: [user2.id]
          }
        },
        { req: { headers: { authorization: `Bearer ${token1}` } } } as any
      );
      const groupMemberInDb = await prisma.groupMember.findFirst({
        where: {
          groupId: group.id,
          userId: user2.id
        }
      });
      expect(groupMemberInDb).toBeNull();
    });
    it("non org/group admin should not be able to remove users from a group", async () => {
      const { user: user1, token: token1 } = await setupUser(USER1);
      const { user: user2 } = await setupUser(USER2);
      const org = await createOrg(prisma);
      await createNonAdminOrgMember(prisma, user1, org);
      await createNonAdminOrgMember(prisma, user2, org);

      const group = await createGroup({ db: prisma, org });

      await createNonAdminGroupMember(prisma, user1, org, group);
      await createNonAdminGroupMember(prisma, user2, org, group);
      const result = await server.executeOperation(
        {
          query: REMOVE_USERS,
          variables: {
            groupId: group.id,
            userIds: [user2.id]
          }
        },
        { req: { headers: { authorization: `Bearer ${token1}` } } } as any
      );
      const groupMemberInDb = await prisma.groupMember.findFirst({
        where: {
          groupId: group.id,
          userId: user2.id
        }
      });
      expect(result.errors?.length).toEqual(1);
      expect(result.errors?.[0]?.message).toEqual("Not Authorised!");
      expect(groupMemberInDb).toBeDefined();
    });
  });
  describe("Update notification settings", () => {
    it("org admin should be able to update notification settings for a group", async () => {
      const { user: user1, token: token1 } = await setupUser(USER1);
      const org = await createOrg(prisma);
      await createAdminOrgMember(prisma, user1, org);

      const group = await createGroup({ db: prisma, org });

      await createNonAdminGroupMember(prisma, user1, org, group);
      const updatedGroupNotificationSettings = {
        emailEnabled: true,
        smsEnabled: true,
        pushEnabled: true
      };
      await server.executeOperation(
        {
          query: UPDATE_NOTIFICATION_SETTINGS,
          variables: {
            groupId: group.id,
            groupNotificationSetting: updatedGroupNotificationSettings
          }
        },
        { req: { headers: { authorization: `Bearer ${token1}` } } } as any
      );
      const groupNotificationSettingsInDb = await prisma.groupNotificationSetting.findFirst({
        where: {
          groupId: group.id
        }
      });
      expect(groupNotificationSettingsInDb).toEqual({
        id: expect.any(Number),
        groupId: group.id,
        ...updatedGroupNotificationSettings
      });
    });
    it("group admin should be able to update notification settings for a group", async () => {
      const { user: user1, token: token1 } = await setupUser(USER1);
      const org = await createOrg(prisma);
      await createNonAdminOrgMember(prisma, user1, org);

      const group = await createGroup({ db: prisma, org });

      await createAdminGroupMember(prisma, user1, org, group);
      const updatedGroupNotificationSettings = {
        emailEnabled: true,
        smsEnabled: true,
        pushEnabled: true
      };
      await server.executeOperation(
        {
          query: UPDATE_NOTIFICATION_SETTINGS,
          variables: {
            groupId: group.id,
            groupNotificationSetting: updatedGroupNotificationSettings
          }
        },
        { req: { headers: { authorization: `Bearer ${token1}` } } } as any
      );
      const groupNotificationSettingsInDb = await prisma.groupNotificationSetting.findFirst({
        where: {
          groupId: group.id
        }
      });
      expect(groupNotificationSettingsInDb).toEqual({
        id: expect.any(Number),
        groupId: group.id,
        ...updatedGroupNotificationSettings
      });
    });
    it("non group/org admin should not be able to update notification settings for a group", async () => {
      const { user: user1, token: token1 } = await setupUser(USER1);
      const org = await createOrg(prisma);
      await createNonAdminOrgMember(prisma, user1, org);

      const group = await createGroup({ db: prisma, org });

      await createNonAdminGroupMember(prisma, user1, org, group);
      const updatedGroupNotificationSettings = {
        emailEnabled: true,
        smsEnabled: true,
        pushEnabled: true
      };
      const result = await server.executeOperation(
        {
          query: UPDATE_NOTIFICATION_SETTINGS,
          variables: {
            groupId: group.id,
            groupNotificationSetting: updatedGroupNotificationSettings
          }
        },
        { req: { headers: { authorization: `Bearer ${token1}` } } } as any
      );
      const groupNotificationSettingsInDb = await prisma.groupNotificationSetting.findFirst({
        where: {
          groupId: group.id
        }
      });
      expect(result.errors?.length).toEqual(1);
      expect(result.errors?.[0]?.message).toEqual("Not Authorised!");
      expect(groupNotificationSettingsInDb).toEqual({
        id: expect.any(Number),
        groupId: group.id,
        ...GROUP_NOTIFICATION_SETTING
      });
    });
  });
  describe("get groups for org admin", () => {
    it("should get groups created by them and group created by other users", async () => {
      const { user: user1, token: token1 } = await setupUser(USER1);
      const org = await createOrg(prisma);
      await createAdminOrgMember(prisma, user1, org);

      const group1 = await createGroup({ db: prisma, org, groupName: "test group 1" });
      const group2 = await createGroup({ db: prisma, org, groupName: "test group 2" });

      const result = await server.executeOperation(
        {
          query: GET_ORGANIZATION,
          variables: {
            organizationId: org.id
          }
        },
        { req: { headers: { authorization: `Bearer ${token1}` } } } as any
      );
      expect(result?.data?.getOrganization?.groups).toEqual([
        {
          organizationId: org.id,
          id: expect.any(Number),
          name: group1.name
        },
        {
          organizationId: org.id,
          id: expect.any(Number),
          name: group2.name
        }
      ]);
    });
  });
  describe("get groups for org non admin", () => {
    it("should get group they are member of and not get group they are not a member of", async () => {
      const { user: user1, token: token1 } = await setupUser(USER1);
      const org = await createOrg(prisma);
      const nonAdminOrgMember = await createNonAdminOrgMember(prisma, user1, org);

      const group1 = await createGroup({ db: prisma, org, groupName: "test group 1" });
      await createGroup({ db: prisma, org, groupName: "test group 2" });

      await createAdminGroupMember(prisma, user1, org, group1);

      const result = await server.executeOperation(
        {
          query: GET_ORGANIZATION_FOR_USER,
          variables: {
            organizationId: org.id
          }
        },
        { req: { headers: { authorization: `Bearer ${token1}` } } } as any
      );
      expect(result?.data?.getOrganizationForUser?.groups).toEqual([
        {
          id: expect.any(Number),
          userId: user1.id,
          groupId: group1.id,
          organizationMemberId: nonAdminOrgMember.id,
          organizationMember: {
            id: expect.any(Number),
            status: "accepted",
            userId: user1.id,
            admin: false,
            organizationId: org.id
          },
          admin: true,
          group: {
            organizationId: org.id,
            id: expect.any(Number),
            name: group1.name
          }
        }
      ]);
    });
  });
});
