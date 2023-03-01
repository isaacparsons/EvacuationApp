"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const dbUtil_1 = require("../dev/dbUtil");
const testData_1 = require("../dev/testData");
const server_1 = require("../server");
const groups_1 = require("../dev/gql/groups");
const prisma = new client_1.PrismaClient();
describe("group tests", () => {
    beforeEach(async () => {
        await (0, dbUtil_1.deleteDb)();
    });
    describe("Create group", () => {
        it("org admin should be able to create a group in an organization", async () => {
            const { user, token } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const org = await prisma.organization.create({
                data: Object.assign(Object.assign({}, testData_1.ORG), { notificationSetting: {
                        create: testData_1.ORG_NOTIFICATION_SETTINGS
                    } })
            });
            const orgMember = await prisma.organizationMember.create({
                data: Object.assign(Object.assign({ organization: {
                        connect: { id: org.id }
                    } }, testData_1.ORG_ADMIN_MEMBER), { user: {
                        connect: { id: user.id }
                    } })
            });
            const result = await server_1.server.executeOperation({
                query: groups_1.CREATE_GROUP,
                variables: {
                    name: testData_1.GROUP.name,
                    groupNotificationSetting: testData_1.GROUP_NOTIFICATION_SETTING,
                    organizationId: org.id
                }
            }, { req: { headers: { authorization: `Bearer ${token}` } } });
            const groupInDb = await prisma.group.findFirst({
                where: {
                    organizationId: org.id,
                    name: testData_1.GROUP.name
                },
                include: {
                    notificationSetting: true,
                    members: true
                }
            });
            expect(groupInDb).toEqual(Object.assign(Object.assign({}, testData_1.GROUP), { id: expect.any(Number), organizationId: org.id, notificationSetting: Object.assign({ id: expect.any(Number), groupId: groupInDb === null || groupInDb === void 0 ? void 0 : groupInDb.id }, testData_1.GROUP_NOTIFICATION_SETTING), members: [
                    {
                        id: expect.any(Number),
                        userId: user.id,
                        groupId: groupInDb === null || groupInDb === void 0 ? void 0 : groupInDb.id,
                        organizationMemberId: orgMember.id,
                        admin: true
                    }
                ] }));
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
                query: groups_1.CREATE_GROUP,
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
    describe("Add users to group", () => {
        it("org admin should be able to add users to a group", async () => {
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
            const invitedOrgMember = await prisma.organizationMember.create({
                data: Object.assign({ user: {
                        connect: { id: user2.id }
                    }, organization: {
                        connect: { id: org.id }
                    } }, testData_1.ORG_NON_ADMIN_MEMBER)
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
                            admin: false,
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
                query: groups_1.ADD_USERS_TO_GROUP,
                variables: {
                    groupId: group.id,
                    users: [
                        {
                            userId: user2.id,
                            admin: false
                        }
                    ]
                }
            }, { req: { headers: { authorization: `Bearer ${token1}` } } });
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
            const { user: user1, token: token1 } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const { user: user2, token: token2 } = await (0, dbUtil_1.setupUser)(testData_1.USER2);
            const org = await prisma.organization.create({
                data: Object.assign(Object.assign({}, testData_1.ORG), { notificationSetting: {
                        create: testData_1.ORG_NOTIFICATION_SETTINGS
                    }, members: {
                        create: {
                            user: {
                                connect: { id: user1.id }
                            },
                            admin: false,
                            status: "accepted"
                        }
                    } }),
                include: {
                    members: true
                }
            });
            const invitedOrgMember = await prisma.organizationMember.create({
                data: Object.assign({ user: {
                        connect: { id: user2.id }
                    }, organization: {
                        connect: { id: org.id }
                    } }, testData_1.ORG_NON_ADMIN_MEMBER)
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
                query: groups_1.ADD_USERS_TO_GROUP,
                variables: {
                    groupId: group.id,
                    users: [
                        {
                            userId: user2.id,
                            admin: false
                        }
                    ]
                }
            }, { req: { headers: { authorization: `Bearer ${token1}` } } });
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
        // it('non org/group admin should not be able to add users to a group', async () => {})
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JvdXBzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdGVzdHMvR3JvdXBzLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBOEM7QUFFOUMsMENBQTRFO0FBQzVFLDhDQVd5QjtBQUN6QixzQ0FBbUM7QUFDbkMsOENBQXFFO0FBR3JFLE1BQU0sTUFBTSxHQUFHLElBQUkscUJBQVksRUFBRSxDQUFDO0FBRWxDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsR0FBRyxFQUFFO0lBQzNCLFVBQVUsQ0FBQyxLQUFLLElBQUksRUFBRTtRQUNwQixNQUFNLElBQUEsaUJBQVEsR0FBRSxDQUFDO0lBQ25CLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUU7UUFDNUIsRUFBRSxDQUFDLCtEQUErRCxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQzdFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsTUFBTSxJQUFBLGtCQUFTLEVBQUMsZ0JBQUssQ0FBQyxDQUFDO1lBRS9DLE1BQU0sR0FBRyxHQUFHLE1BQU0sTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUM7Z0JBQzNDLElBQUksa0NBQ0MsY0FBRyxLQUNOLG1CQUFtQixFQUFFO3dCQUNuQixNQUFNLEVBQUUsb0NBQXlCO3FCQUNsQyxHQUNGO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxTQUFTLEdBQUcsTUFBTSxNQUFNLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDO2dCQUN2RCxJQUFJLGdDQUNGLFlBQVksRUFBRTt3QkFDWixPQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRTtxQkFDeEIsSUFDRSwyQkFBZ0IsS0FDbkIsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFO3FCQUN6QixHQUNGO2FBQ0YsQ0FBQyxDQUFD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