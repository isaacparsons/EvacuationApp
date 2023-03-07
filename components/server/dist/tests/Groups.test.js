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
            const org = await (0, dbUtil_2.createOrg)({ db: prisma });
            const adminOrgMember = await (0, dbUtil_1.createAdminOrgMember)({ db: prisma, user, org });
            await server_1.server.executeOperation({
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
            const org = await (0, dbUtil_2.createOrg)({ db: prisma });
            await (0, dbUtil_1.createAdminOrgMember)({ db: prisma, user: adminUser.user, org });
            await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user: nonAdminUser.user, org });
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
            const { user: user2 } = await (0, dbUtil_1.setupUser)(testData_1.USER2);
            const org = await (0, dbUtil_2.createOrg)({ db: prisma });
            await (0, dbUtil_1.createAdminOrgMember)({ db: prisma, user: user1, org });
            const invitedOrgMember = await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user: user2, org });
            const group = await (0, dbUtil_1.createGroup)({ db: prisma, org });
            await (0, dbUtil_1.createNonAdminGroupMember)({ db: prisma, user: user1, org, group });
            await (0, dbUtil_1.createNonAdminGroupMember)({ db: prisma, user: user2, org, group });
            await server_1.server.executeOperation({
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
            const { user: user2 } = await (0, dbUtil_1.setupUser)(testData_1.USER2);
            const org = await (0, dbUtil_2.createOrg)({ db: prisma });
            await (0, dbUtil_1.createAdminOrgMember)({ db: prisma, user: user1, org });
            const invitedOrgMember = await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user: user2, org });
            const group = await (0, dbUtil_1.createGroup)({ db: prisma, org });
            await (0, dbUtil_1.createAdminGroupMember)({ db: prisma, user: user1, org, group });
            await server_1.server.executeOperation({
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
            const { user: user2 } = await (0, dbUtil_1.setupUser)(testData_1.USER2);
            const org = await (0, dbUtil_2.createOrg)({ db: prisma });
            await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user: user1, org });
            await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user: user2, org });
            const group = await (0, dbUtil_1.createGroup)({ db: prisma, org });
            await (0, dbUtil_1.createNonAdminGroupMember)({ db: prisma, user: user1, org, group });
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
            const { user: user2 } = await (0, dbUtil_1.setupUser)(testData_1.USER2);
            const org = await (0, dbUtil_2.createOrg)({ db: prisma });
            await (0, dbUtil_1.createAdminOrgMember)({ db: prisma, user: user1, org });
            await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user: user2, org });
            const group = await (0, dbUtil_1.createGroup)({ db: prisma, org });
            await (0, dbUtil_1.createNonAdminGroupMember)({ db: prisma, user: user1, org, group });
            await (0, dbUtil_1.createNonAdminGroupMember)({ db: prisma, user: user2, org, group });
            await server_1.server.executeOperation({
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
            const { user: user2 } = await (0, dbUtil_1.setupUser)(testData_1.USER2);
            const org = await (0, dbUtil_2.createOrg)({ db: prisma });
            await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user: user1, org });
            await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user: user2, org });
            const group = await (0, dbUtil_1.createGroup)({ db: prisma, org });
            await (0, dbUtil_1.createAdminGroupMember)({ db: prisma, user: user1, org, group });
            await (0, dbUtil_1.createNonAdminGroupMember)({ db: prisma, user: user2, org, group });
            await server_1.server.executeOperation({
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
            const { user: user2 } = await (0, dbUtil_1.setupUser)(testData_1.USER2);
            const org = await (0, dbUtil_2.createOrg)({ db: prisma });
            await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user: user1, org });
            await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user: user2, org });
            const group = await (0, dbUtil_1.createGroup)({ db: prisma, org });
            await (0, dbUtil_1.createNonAdminGroupMember)({ db: prisma, user: user1, org, group });
            await (0, dbUtil_1.createNonAdminGroupMember)({ db: prisma, user: user2, org, group });
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
            const org = await (0, dbUtil_2.createOrg)({ db: prisma });
            await (0, dbUtil_1.createAdminOrgMember)({ db: prisma, user: user1, org });
            const group = await (0, dbUtil_1.createGroup)({ db: prisma, org });
            await (0, dbUtil_1.createNonAdminGroupMember)({ db: prisma, user: user1, org, group });
            const updatedGroupNotificationSettings = {
                emailEnabled: true,
                smsEnabled: true,
                pushEnabled: true
            };
            await server_1.server.executeOperation({
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
            const org = await (0, dbUtil_2.createOrg)({ db: prisma });
            await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user: user1, org });
            const group = await (0, dbUtil_1.createGroup)({ db: prisma, org });
            await (0, dbUtil_1.createAdminGroupMember)({ db: prisma, user: user1, org, group });
            const updatedGroupNotificationSettings = {
                emailEnabled: true,
                smsEnabled: true,
                pushEnabled: true
            };
            await server_1.server.executeOperation({
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
            const org = await (0, dbUtil_2.createOrg)({ db: prisma });
            await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user: user1, org });
            const group = await (0, dbUtil_1.createGroup)({ db: prisma, org });
            await (0, dbUtil_1.createNonAdminGroupMember)({ db: prisma, user: user1, org, group });
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
            const org = await (0, dbUtil_2.createOrg)({ db: prisma });
            await (0, dbUtil_1.createAdminOrgMember)({ db: prisma, user: user1, org });
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
            const org = await (0, dbUtil_2.createOrg)({ db: prisma });
            const nonAdminOrgMember = await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user: user1, org });
            const group1 = await (0, dbUtil_1.createGroup)({ db: prisma, org, groupName: "test group 1" });
            await (0, dbUtil_1.createGroup)({ db: prisma, org, groupName: "test group 2" });
            await (0, dbUtil_1.createAdminGroupMember)({ db: prisma, user: user1, org, group: group1 });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JvdXBzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdGVzdHMvR3JvdXBzLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBOEM7QUFDOUMsMENBUXVCO0FBQ3ZCLDhDQUFrRjtBQUNsRixzQ0FBbUM7QUFDbkMsMENBQTBDO0FBQzFDLDREQUF1RjtBQUN2Riw4Q0FLMkI7QUFFM0IsTUFBTSxNQUFNLEdBQUcsSUFBSSxxQkFBWSxFQUFFLENBQUM7QUFFbEMsUUFBUSxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUU7SUFDM0IsVUFBVSxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ3BCLE1BQU0sSUFBQSxpQkFBUSxHQUFFLENBQUM7SUFDbkIsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtRQUM1QixFQUFFLENBQUMsK0RBQStELEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDN0UsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxNQUFNLElBQUEsa0JBQVMsRUFBQyxnQkFBSyxDQUFDLENBQUM7WUFFL0MsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFBLGtCQUFTLEVBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztZQUM1QyxNQUFNLGNBQWMsR0FBRyxNQUFNLElBQUEsNkJBQW9CLEVBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBRTdFLE1BQU0sZUFBTSxDQUFDLGdCQUFnQixDQUMzQjtnQkFDRSxLQUFLLEVBQUUscUJBQVk7Z0JBQ25CLFNBQVMsRUFBRTtvQkFDVCxJQUFJLEVBQUUsZ0JBQUssQ0FBQyxJQUFJO29CQUNoQix3QkFBd0IsRUFBRSxxQ0FBMEI7b0JBQ3BELGNBQWMsRUFBRSxHQUFHLENBQUMsRUFBRTtpQkFDdkI7YUFDRixFQUNELEVBQUUsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsYUFBYSxFQUFFLFVBQVUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFTLENBQ2xFLENBQUM7WUFDRixNQUFNLFNBQVMsR0FBRyxNQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO2dCQUM3QyxLQUFLLEVBQUU7b0JBQ0wsY0FBYyxFQUFFLEdBQUcsQ0FBQyxFQUFFO29CQUN0QixJQUFJLEVBQUUsZ0JBQUssQ0FBQyxJQUFJO2lCQUNqQjtnQkFDRCxPQUFPLEVBQUU7b0JBQ1AsbUJBQW1CLEVBQUUsSUFBSTtvQkFDekIsT0FBTyxFQUFFLElBQUk7aUJBQ2Q7YUFDRixDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxpQ0FDcEIsZ0JBQUssS0FDUixFQUFFLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFDdEIsY0FBYyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQ3RCLG1CQUFtQixrQkFDakIsRUFBRSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQ3RCLE9BQU8sRUFBRSxTQUFTLGFBQVQsU0FBUyx1QkFBVCxTQUFTLENBQUUsRUFBRSxJQUNuQixxQ0FBMEIsR0FFL0IsT0FBTyxFQUFFO29CQUNQO3dCQUNFLEVBQUUsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQzt3QkFDdEIsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFO3dCQUNmLE9BQU8sRUFBRSxTQUFTLGFBQVQsU0FBUyx1QkFBVCxTQUFTLENBQUUsRUFBRTt3QkFDdEIsb0JBQW9CLEVBQUUsY0FBYyxDQUFDLEVBQUU7d0JBQ3ZDLEtBQUssRUFBRSxJQUFJO3FCQUNaO2lCQUNGLElBQ0QsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsRUFBRSxDQUFDLHVFQUF1RSxFQUFFLEtBQUssSUFBSSxFQUFFOztZQUNyRixNQUFNLFNBQVMsR0FBRyxNQUFNLElBQUEsa0JBQVMsRUFBQyxnQkFBSyxDQUFDLENBQUM7WUFDekMsTUFBTSxZQUFZLEdBQUcsTUFBTSxJQUFBLGtCQUFTLEVBQUMsZ0JBQUssQ0FBQyxDQUFDO1lBQzVDLE1BQU0sR0FBRyxHQUFHLE1BQU0sSUFBQSxrQkFBUyxFQUFDLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDNUMsTUFBTSxJQUFBLDZCQUFvQixFQUFDLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3RFLE1BQU0sSUFBQSxnQ0FBdUIsRUFBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFlBQVksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUM1RSxNQUFNLE1BQU0sR0FBRyxNQUFNLGVBQU0sQ0FBQyxnQkFBZ0IsQ0FDMUM7Z0JBQ0UsS0FBSyxFQUFFLHFCQUFZO2dCQUNuQixTQUFTLEVBQUU7b0JBQ1QsSUFBSSxFQUFFLGdCQUFLLENBQUMsSUFBSTtvQkFDaEIsd0JBQXdCLEVBQUUscUNBQTBCO29CQUNwRCxjQUFjLEVBQUUsR0FBRyxDQUFDLEVBQUU7aUJBQ3ZCO2FBQ0YsRUFDRDtnQkFDRSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxhQUFhLEVBQUUsVUFBVSxZQUFZLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTthQUM3RCxDQUNULENBQUM7WUFDRixNQUFNLENBQUMsTUFBQSxNQUFNLENBQUMsTUFBTSwwQ0FBRSxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekMsTUFBTSxDQUFDLE1BQUEsTUFBQSxNQUFNLENBQUMsTUFBTSwwQ0FBRyxDQUFDLENBQUMsMENBQUUsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDakUsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUNILFFBQVEsQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUU7UUFDbEMsRUFBRSxDQUFDLGtEQUFrRCxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ2hFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxNQUFNLElBQUEsa0JBQVMsRUFBQyxnQkFBSyxDQUFDLENBQUM7WUFDOUQsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxNQUFNLElBQUEsa0JBQVMsRUFBQyxnQkFBSyxDQUFDLENBQUM7WUFDL0MsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFBLGtCQUFTLEVBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztZQUM1QyxNQUFNLElBQUEsNkJBQW9CLEVBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUM3RCxNQUFNLGdCQUFnQixHQUFHLE1BQU0sSUFBQSxnQ0FBdUIsRUFBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3pGLE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBQSxvQkFBVyxFQUFDLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3JELE1BQU0sSUFBQSxrQ0FBeUIsRUFBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUN6RSxNQUFNLElBQUEsa0NBQXlCLEVBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDekUsTUFBTSxlQUFNLENBQUMsZ0JBQWdCLENBQzNCO2dCQUNFLEtBQUssRUFBRSwyQkFBa0I7Z0JBQ3pCLFNBQVMsRUFBRTtvQkFDVCxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUU7b0JBQ2pCLEtBQUssRUFBRTt3QkFDTDs0QkFDRSxNQUFNLEVBQUUsS0FBSyxDQUFDLEVBQUU7NEJBQ2hCLEtBQUssRUFBRSxLQUFLO3lCQUNiO3FCQUNGO2lCQUNGO2FBQ0YsRUFDRCxFQUFFLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLGFBQWEsRUFBRSxVQUFVLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBUyxDQUNuRSxDQUFDO1lBQ0YsTUFBTSxlQUFlLEdBQUcsTUFBTSxNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQztnQkFDekQsS0FBSyxFQUFFO29CQUNMLE9BQU8sRUFBRSxLQUFLLENBQUMsRUFBRTtvQkFDakIsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFFO2lCQUNqQjthQUNGLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQzlCLEVBQUUsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztnQkFDdEIsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFFO2dCQUNoQixPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUU7Z0JBQ2pCLG9CQUFvQixFQUFFLGdCQUFnQixDQUFDLEVBQUU7Z0JBQ3pDLEtBQUssRUFBRSxLQUFLO2FBQ2IsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxFQUFFLENBQUMsb0RBQW9ELEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDbEUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLE1BQU0sSUFBQSxrQkFBUyxFQUFDLGdCQUFLLENBQUMsQ0FBQztZQUM5RCxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLE1BQU0sSUFBQSxrQkFBUyxFQUFDLGdCQUFLLENBQUMsQ0FBQztZQUMvQyxNQUFNLEdBQUcsR0FBRyxNQUFNLElBQUEsa0JBQVMsRUFBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBQzVDLE1BQU0sSUFBQSw2QkFBb0IsRUFBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQzdELE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxJQUFBLGdDQUF1QixFQUFDLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDekYsTUFBTSxLQUFLLEdBQUcsTUFBTSxJQUFBLG9CQUFXLEVBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDckQsTUFBTSxJQUFBLCtCQUFzQixFQUFDLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3RFLE1BQU0sZUFBTSxDQUFDLGdCQUFnQixDQUMzQjtnQkFDRSxLQUFLLEVBQUUsMkJBQWtCO2dCQUN6QixTQUFTLEVBQUU7b0JBQ1QsT0FBTyxFQUFFLEtBQUssQ0FBQyxFQUFFO29CQUNqQixLQUFLLEVBQUU7d0JBQ0w7NEJBQ0UsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFFOzRCQUNoQixLQUFLLEVBQUUsS0FBSzt5QkFDYjtxQkFDRjtpQkFDRjthQUNGLEVBQ0QsRUFBRSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxhQUFhLEVBQUUsVUFBVSxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQVMsQ0FDbkUsQ0FBQztZQUNGLE1BQU0sZUFBZSxHQUFHLE1BQU0sTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUM7Z0JBQ3pELEtBQUssRUFBRTtvQkFDTCxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUU7b0JBQ2pCLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBRTtpQkFDakI7YUFDRixDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUM5QixFQUFFLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7Z0JBQ3RCLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBRTtnQkFDaEIsT0FBTyxFQUFFLEtBQUssQ0FBQyxFQUFFO2dCQUNqQixvQkFBb0IsRUFBRSxnQkFBZ0IsQ0FBQyxFQUFFO2dCQUN6QyxLQUFLLEVBQUUsS0FBSzthQUNiLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsRUFBRSxDQUFDLGdFQUFnRSxFQUFFLEtBQUssSUFBSSxFQUFFOztZQUM5RSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsTUFBTSxJQUFBLGtCQUFTLEVBQUMsZ0JBQUssQ0FBQyxDQUFDO1lBQzlELE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsTUFBTSxJQUFBLGtCQUFTLEVBQUMsZ0JBQUssQ0FBQyxDQUFDO1lBQy9DLE1BQU0sR0FBRyxHQUFHLE1BQU0sSUFBQSxrQkFBUyxFQUFDLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDNUMsTUFBTSxJQUFBLGdDQUF1QixFQUFDLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDaEUsTUFBTSxJQUFBLGdDQUF1QixFQUFDLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFFaEUsTUFBTSxLQUFLLEdBQUcsTUFBTSxJQUFBLG9CQUFXLEVBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDckQsTUFBTSxJQUFBLGtDQUF5QixFQUFDLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3pFLE1BQU0sTUFBTSxHQUFHLE1BQU0sZUFBTSxDQUFDLGdCQUFnQixDQUMxQztnQkFDRSxLQUFLLEVBQUUsMkJBQWtCO2dCQUN6QixTQUFTLEVBQUU7b0JBQ1QsT0FBTyxFQUFFLEtBQUssQ0FBQyxFQUFFO29CQUNqQixLQUFLLEVBQUU7d0JBQ0w7NEJBQ0UsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFFOzRCQUNoQixLQUFLLEVBQUUsS0FBSzt5QkFDYjtxQkFDRjtpQkFDRjthQUNGLEVBQ0QsRUFBRSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxhQUFhLEVBQUUsVUFBVSxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQVMsQ0FDbkUsQ0FBQztZQUNGLE1BQU0sZUFBZSxHQUFHLE1BQU0sTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUM7Z0JBQ3pELEtBQUssRUFBRTtvQkFDTCxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUU7b0JBQ2pCLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBRTtpQkFDakI7YUFDRixDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsTUFBQSxNQUFNLENBQUMsTUFBTSwwQ0FBRSxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekMsTUFBTSxDQUFDLE1BQUEsTUFBQSxNQUFNLENBQUMsTUFBTSwwQ0FBRyxDQUFDLENBQUMsMENBQUUsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDL0QsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDSCxRQUFRLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtRQUM1QixFQUFFLENBQUMsdURBQXVELEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDckUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLE1BQU0sSUFBQSxrQkFBUyxFQUFDLGdCQUFLLENBQUMsQ0FBQztZQUM5RCxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLE1BQU0sSUFBQSxrQkFBUyxFQUFDLGdCQUFLLENBQUMsQ0FBQztZQUMvQyxNQUFNLEdBQUcsR0FBRyxNQUFNLElBQUEsa0JBQVMsRUFBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBQzVDLE1BQU0sSUFBQSw2QkFBb0IsRUFBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQzdELE1BQU0sSUFBQSxnQ0FBdUIsRUFBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBRWhFLE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBQSxvQkFBVyxFQUFDLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBRXJELE1BQU0sSUFBQSxrQ0FBeUIsRUFBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUN6RSxNQUFNLElBQUEsa0NBQXlCLEVBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDekUsTUFBTSxlQUFNLENBQUMsZ0JBQWdCLENBQzNCO2dCQUNFLEtBQUssRUFBRSxxQkFBWTtnQkFDbkIsU0FBUyxFQUFFO29CQUNULE9BQU8sRUFBRSxLQUFLLENBQUMsRUFBRTtvQkFDakIsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztpQkFDcEI7YUFDRixFQUNELEVBQUUsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsYUFBYSxFQUFFLFVBQVUsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFTLENBQ25FLENBQUM7WUFDRixNQUFNLGVBQWUsR0FBRyxNQUFNLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDO2dCQUN6RCxLQUFLLEVBQUU7b0JBQ0wsT0FBTyxFQUFFLEtBQUssQ0FBQyxFQUFFO29CQUNqQixNQUFNLEVBQUUsS0FBSyxDQUFDLEVBQUU7aUJBQ2pCO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsRUFBRSxDQUFDLHlEQUF5RCxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ3ZFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxNQUFNLElBQUEsa0JBQVMsRUFBQyxnQkFBSyxDQUFDLENBQUM7WUFDOUQsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxNQUFNLElBQUEsa0JBQVMsRUFBQyxnQkFBSyxDQUFDLENBQUM7WUFDL0MsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFBLGtCQUFTLEVBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztZQUM1QyxNQUFNLElBQUEsZ0NBQXVCLEVBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUNoRSxNQUFNLElBQUEsZ0NBQXVCLEVBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUVoRSxNQUFNLEtBQUssR0FBRyxNQUFNLElBQUEsb0JBQVcsRUFBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUVyRCxNQUFNLElBQUEsK0JBQXNCLEVBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDdEUsTUFBTSxJQUFBLGtDQUF5QixFQUFDLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3pFLE1BQU0sZUFBTSxDQUFDLGdCQUFnQixDQUMzQjtnQkFDRSxLQUFLLEVBQUUscUJBQVk7Z0JBQ25CLFNBQVMsRUFBRTtvQkFDVCxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUU7b0JBQ2pCLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7aUJBQ3BCO2FBQ0YsRUFDRCxFQUFFLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLGFBQWEsRUFBRSxVQUFVLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBUyxDQUNuRSxDQUFDO1lBQ0YsTUFBTSxlQUFlLEdBQUcsTUFBTSxNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQztnQkFDekQsS0FBSyxFQUFFO29CQUNMLE9BQU8sRUFBRSxLQUFLLENBQUMsRUFBRTtvQkFDakIsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFFO2lCQUNqQjthQUNGLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNyQyxDQUFDLENBQUMsQ0FBQztRQUNILEVBQUUsQ0FBQyxxRUFBcUUsRUFBRSxLQUFLLElBQUksRUFBRTs7WUFDbkYsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLE1BQU0sSUFBQSxrQkFBUyxFQUFDLGdCQUFLLENBQUMsQ0FBQztZQUM5RCxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLE1BQU0sSUFBQSxrQkFBUyxFQUFDLGdCQUFLLENBQUMsQ0FBQztZQUMvQyxNQUFNLEdBQUcsR0FBRyxNQUFNLElBQUEsa0JBQVMsRUFBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBQzVDLE1BQU0sSUFBQSxnQ0FBdUIsRUFBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ2hFLE1BQU0sSUFBQSxnQ0FBdUIsRUFBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBRWhFLE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBQSxvQkFBVyxFQUFDLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBRXJELE1BQU0sSUFBQSxrQ0FBeUIsRUFBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUN6RSxNQUFNLElBQUEsa0NBQXlCLEVBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDekUsTUFBTSxNQUFNLEdBQUcsTUFBTSxlQUFNLENBQUMsZ0JBQWdCLENBQzFDO2dCQUNFLEtBQUssRUFBRSxxQkFBWTtnQkFDbkIsU0FBUyxFQUFFO29CQUNULE9BQU8sRUFBRSxLQUFLLENBQUMsRUFBRTtvQkFDakIsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztpQkFDcEI7YUFDRixFQUNELEVBQUUsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsYUFBYSxFQUFFLFVBQVUsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFTLENBQ25FLENBQUM7WUFDRixNQUFNLGVBQWUsR0FBRyxNQUFNLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDO2dCQUN6RCxLQUFLLEVBQUU7b0JBQ0wsT0FBTyxFQUFFLEtBQUssQ0FBQyxFQUFFO29CQUNqQixNQUFNLEVBQUUsS0FBSyxDQUFDLEVBQUU7aUJBQ2pCO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLE1BQUEsTUFBTSxDQUFDLE1BQU0sMENBQUUsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLE1BQU0sQ0FBQyxNQUFBLE1BQUEsTUFBTSxDQUFDLE1BQU0sMENBQUcsQ0FBQyxDQUFDLDBDQUFFLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQy9ELE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0gsUUFBUSxDQUFDLDhCQUE4QixFQUFFLEdBQUcsRUFBRTtRQUM1QyxFQUFFLENBQUMsc0VBQXNFLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDcEYsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLE1BQU0sSUFBQSxrQkFBUyxFQUFDLGdCQUFLLENBQUMsQ0FBQztZQUM5RCxNQUFNLEdBQUcsR0FBRyxNQUFNLElBQUEsa0JBQVMsRUFBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBQzVDLE1BQU0sSUFBQSw2QkFBb0IsRUFBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBRTdELE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBQSxvQkFBVyxFQUFDLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBRXJELE1BQU0sSUFBQSxrQ0FBeUIsRUFBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUN6RSxNQUFNLGdDQUFnQyxHQUFHO2dCQUN2QyxZQUFZLEVBQUUsSUFBSTtnQkFDbEIsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLFdBQVcsRUFBRSxJQUFJO2FBQ2xCLENBQUM7WUFDRixNQUFNLGVBQU0sQ0FBQyxnQkFBZ0IsQ0FDM0I7Z0JBQ0UsS0FBSyxFQUFFLHFDQUE0QjtnQkFDbkMsU0FBUyxFQUFFO29CQUNULE9BQU8sRUFBRSxLQUFLLENBQUMsRUFBRTtvQkFDakIsd0JBQXdCLEVBQUUsZ0NBQWdDO2lCQUMzRDthQUNGLEVBQ0QsRUFBRSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxhQUFhLEVBQUUsVUFBVSxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQVMsQ0FDbkUsQ0FBQztZQUNGLE1BQU0sNkJBQTZCLEdBQUcsTUFBTSxNQUFNLENBQUMsd0JBQXdCLENBQUMsU0FBUyxDQUFDO2dCQUNwRixLQUFLLEVBQUU7b0JBQ0wsT0FBTyxFQUFFLEtBQUssQ0FBQyxFQUFFO2lCQUNsQjthQUNGLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLE9BQU8saUJBQzNDLEVBQUUsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUN0QixPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUUsSUFDZCxnQ0FBZ0MsRUFDbkMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsRUFBRSxDQUFDLHdFQUF3RSxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ3RGLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxNQUFNLElBQUEsa0JBQVMsRUFBQyxnQkFBSyxDQUFDLENBQUM7WUFDOUQsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFBLGtCQUFTLEVBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztZQUM1QyxNQUFNLElBQUEsZ0NBQXVCLEVBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUVoRSxNQUFNLEtBQUssR0FBRyxNQUFNLElBQUEsb0JBQVcsRUFBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUVyRCxNQUFNLElBQUEsK0JBQXNCLEVBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDdEUsTUFBTSxnQ0FBZ0MsR0FBRztnQkFDdkMsWUFBWSxFQUFFLElBQUk7Z0JBQ2xCLFVBQVUsRUFBRSxJQUFJO2dCQUNoQixXQUFXLEVBQUUsSUFBSTthQUNsQixDQUFDO1lBQ0YsTUFBTSxlQUFNLENBQUMsZ0JBQWdCLENBQzNCO2dCQUNFLEtBQUssRUFBRSxxQ0FBNEI7Z0JBQ25DLFNBQVMsRUFBRTtvQkFDVCxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUU7b0JBQ2pCLHdCQUF3QixFQUFFLGdDQUFnQztpQkFDM0Q7YUFDRixFQUNELEVBQUUsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsYUFBYSxFQUFFLFVBQVUsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFTLENBQ25FLENBQUM7WUFDRixNQUFNLDZCQUE2QixHQUFHLE1BQU0sTUFBTSxDQUFDLHdCQUF3QixDQUFDLFNBQVMsQ0FBQztnQkFDcEYsS0FBSyxFQUFFO29CQUNMLE9BQU8sRUFBRSxLQUFLLENBQUMsRUFBRTtpQkFDbEI7YUFDRixDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxPQUFPLGlCQUMzQyxFQUFFLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFDdEIsT0FBTyxFQUFFLEtBQUssQ0FBQyxFQUFFLElBQ2QsZ0NBQWdDLEVBQ25DLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILEVBQUUsQ0FBQyxvRkFBb0YsRUFBRSxLQUFLLElBQUksRUFBRTs7WUFDbEcsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLE1BQU0sSUFBQSxrQkFBUyxFQUFDLGdCQUFLLENBQUMsQ0FBQztZQUM5RCxNQUFNLEdBQUcsR0FBRyxNQUFNLElBQUEsa0JBQVMsRUFBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBQzVDLE1BQU0sSUFBQSxnQ0FBdUIsRUFBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBRWhFLE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBQSxvQkFBVyxFQUFDLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBRXJELE1BQU0sSUFBQSxrQ0FBeUIsRUFBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUN6RSxNQUFNLGdDQUFnQyxHQUFHO2dCQUN2QyxZQUFZLEVBQUUsSUFBSTtnQkFDbEIsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLFdBQVcsRUFBRSxJQUFJO2FBQ2xCLENBQUM7WUFDRixNQUFNLE1BQU0sR0FBRyxNQUFNLGVBQU0sQ0FBQyxnQkFBZ0IsQ0FDMUM7Z0JBQ0UsS0FBSyxFQUFFLHFDQUE0QjtnQkFDbkMsU0FBUyxFQUFFO29CQUNULE9BQU8sRUFBRSxLQUFLLENBQUMsRUFBRTtvQkFDakIsd0JBQXdCLEVBQUUsZ0NBQWdDO2lCQUMzRDthQUNGLEVBQ0QsRUFBRSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxhQUFhLEVBQUUsVUFBVSxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQVMsQ0FDbkUsQ0FBQztZQUNGLE1BQU0sNkJBQTZCLEdBQUcsTUFBTSxNQUFNLENBQUMsd0JBQXdCLENBQUMsU0FBUyxDQUFDO2dCQUNwRixLQUFLLEVBQUU7b0JBQ0wsT0FBTyxFQUFFLEtBQUssQ0FBQyxFQUFFO2lCQUNsQjthQUNGLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxNQUFBLE1BQU0sQ0FBQyxNQUFNLDBDQUFFLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QyxNQUFNLENBQUMsTUFBQSxNQUFBLE1BQU0sQ0FBQyxNQUFNLDBDQUFHLENBQUMsQ0FBQywwQ0FBRSxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUMvRCxNQUFNLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxPQUFPLGlCQUMzQyxFQUFFLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFDdEIsT0FBTyxFQUFFLEtBQUssQ0FBQyxFQUFFLElBQ2QscUNBQTBCLEVBQzdCLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0gsUUFBUSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRTtRQUN4QyxFQUFFLENBQUMsb0VBQW9FLEVBQUUsS0FBSyxJQUFJLEVBQUU7O1lBQ2xGLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxNQUFNLElBQUEsa0JBQVMsRUFBQyxnQkFBSyxDQUFDLENBQUM7WUFDOUQsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFBLGtCQUFTLEVBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztZQUM1QyxNQUFNLElBQUEsNkJBQW9CLEVBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUU3RCxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUEsb0JBQVcsRUFBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDO1lBQ2pGLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBQSxvQkFBVyxFQUFDLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUM7WUFFakYsTUFBTSxNQUFNLEdBQUcsTUFBTSxlQUFNLENBQUMsZ0JBQWdCLENBQzFDO2dCQUNFLEtBQUssRUFBRSxnQ0FBZ0I7Z0JBQ3ZCLFNBQVMsRUFBRTtvQkFDVCxjQUFjLEVBQUUsR0FBRyxDQUFDLEVBQUU7aUJBQ3ZCO2FBQ0YsRUFDRCxFQUFFLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLGFBQWEsRUFBRSxVQUFVLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBUyxDQUNuRSxDQUFDO1lBQ0YsTUFBTSxDQUFDLE1BQUEsTUFBQSxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsSUFBSSwwQ0FBRSxlQUFlLDBDQUFFLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDcEQ7b0JBQ0UsY0FBYyxFQUFFLEdBQUcsQ0FBQyxFQUFFO29CQUN0QixFQUFFLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7b0JBQ3RCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtpQkFDbEI7Z0JBQ0Q7b0JBQ0UsY0FBYyxFQUFFLEdBQUcsQ0FBQyxFQUFFO29CQUN0QixFQUFFLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7b0JBQ3RCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtpQkFDbEI7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0gsUUFBUSxDQUFDLDhCQUE4QixFQUFFLEdBQUcsRUFBRTtRQUM1QyxFQUFFLENBQUMsZ0ZBQWdGLEVBQUUsS0FBSyxJQUFJLEVBQUU7O1lBQzlGLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxNQUFNLElBQUEsa0JBQVMsRUFBQyxnQkFBSyxDQUFDLENBQUM7WUFDOUQsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFBLGtCQUFTLEVBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztZQUM1QyxNQUFNLGlCQUFpQixHQUFHLE1BQU0sSUFBQSxnQ0FBdUIsRUFBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBRTFGLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBQSxvQkFBVyxFQUFDLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUM7WUFDakYsTUFBTSxJQUFBLG9CQUFXLEVBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQztZQUVsRSxNQUFNLElBQUEsK0JBQXNCLEVBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBRTlFLE1BQU0sTUFBTSxHQUFHLE1BQU0sZUFBTSxDQUFDLGdCQUFnQixDQUMxQztnQkFDRSxLQUFLLEVBQUUseUNBQXlCO2dCQUNoQyxTQUFTLEVBQUU7b0JBQ1QsY0FBYyxFQUFFLEdBQUcsQ0FBQyxFQUFFO2lCQUN2QjthQUNGLEVBQ0QsRUFBRSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxhQUFhLEVBQUUsVUFBVSxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQVMsQ0FDbkUsQ0FBQztZQUNGLE1BQU0sQ0FBQyxNQUFBLE1BQUEsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLElBQUksMENBQUUsc0JBQXNCLDBDQUFFLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDM0Q7b0JBQ0UsRUFBRSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO29CQUN0QixNQUFNLEVBQUUsS0FBSyxDQUFDLEVBQUU7b0JBQ2hCLE9BQU8sRUFBRSxNQUFNLENBQUMsRUFBRTtvQkFDbEIsb0JBQW9CLEVBQUUsaUJBQWlCLENBQUMsRUFBRTtvQkFDMUMsa0JBQWtCLEVBQUU7d0JBQ2xCLEVBQUUsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQzt3QkFDdEIsTUFBTSxFQUFFLFVBQVU7d0JBQ2xCLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBRTt3QkFDaEIsS0FBSyxFQUFFLEtBQUs7d0JBQ1osY0FBYyxFQUFFLEdBQUcsQ0FBQyxFQUFFO3FCQUN2QjtvQkFDRCxLQUFLLEVBQUUsSUFBSTtvQkFDWCxLQUFLLEVBQUU7d0JBQ0wsY0FBYyxFQUFFLEdBQUcsQ0FBQyxFQUFFO3dCQUN0QixFQUFFLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7d0JBQ3RCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtxQkFDbEI7aUJBQ0Y7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==