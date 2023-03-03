"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const dbUtil_1 = require("../dev/dbUtil");
const testData_1 = require("../dev/testData");
const server_1 = require("../server");
const dbUtil_2 = require("../dev/dbUtil");
const organizations_1 = require("../dev/gql/organizations");
const groups_1 = require("../dev/gql/groups");
const prisma = new client_1.PrismaClient();
describe("group tests", () => {
    beforeEach(async () => {
        await (0, dbUtil_1.deleteDb)();
    });
    describe("Create group", () => {
        it("org admin should be able to create a group in an organization", async () => {
            const { user, token } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const org = await (0, dbUtil_2.createOrg)(prisma);
            const adminOrgMember = await (0, dbUtil_1.createAdminOrgMember)(prisma, user, org);
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
                        organizationMemberId: adminOrgMember.id,
                        admin: true
                    }
                ] }));
        });
        it("non org admin should not be able to create a group in an organization", async () => {
            var _a, _b, _c;
            const adminUser = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const nonAdminUser = await (0, dbUtil_1.setupUser)(testData_1.USER2);
            const org = await (0, dbUtil_2.createOrg)(prisma);
            const adminOrgMember = await (0, dbUtil_1.createAdminOrgMember)(prisma, adminUser.user, org);
            const nonAdminOrgMember = await (0, dbUtil_1.createNonAdminOrgMember)(prisma, nonAdminUser.user, org);
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
            const org = await (0, dbUtil_2.createOrg)(prisma);
            const orgAdminMember = await (0, dbUtil_1.createAdminOrgMember)(prisma, user1, org);
            const invitedOrgMember = await (0, dbUtil_1.createNonAdminOrgMember)(prisma, user2, org);
            const group = await (0, dbUtil_1.createGroup)({ db: prisma, org });
            const nonAdminGroupMember1 = await (0, dbUtil_1.createNonAdminGroupMember)(prisma, user1, org, group);
            const nonAdminGroupMember2 = await (0, dbUtil_1.createNonAdminGroupMember)(prisma, user2, org, group);
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
            const org = await (0, dbUtil_2.createOrg)(prisma);
            const adminOrgMember = await (0, dbUtil_1.createAdminOrgMember)(prisma, user1, org);
            const invitedOrgMember = await (0, dbUtil_1.createNonAdminOrgMember)(prisma, user2, org);
            const group = await (0, dbUtil_1.createGroup)({ db: prisma, org });
            const adminGroupMember = await (0, dbUtil_1.createAdminGroupMember)(prisma, user1, org, group);
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
        it("non org/group admin should not be able to add users to a group", async () => {
            var _a, _b, _c;
            const { user: user1, token: token1 } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const { user: user2, token: token2 } = await (0, dbUtil_1.setupUser)(testData_1.USER2);
            const org = await (0, dbUtil_2.createOrg)(prisma);
            const nonAdminOrgMember1 = await (0, dbUtil_1.createNonAdminOrgMember)(prisma, user1, org);
            const nonAdminOrgMember2 = await (0, dbUtil_1.createNonAdminOrgMember)(prisma, user2, org);
            const group = await (0, dbUtil_1.createGroup)({ db: prisma, org });
            const nonAdminGroupMember1 = await (0, dbUtil_1.createNonAdminGroupMember)(prisma, user1, org, group);
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
            expect((_a = result.errors) === null || _a === void 0 ? void 0 : _a.length).toEqual(1);
            expect((_c = (_b = result.errors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message).toEqual("Not Authorised!");
            expect(groupMemberInDb).toBeNull();
        });
    });
    describe("Remove users", () => {
        it("org admin should be able to remove users from a group", async () => {
            const { user: user1, token: token1 } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const { user: user2, token: token2 } = await (0, dbUtil_1.setupUser)(testData_1.USER2);
            const org = await (0, dbUtil_2.createOrg)(prisma);
            const adminOrgMember = await (0, dbUtil_1.createAdminOrgMember)(prisma, user1, org);
            const nonAdminOrgMember = await (0, dbUtil_1.createNonAdminOrgMember)(prisma, user2, org);
            const group = await (0, dbUtil_1.createGroup)({ db: prisma, org });
            const nonAdminGroupMember1 = await (0, dbUtil_1.createNonAdminGroupMember)(prisma, user1, org, group);
            const nonAdminGroupMember2 = await (0, dbUtil_1.createNonAdminGroupMember)(prisma, user2, org, group);
            const result = await server_1.server.executeOperation({
                query: groups_1.REMOVE_USERS,
                variables: {
                    groupId: group.id,
                    userIds: [user2.id]
                }
            }, { req: { headers: { authorization: `Bearer ${token1}` } } });
            const groupMemberInDb = await prisma.groupMember.findFirst({
                where: {
                    groupId: group.id,
                    userId: user2.id
                }
            });
            expect(groupMemberInDb).toBeNull();
        });
        it("group admin should be able to remove users from a group", async () => {
            const { user: user1, token: token1 } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const { user: user2, token: token2 } = await (0, dbUtil_1.setupUser)(testData_1.USER2);
            const org = await (0, dbUtil_2.createOrg)(prisma);
            const nonAdminOrgMember1 = await (0, dbUtil_1.createNonAdminOrgMember)(prisma, user1, org);
            const nonAdminOrgMember2 = await (0, dbUtil_1.createNonAdminOrgMember)(prisma, user2, org);
            const group = await (0, dbUtil_1.createGroup)({ db: prisma, org });
            const adminGroupMember1 = await (0, dbUtil_1.createAdminGroupMember)(prisma, user1, org, group);
            const nonAdminGroupMember2 = await (0, dbUtil_1.createNonAdminGroupMember)(prisma, user2, org, group);
            const result = await server_1.server.executeOperation({
                query: groups_1.REMOVE_USERS,
                variables: {
                    groupId: group.id,
                    userIds: [user2.id]
                }
            }, { req: { headers: { authorization: `Bearer ${token1}` } } });
            const groupMemberInDb = await prisma.groupMember.findFirst({
                where: {
                    groupId: group.id,
                    userId: user2.id
                }
            });
            expect(groupMemberInDb).toBeNull();
        });
        it("non org/group admin should not be able to remove users from a group", async () => {
            var _a, _b, _c;
            const { user: user1, token: token1 } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const { user: user2, token: token2 } = await (0, dbUtil_1.setupUser)(testData_1.USER2);
            const org = await (0, dbUtil_2.createOrg)(prisma);
            const nonAdminOrgMember1 = await (0, dbUtil_1.createNonAdminOrgMember)(prisma, user1, org);
            const nonAdminOrgMember2 = await (0, dbUtil_1.createNonAdminOrgMember)(prisma, user2, org);
            const group = await (0, dbUtil_1.createGroup)({ db: prisma, org });
            const nonAdminGroupMember1 = await (0, dbUtil_1.createNonAdminGroupMember)(prisma, user1, org, group);
            const nonAdminGroupMember2 = await (0, dbUtil_1.createNonAdminGroupMember)(prisma, user2, org, group);
            const result = await server_1.server.executeOperation({
                query: groups_1.REMOVE_USERS,
                variables: {
                    groupId: group.id,
                    userIds: [user2.id]
                }
            }, { req: { headers: { authorization: `Bearer ${token1}` } } });
            const groupMemberInDb = await prisma.groupMember.findFirst({
                where: {
                    groupId: group.id,
                    userId: user2.id
                }
            });
            expect((_a = result.errors) === null || _a === void 0 ? void 0 : _a.length).toEqual(1);
            expect((_c = (_b = result.errors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message).toEqual("Not Authorised!");
            expect(groupMemberInDb).toBeDefined();
        });
    });
    describe("Update notification settings", () => {
        it("org admin should be able to update notification settings for a group", async () => {
            const { user: user1, token: token1 } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const org = await (0, dbUtil_2.createOrg)(prisma);
            const adminOrgMember = await (0, dbUtil_1.createAdminOrgMember)(prisma, user1, org);
            const group = await (0, dbUtil_1.createGroup)({ db: prisma, org });
            const nonAdminGroupMember1 = await (0, dbUtil_1.createNonAdminGroupMember)(prisma, user1, org, group);
            const updatedGroupNotificationSettings = {
                emailEnabled: true,
                smsEnabled: true,
                pushEnabled: true
            };
            const result = await server_1.server.executeOperation({
                query: groups_1.UPDATE_NOTIFICATION_SETTINGS,
                variables: {
                    groupId: group.id,
                    groupNotificationSetting: updatedGroupNotificationSettings
                }
            }, { req: { headers: { authorization: `Bearer ${token1}` } } });
            const groupNotificationSettingsInDb = await prisma.groupNotificationSetting.findFirst({
                where: {
                    groupId: group.id
                }
            });
            expect(groupNotificationSettingsInDb).toEqual(Object.assign({ id: expect.any(Number), groupId: group.id }, updatedGroupNotificationSettings));
        });
        it("group admin should be able to update notification settings for a group", async () => {
            const { user: user1, token: token1 } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const org = await (0, dbUtil_2.createOrg)(prisma);
            const nonAdminOrgMember = await (0, dbUtil_1.createNonAdminOrgMember)(prisma, user1, org);
            const group = await (0, dbUtil_1.createGroup)({ db: prisma, org });
            const adminGroupMember1 = await (0, dbUtil_1.createAdminGroupMember)(prisma, user1, org, group);
            const updatedGroupNotificationSettings = {
                emailEnabled: true,
                smsEnabled: true,
                pushEnabled: true
            };
            const result = await server_1.server.executeOperation({
                query: groups_1.UPDATE_NOTIFICATION_SETTINGS,
                variables: {
                    groupId: group.id,
                    groupNotificationSetting: updatedGroupNotificationSettings
                }
            }, { req: { headers: { authorization: `Bearer ${token1}` } } });
            const groupNotificationSettingsInDb = await prisma.groupNotificationSetting.findFirst({
                where: {
                    groupId: group.id
                }
            });
            expect(groupNotificationSettingsInDb).toEqual(Object.assign({ id: expect.any(Number), groupId: group.id }, updatedGroupNotificationSettings));
        });
        it("non group/org admin should not be able to update notification settings for a group", async () => {
            var _a, _b, _c;
            const { user: user1, token: token1 } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const org = await (0, dbUtil_2.createOrg)(prisma);
            const nonAdminOrgMember = await (0, dbUtil_1.createNonAdminOrgMember)(prisma, user1, org);
            const group = await (0, dbUtil_1.createGroup)({ db: prisma, org });
            const adminGroupMember1 = await (0, dbUtil_1.createNonAdminGroupMember)(prisma, user1, org, group);
            const updatedGroupNotificationSettings = {
                emailEnabled: true,
                smsEnabled: true,
                pushEnabled: true
            };
            const result = await server_1.server.executeOperation({
                query: groups_1.UPDATE_NOTIFICATION_SETTINGS,
                variables: {
                    groupId: group.id,
                    groupNotificationSetting: updatedGroupNotificationSettings
                }
            }, { req: { headers: { authorization: `Bearer ${token1}` } } });
            const groupNotificationSettingsInDb = await prisma.groupNotificationSetting.findFirst({
                where: {
                    groupId: group.id
                }
            });
            expect((_a = result.errors) === null || _a === void 0 ? void 0 : _a.length).toEqual(1);
            expect((_c = (_b = result.errors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message).toEqual("Not Authorised!");
            expect(groupNotificationSettingsInDb).toEqual(Object.assign({ id: expect.any(Number), groupId: group.id }, testData_1.GROUP_NOTIFICATION_SETTING));
        });
    });
    describe("get groups for org admin", () => {
        it("should get groups created by them and group created by other users", async () => {
            var _a, _b;
            const { user: user1, token: token1 } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const org = await (0, dbUtil_2.createOrg)(prisma);
            const adminOrgMember = await (0, dbUtil_1.createAdminOrgMember)(prisma, user1, org);
            const group1 = await (0, dbUtil_1.createGroup)({ db: prisma, org, groupName: "test group 1" });
            const group2 = await (0, dbUtil_1.createGroup)({ db: prisma, org, groupName: "test group 2" });
            const result = await server_1.server.executeOperation({
                query: organizations_1.GET_ORGANIZATION,
                variables: {
                    organizationId: org.id
                }
            }, { req: { headers: { authorization: `Bearer ${token1}` } } });
            expect((_b = (_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.getOrganization) === null || _b === void 0 ? void 0 : _b.groups).toEqual([
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
            var _a, _b;
            const { user: user1, token: token1 } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const org = await (0, dbUtil_2.createOrg)(prisma);
            const nonAdminOrgMember = await (0, dbUtil_1.createNonAdminOrgMember)(prisma, user1, org);
            const group1 = await (0, dbUtil_1.createGroup)({ db: prisma, org, groupName: "test group 1" });
            const group2 = await (0, dbUtil_1.createGroup)({ db: prisma, org, groupName: "test group 2" });
            const adminGroupMember1 = await (0, dbUtil_1.createAdminGroupMember)(prisma, user1, org, group1);
            const result = await server_1.server.executeOperation({
                query: organizations_1.GET_ORGANIZATION_FOR_USER,
                variables: {
                    organizationId: org.id
                }
            }, { req: { headers: { authorization: `Bearer ${token1}` } } });
            expect((_b = (_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.getOrganizationForUser) === null || _b === void 0 ? void 0 : _b.groups).toEqual([
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JvdXBzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdGVzdHMvR3JvdXBzLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBOEM7QUFDOUMsMENBUXVCO0FBQ3ZCLDhDQUFrRjtBQUNsRixzQ0FBbUM7QUFDbkMsMENBQTBDO0FBQzFDLDREQUF1RjtBQUN2Riw4Q0FLMkI7QUFFM0IsTUFBTSxNQUFNLEdBQUcsSUFBSSxxQkFBWSxFQUFFLENBQUM7QUFFbEMsUUFBUSxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUU7SUFDM0IsVUFBVSxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ3BCLE1BQU0sSUFBQSxpQkFBUSxHQUFFLENBQUM7SUFDbkIsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtRQUM1QixFQUFFLENBQUMsK0RBQStELEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDN0UsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxNQUFNLElBQUEsa0JBQVMsRUFBQyxnQkFBSyxDQUFDLENBQUM7WUFFL0MsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFBLGtCQUFTLEVBQUMsTUFBTSxDQUFDLENBQUM7WUFDcEMsTUFBTSxjQUFjLEdBQUcsTUFBTSxJQUFBLDZCQUFvQixFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFFckUsTUFBTSxNQUFNLEdBQUcsTUFBTSxlQUFNLENBQUMsZ0JBQWdCLENBQzFDO2dCQUNFLEtBQUssRUFBRSxxQkFBWTtnQkFDbkIsU0FBUyxFQUFFO29CQUNULElBQUksRUFBRSxnQkFBSyxDQUFDLElBQUk7b0JBQ2hCLHdCQUF3QixFQUFFLHFDQUEwQjtvQkFDcEQsY0FBYyxFQUFFLEdBQUcsQ0FBQyxFQUFFO2lCQUN2QjthQUNGLEVBQ0QsRUFBRSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxhQUFh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