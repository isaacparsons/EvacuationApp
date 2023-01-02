import { PrismaClient } from "@prisma/client";
import { gql } from "apollo-server";
import { createGroup, createOrg, deleteDb, setupUser } from "../dev/dbUtil";
import {
  GROUP,
  GROUP_ADMIN_MEMBER,
  GROUP_NON_ADMIN_MEMBER,
  GROUP_NOTIFICATION_SETTING,
  ORG,
  ORG_ADMIN_MEMBER,
  ORG_NON_ADMIN_MEMBER,
  ORG_NOTIFICATION_SETTINGS,
  USER1,
  USER2
} from "../dev/testData";
import { server } from "../server";

const prisma = new PrismaClient();

describe("group tests", () => {
  beforeEach(async () => {
    await deleteDb();
  });

  describe("Create group", () => {
    it("org admin should be able to create a group in an organization", async () => {
      const users = await prisma.user.findMany({});
      const { user, token } = await setupUser(USER1);

      const org = await prisma.organization.create({
        data: {
          ...ORG,
          notificationSetting: {
            create: ORG_NOTIFICATION_SETTINGS
          },
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
            mutation CreateGroup(
              $organizationId: Int!
              $name: String!
              $groupNotificationSetting: GroupNotificationSettingInput!
            ) {
              createGroup(
                organizationId: $organizationId
                name: $name
                groupNotificationSetting: $groupNotificationSetting
              ) {
                id
                organizationId
                name
                members {
                  id
                  userId
                  groupId
                  status
                  admin
                }
                notificationSetting {
                  id
                  emailEnabled
                  groupId
                  pushEnabled
                  smsEnabled
                }
              }
            }
          `,
          variables: {
            name: GROUP.name,
            groupNotificationSetting: GROUP_NOTIFICATION_SETTING,
            organizationId: org.id
          }
        },
        { req: { headers: { authorization: `Bearer ${token}` } } } as any
      );
      const group = result.data?.createGroup;
      expect(group).toEqual({
        ...GROUP,
        id: expect.any(Number),
        organizationId: org.id,

        members: [
          {
            ...GROUP_ADMIN_MEMBER,
            id: expect.any(Number),
            userId: user.id,
            groupId: group.id
          }
        ],
        notificationSetting: {
          id: expect.any(Number),
          groupId: group.id,
          ...GROUP_NOTIFICATION_SETTING
        }
      });
    });
    it("non org admin should not be able to create a group in an organization", async () => {
      const adminUser = await setupUser(USER1);
      const nonAdminUser = await setupUser(USER2);
      const org = await prisma.organization.create({
        data: {
          ...ORG,
          notificationSetting: {
            create: ORG_NOTIFICATION_SETTINGS
          },
          members: {
            createMany: {
              data: [
                {
                  userId: adminUser.user.id,
                  ...ORG_ADMIN_MEMBER
                },
                {
                  userId: nonAdminUser.user.id,
                  ...ORG_NON_ADMIN_MEMBER
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
            mutation CreateGroup(
              $organizationId: Int!
              $name: String!
              $groupNotificationSetting: GroupNotificationSettingInput!
            ) {
              createGroup(
                organizationId: $organizationId
                name: $name
                groupNotificationSetting: $groupNotificationSetting
              ) {
                id
                organizationId
                name
                members {
                  id
                  userId
                  groupId
                  status
                  admin
                }
                notificationSetting {
                  id
                  emailEnabled
                  groupId
                  pushEnabled
                  smsEnabled
                }
              }
            }
          `,
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
  describe("Invite users", () => {
    it("org admin should be able to invite users to a group", async () => {
      const { user: user1, token: token1 } = await setupUser(USER1);
      const { user: user2, token: token2 } = await setupUser(USER2);
      const org = await prisma.organization.create({
        data: {
          ...ORG,
          notificationSetting: {
            create: ORG_NOTIFICATION_SETTINGS
          },
          members: {
            create: {
              user: {
                connect: { id: user1.id }
              },
              ...ORG_ADMIN_MEMBER
            }
          }
        },
        include: {
          members: true
        }
      });
      const group = await prisma.group.create({
        data: {
          name: GROUP.name,
          organizationId: org.id,
          members: {
            create: {
              status: "accepted",
              admin: true,
              user: {
                connect: { id: user1.id }
              }
            }
          },

          notificationSetting: {
            create: GROUP_NOTIFICATION_SETTING
          }
        },
        include: {
          members: true,
          notificationSetting: true
        }
      });
      const result = await server.executeOperation(
        {
          query: gql`
            mutation InviteUsers($groupId: Int!, $users: [InvitedGroupUser]) {
              inviteUsers(groupId: $groupId, users: $users) {
                userId
                groupId
                status
                admin
                user {
                  id
                  email
                  phoneNumber
                  accountCreated
                }
              }
            }
          `,
          variables: {
            groupId: group.id,
            users: [
              {
                email: user2.email,
                admin: false
              }
            ]
          }
        },
        { req: { headers: { authorization: `Bearer ${token1}` } } } as any
      );
      expect(result.data?.inviteUsers).toEqual([
        {
          admin: false,
          groupId: group.id,
          status: "pending",
          user: {
            accountCreated: true,
            email: USER2.email,
            id: user2.id,
            phoneNumber: USER2.phoneNumber
          },
          userId: user2.id
        }
      ]);
    });
    // it('group admin should be able to invite users to a group', async () => {})
    // it('non org/group admin should not be able to invite users to a group', async () => {})
  });
  // describe("Remove users", () => {
  //   it('org admin should be able to remove users from a group', async () => {})
  //   it('group admin should be able to remove users from a group', async () => {})
  //   it('non org/group admin should not be able to remove users from a group', async () => {})
  // })
  // describe("Update notification settings", () => {
  //   it('org admin should be able to update notification settings for a group', async () => {})
  //   it('group admin should be able to update notification settings for a group', async () => {})
  //   it('non group/org admin should not be able to update notification settings for a group', async () => {})
  // })
  // describe("get groups for org admin", () => {
  //   it('should get groups created by them and group created by other user', async () => {})
  // })
  // describe("get groups for org non admin", () => {
  //   it('should get group they are member of and not get group they are not member of', async () => {})
  // })
});

// org admin should be able to invite users to a group
// org admin should be able to remove users from a group
// org admin should be able to delete group
// org admin should be able to update notification settings
// org admin should be able to retrieve all groups in an organization

// group admin should not be able to delete group
// group admin should be able to invite users to group
// group admin should be able to remove users from group
// group admin should be able to update notification settings

// non org admin should not be able to invite users to a group
// non org admin should not be able to remove users from a group
// non org admin should be able to retrieve only groups they have joined
