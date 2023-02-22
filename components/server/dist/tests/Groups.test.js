"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const apollo_server_1 = require("apollo-server");
const dbUtil_1 = require("../dev/dbUtil");
const testData_1 = require("../dev/testData");
const server_1 = require("../server");
const prisma = new client_1.PrismaClient();
describe("group tests", () => {
    beforeEach(async () => {
        await (0, dbUtil_1.deleteDb)();
    });
    describe("Create group", () => {
        it("org admin should be able to create a group in an organization", async () => {
            var _a;
            const users = await prisma.user.findMany({});
            const { user, token } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const org = await prisma.organization.create({
                data: Object.assign(Object.assign({}, testData_1.ORG), { notificationSetting: {
                        create: testData_1.ORG_NOTIFICATION_SETTINGS
                    }, members: {
                        create: Object.assign({ user: {
                                connect: { id: user.id }
                            } }, testData_1.ORG_ADMIN_MEMBER)
                    } }),
                include: {
                    members: true
                }
            });
            const result = await server_1.server.executeOperation({
                query: (0, apollo_server_1.gql) `
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
                    name: testData_1.GROUP.name,
                    groupNotificationSetting: testData_1.GROUP_NOTIFICATION_SETTING,
                    organizationId: org.id
                }
            }, { req: { headers: { authorization: `Bearer ${token}` } } });
            const group = (_a = result.data) === null || _a === void 0 ? void 0 : _a.createGroup;
            expect(group).toEqual(Object.assign(Object.assign({}, testData_1.GROUP), { id: expect.any(Number), organizationId: org.id, members: [
                    Object.assign(Object.assign({}, testData_1.GROUP_ADMIN_MEMBER), { id: expect.any(Number), userId: user.id, groupId: group.id })
                ], notificationSetting: Object.assign({ id: expect.any(Number), groupId: group.id }, testData_1.GROUP_NOTIFICATION_SETTING) }));
        });
        it("non org admin should not be able to create a group in an organization", async () => {
            var _a, _b, _c;
            const adminUser = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const nonAdminUser = await (0, dbUtil_1.setupUser)(testData_1.USER2);
            const org = await prisma.organization.create({
                data: Object.assign(Object.assign({}, testData_1.ORG), { notificationSetting: {
                        create: testData_1.ORG_NOTIFICATION_SETTINGS
                    }, members: {
                        createMany: {
                            data: [
                                Object.assign({ userId: adminUser.user.id }, testData_1.ORG_ADMIN_MEMBER),
                                Object.assign({ userId: nonAdminUser.user.id }, testData_1.ORG_NON_ADMIN_MEMBER)
                            ]
                        }
                    } }),
                include: {
                    members: true
                }
            });
            const result = await server_1.server.executeOperation({
                query: (0, apollo_server_1.gql) `
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
                    name: testData_1.GROUP.name,
                    groupNotificationSetting: testData_1.GROUP_NOTIFICATION_SETTING,
                    organizationId: org.id
                }
            }, {
                req: { headers: { authorization: `Bearer ${nonAdminUser.token}` } }
            });
            expect((_a = result.errors) === null || _a === void 0 ? void 0 : _a.length).toEqual(1);
            expect((_c = (_b = result.errors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message).toEqual("Not Authorised!");
        });
    });
    describe("Invite users", () => {
        it("org admin should be able to invite users to a group", async () => {
            var _a;
            const { user: user1, token: token1 } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const { user: user2, token: token2 } = await (0, dbUtil_1.setupUser)(testData_1.USER2);
            const org = await prisma.organization.create({
                data: Object.assign(Object.assign({}, testData_1.ORG), { notificationSetting: {
                        create: testData_1.ORG_NOTIFICATION_SETTINGS
                    }, members: {
                        create: Object.assign({ user: {
                                connect: { id: user1.id }
                            } }, testData_1.ORG_ADMIN_MEMBER)
                    } }),
                include: {
                    members: true
                }
            });
            const group = await prisma.group.create({
                data: {
                    name: testData_1.GROUP.name,
                    organizationId: org.id,
                    members: {
                        create: {
                            organizationMember: {
                                connect: {
                                    userId_organizationId: {
                                        userId: user1.id,
                                        organizationId: org.id
                                    }
                                }
                            },
                            admin: true,
                            user: {
                                connect: { id: user1.id }
                            }
                        }
                    },
                    notificationSetting: {
                        create: testData_1.GROUP_NOTIFICATION_SETTING
                    }
                },
                include: {
                    members: true,
                    notificationSetting: true
                }
            });
            const result = await server_1.server.executeOperation({
                query: (0, apollo_server_1.gql) `
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
            }, { req: { headers: { authorization: `Bearer ${token1}` } } });
            expect((_a = result.data) === null || _a === void 0 ? void 0 : _a.inviteUsers).toEqual([
                {
                    admin: false,
                    groupId: group.id,
                    status: "pending",
                    user: {
                        accountCreated: true,
                        email: testData_1.USER2.email,
                        id: user2.id,
                        phoneNumber: testData_1.USER2.phoneNumber
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JvdXBzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdGVzdHMvR3JvdXBzLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBOEM7QUFDOUMsaURBQW9DO0FBQ3BDLDBDQUE0RTtBQUM1RSw4Q0FXeUI7QUFDekIsc0NBQW1DO0FBRW5DLE1BQU0sTUFBTSxHQUFHLElBQUkscUJBQVksRUFBRSxDQUFDO0FBRWxDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsR0FBRyxFQUFFO0lBQzNCLFVBQVUsQ0FBQyxLQUFLLElBQUksRUFBRTtRQUNwQixNQUFNLElBQUEsaUJBQVEsR0FBRSxDQUFDO0lBQ25CLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUU7UUFDNUIsRUFBRSxDQUFDLCtEQUErRCxFQUFFLEtBQUssSUFBSSxFQUFFOztZQUM3RSxNQUFNLEtBQUssR0FBRyxNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzdDLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsTUFBTSxJQUFBLGtCQUFTLEVBQUMsZ0JBQUssQ0FBQyxDQUFDO1lBRS9DLE1BQU0sR0FBRyxHQUFHLE1BQU0sTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUM7Z0JBQzNDLElBQUksa0NBQ0MsY0FBRyxLQUNOLG1CQUFtQixFQUFFO3dCQUNuQixNQUFNLEVBQUUsb0NBQXlCO3FCQUNsQyxFQUNELE9BQU8sRUFBRTt3QkFDUCxNQUFNLGtCQUNKLElBQUksRUFBRTtnQ0FDSixPQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRTs2QkFDekIsSUFDRSwyQkFBZ0IsQ0FDcEI7cUJBQ0YsR0FDRjtnQkFDRCxPQUFPLEVBQUU7b0JBQ1AsT0FBTyxFQUFFLElBQUk7aUJBQ2Q7YUFDRixDQUFDLENBQUM7WUFDSCxNQUFN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