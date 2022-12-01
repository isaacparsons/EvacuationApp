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
  USER1,
  USER2
} from "../dev/testData";
import { server } from "../server";

const prisma = new PrismaClient();

describe("group tests", () => {
  beforeAll(async () => {
    await deleteDb();
  });

  describe("Create group", () => {
    it("org admin should be able to create a group in an organization", async () => {
      const users = await prisma.user.findMany({});
      console.log(users);
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
  });
  // it("non org admin should not be able to create a group in an organization", async () => {
  //   const nonAdminUser = await setupUser(USER1);
  //   const adminUser = await setupUser(USER2);

  //   const org = await prisma.organization.create({
  //     data: {
  //       ...ORG,
  //       members: {
  //         createMany: {
  //           data: [
  //             {
  //               user: {
  //                 connect: { id: adminUser.user.id }
  //               },
  //               ...ORG_NON_ADMIN_MEMBER
  //             }
  //           ]
  //         }
  //       }
  //     },
  //     include: {
  //       members: true
  //     }
  //   });
  //   const result = await createGroup(
  //     {
  //       name: GROUP.name,
  //       groupNotificationSetting: GROUP_NOTIFICATION_SETTING,
  //       organizationId: org.id
  //     },
  //     nonAdminUser.token
  //   );
  //   console.log(result);
  //   expect(result.errors?.length).toEqual(1);
  // });
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
