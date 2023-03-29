"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const dbUtil_1 = require("../dev/dbUtil");
const testData_1 = require("../dev/testData");
const server_1 = require("../server");
const organizations_1 = require("../dev/gql/organizations");
const Mailhog_1 = __importDefault(require("../dev/Mailhog"));
const organizations_2 = require("../dev/gql/organizations");
const dbUtil_2 = require("../dev/dbUtil");
const prisma = new client_1.PrismaClient();
const mailhog = new Mailhog_1.default();
describe("organization tests", () => {
    beforeEach(async () => {
        await (0, dbUtil_1.deleteDb)();
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
            var _a, _b, _c;
            const { user: memberUser1, token: adminUserToken } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const { user: memberUser2 } = await (0, dbUtil_1.setupUser)(testData_1.USER2);
            const { user: memberUser3 } = await (0, dbUtil_1.setupUser)(testData_1.USER3);
            const { user: memberUser4 } = await (0, dbUtil_1.setupUser)(testData_1.USER4);
            const { user: memberUser5 } = await (0, dbUtil_1.setupUser)(testData_1.USER5);
            const { user: memberUser6 } = await (0, dbUtil_1.setupUser)(testData_1.USER6);
            const org = await (0, dbUtil_1.createOrg)({ db: prisma });
            const member1 = await (0, dbUtil_1.createAdminOrgMember)({ db: prisma, user: memberUser1, org });
            const member2 = await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user: memberUser2, org });
            const member3 = await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user: memberUser3, org });
            const member4 = await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user: memberUser4, org });
            const member5 = await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user: memberUser5, org });
            const member6 = await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user: memberUser6, org });
            const result1 = await server_1.server.executeOperation({
                query: organizations_2.GET_ORGANIZATION_MEMBERS,
                variables: { organizationId: org.id }
            }, {
                req: { headers: { authorization: `Bearer ${adminUserToken}` } }
            });
            expect((_a = result1 === null || result1 === void 0 ? void 0 : result1.data) === null || _a === void 0 ? void 0 : _a.getOrganizationMembers).toEqual({
                cursor: member5.id,
                data: [
                    {
                        admin: true,
                        id: member1.id,
                        organizationId: org.id,
                        status: "accepted",
                        user: {
                            accountCreated: testData_1.USER1.accountCreated,
                            email: testData_1.USER1.email,
                            firstName: testData_1.USER1.firstName,
                            id: memberUser1.id,
                            lastName: testData_1.USER1.lastName,
                            phoneNumber: testData_1.USER1.phoneNumber
                        },
                        userId: memberUser1.id
                    },
                    {
                        admin: false,
                        id: member2.id,
                        organizationId: org.id,
                        status: "accepted",
                        user: {
                            accountCreated: testData_1.USER2.accountCreated,
                            email: testData_1.USER2.email,
                            firstName: testData_1.USER2.firstName,
                            id: memberUser2.id,
                            lastName: testData_1.USER2.lastName,
                            phoneNumber: testData_1.USER2.phoneNumber
                        },
                        userId: memberUser2.id
                    },
                    {
                        admin: false,
                        id: member3.id,
                        organizationId: org.id,
                        status: "accepted",
                        user: {
                            accountCreated: testData_1.USER3.accountCreated,
                            email: testData_1.USER3.email,
                            firstName: testData_1.USER3.firstName,
                            id: memberUser3.id,
                            lastName: testData_1.USER3.lastName,
                            phoneNumber: testData_1.USER3.phoneNumber
                        },
                        userId: memberUser3.id
                    },
                    {
                        admin: false,
                        id: member4.id,
                        organizationId: org.id,
                        status: "accepted",
                        user: {
                            accountCreated: testData_1.USER4.accountCreated,
                            email: testData_1.USER4.email,
                            firstName: testData_1.USER4.firstName,
                            id: memberUser4.id,
                            lastName: testData_1.USER4.lastName,
                            phoneNumber: testData_1.USER4.phoneNumber
                        },
                        userId: memberUser4.id
                    },
                    {
                        admin: false,
                        id: member5.id,
                        organizationId: org.id,
                        status: "accepted",
                        user: {
                            accountCreated: testData_1.USER5.accountCreated,
                            email: testData_1.USER5.email,
                            firstName: testData_1.USER5.firstName,
                            id: memberUser5.id,
                            lastName: testData_1.USER5.lastName,
                            phoneNumber: testData_1.USER5.phoneNumber
                        },
                        userId: memberUser5.id
                    }
                ]
            });
            const result2 = await server_1.server.executeOperation({
                query: organizations_2.GET_ORGANIZATION_MEMBERS,
                variables: {
                    organizationId: org.id,
                    cursor: (_b = result1 === null || result1 === void 0 ? void 0 : result1.data) === null || _b === void 0 ? void 0 : _b.getOrganizationMembers.cursor
                }
            }, {
                req: { headers: { authorization: `Bearer ${adminUserToken}` } }
            });
            expect((_c = result2 === null || result2 === void 0 ? void 0 : result2.data) === null || _c === void 0 ? void 0 : _c.getOrganizationMembers).toEqual({
                cursor: member6.id,
                data: [
                    {
                        admin: false,
                        id: member6.id,
                        organizationId: org.id,
                        status: "accepted",
                        user: {
                            accountCreated: testData_1.USER6.accountCreated,
                            email: testData_1.USER6.email,
                            firstName: testData_1.USER6.firstName,
                            id: memberUser6.id,
                            lastName: testData_1.USER6.lastName,
                            phoneNumber: testData_1.USER6.phoneNumber
                        },
                        userId: memberUser6.id
                    }
                ]
            });
        });
    });
    describe("create org", () => {
        it("should create organization", async () => {
            const { user, token } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            await server_1.server.executeOperation({
                query: organizations_1.CREATE_ORG,
                variables: {
                    name: testData_1.ORG.name,
                    organizationNotificationSetting: testData_1.ORG_NOTIFICATION_SETTINGS
                }
            }, { req: { headers: { authorization: `Bearer ${token}` } } });
            const orgInDb = await prisma.organization.findFirst({
                where: {
                    name: testData_1.ORG.name
                },
                include: {
                    members: true,
                    notificationSetting: true
                }
            });
            expect(orgInDb).toEqual({
                id: expect.any(Number),
                name: testData_1.ORG.name,
                notificationSetting: Object.assign(Object.assign({}, testData_1.ORG_NOTIFICATION_SETTINGS), { id: expect.any(Number), organizationId: expect.any(Number) }),
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
            const { user, token } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const org = await (0, dbUtil_1.createOrg)({ db: prisma });
            await (0, dbUtil_1.createAdminOrgMember)({ db: prisma, user, org });
            await server_1.server.executeOperation({
                query: organizations_1.DELETE_ORG,
                variables: { organizationId: org.id }
            }, { req: { headers: { authorization: `Bearer ${token}` } } });
            const orgInDb = await prisma.organization.findUnique({
                where: {
                    id: org.id
                }
            });
            expect(orgInDb).toEqual(null);
        });
        it("should not delete org if user is not admin", async () => {
            var _a, _b, _c;
            const { user, token } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const org = await (0, dbUtil_1.createOrg)({ db: prisma });
            await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user, org });
            const result = await server_1.server.executeOperation({
                query: organizations_1.DELETE_ORG,
                variables: { organizationId: org.id }
            }, { req: { headers: { authorization: `Bearer ${token}` } } });
            expect((_a = result.errors) === null || _a === void 0 ? void 0 : _a.length).toEqual(1);
            expect((_c = (_b = result.errors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message).toEqual("Not Authorised!");
        });
    });
    describe("invite users", () => {
        it("should invite users to org if user is admin and send complete signup email if user is not signed up", async () => {
            const { user: adminUser, token: adminUserToken } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const users = [{ admin: false, email: testData_1.USER2.email }];
            const org = await (0, dbUtil_1.createOrg)({ db: prisma });
            await (0, dbUtil_1.createAdminOrgMember)({ db: prisma, user: adminUser, org });
            await server_1.server.executeOperation({
                query: organizations_1.INVITE_TO_ORG,
                variables: { organizationId: org.id, users }
            }, {
                req: { headers: { authorization: `Bearer ${adminUserToken}` } }
            });
            const invitedUser = await prisma.user.findUnique({
                where: {
                    email: testData_1.USER2.email
                }
            });
            const invitedOrgMember = await prisma.organizationMember.findUnique({
                where: {
                    userId_organizationId: {
                        userId: invitedUser.id,
                        organizationId: org.id
                    }
                }
            });
            const emails = await mailhog.getEmails();
            const email = emails[0];
            const recepients = mailhog.getRecepients(email);
            expect(mailhog.getSender(email)).toEqual(process.env.EMAIL);
            expect(recepients[0]).toEqual(testData_1.USER2.email);
            expect(recepients.length).toEqual(1);
            expect(email.Content.Headers.Subject[0]).toEqual("Complete Signup");
            expect(invitedUser).toEqual({
                id: expect.any(Number),
                email: testData_1.USER2.email,
                firstName: null,
                lastName: null,
                phoneNumber: null,
                passwordHash: null,
                accountCreated: false
            });
            expect(invitedOrgMember).toEqual({
                id: expect.any(Number),
                userId: invitedUser === null || invitedUser === void 0 ? void 0 : invitedUser.id,
                organizationId: org.id,
                status: "pending",
                admin: false
            });
        });
        // it("should invite users to org if user is admin and send email notification if user is signed up", async () => {})
        // it("should invite users to org and add to groups if groupIds are selected", async () => {});
        it("should not invite users to org if user is not admin", async () => {
            var _a, _b, _c;
            const { user: adminUser, token: adminUserToken } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const { user: invitedUser } = await (0, dbUtil_1.setupUser)(testData_1.USER2);
            const users = [{ admin: false, email: invitedUser.email }];
            const org = await (0, dbUtil_1.createOrg)({ db: prisma });
            await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user: adminUser, org });
            const result = await server_1.server.executeOperation({
                query: organizations_1.INVITE_TO_ORG,
                variables: { organizationId: org.id, users }
            }, {
                req: { headers: { authorization: `Bearer ${adminUserToken}` } }
            });
            const invitedOrgMember = await prisma.organizationMember.findUnique({
                where: {
                    userId_organizationId: {
                        userId: invitedUser.id,
                        organizationId: org.id
                    }
                }
            });
            expect((_a = result.errors) === null || _a === void 0 ? void 0 : _a.length).toEqual(1);
            expect((_c = (_b = result.errors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message).toEqual("Not Authorised!");
            expect(invitedOrgMember).toEqual(null);
        });
    });
    describe("remove users", () => {
        it("should remove users from org if user is admin", async () => {
            var _a;
            const { user: adminUser, token: adminUserToken } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const { user: memberUser } = await (0, dbUtil_1.setupUser)(testData_1.USER2);
            const org = await (0, dbUtil_1.createOrg)({ db: prisma });
            await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user: memberUser, org });
            await (0, dbUtil_1.createAdminOrgMember)({ db: prisma, user: adminUser, org });
            const result = await server_1.server.executeOperation({
                query: organizations_1.REMOVE_FROM_ORG,
                variables: { organizationId: org.id, userIds: [memberUser.id] }
            }, {
                req: { headers: { authorization: `Bearer ${adminUserToken}` } }
            });
            expect((_a = result.data) === null || _a === void 0 ? void 0 : _a.removeFromOrganization).toEqual([
                {
                    id: expect.any(Number),
                    organizationId: org.id,
                    user: {
                        email: testData_1.USER2.email,
                        firstName: testData_1.USER2.firstName,
                        lastName: testData_1.USER2.lastName,
                        id: expect.any(Number)
                    }
                }
            ]);
        });
        it("should not remove users from org if user is not admin", async () => {
            var _a, _b, _c;
            const { user: adminUser } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const { user: memberUser, token: memberUserToken } = await (0, dbUtil_1.setupUser)(testData_1.USER2);
            const org = await (0, dbUtil_1.createOrg)({ db: prisma });
            await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user: memberUser, org });
            await (0, dbUtil_1.createAdminOrgMember)({ db: prisma, user: adminUser, org });
            const result = await server_1.server.executeOperation({
                query: organizations_1.REMOVE_FROM_ORG,
                variables: { organizationId: org.id, userIds: [adminUser.id] }
            }, {
                req: { headers: { authorization: `Bearer ${memberUserToken}` } }
            });
            expect((_a = result.errors) === null || _a === void 0 ? void 0 : _a.length).toEqual(1);
            expect((_c = (_b = result.errors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message).toEqual("Not Authorised!");
        });
    });
    describe("update invite", () => {
        it("should update invite if the invite is for the user", async () => {
            const { user: adminUser } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const { user: invitedUser, token: invitedUserToken } = await (0, dbUtil_1.setupUser)(testData_1.USER2);
            const org = await (0, dbUtil_1.createOrg)({ db: prisma });
            await (0, dbUtil_1.createAdminOrgMember)({ db: prisma, user: adminUser, org });
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
            await server_1.server.executeOperation({
                query: organizations_1.UPDATE_ORG_INVITE,
                variables: { organizationId: org.id, status: "accepted" }
            }, {
                req: { headers: { authorization: `Bearer ${invitedUserToken}` } }
            });
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
            const { user: adminUser, token: adminUserToken } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const { user: user1 } = await (0, dbUtil_1.setupUser)(testData_1.USER2);
            const org = await (0, dbUtil_1.createOrg)({
                db: prisma,
                notificationSettings: {
                    pushEnabled: false,
                    emailEnabled: true,
                    smsEnabled: false
                }
            });
            await (0, dbUtil_1.createAdminOrgMember)({ db: prisma, user: adminUser, org });
            await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user: user1, org, status: "pending" });
            const mockAnnouncementTitle = "test title";
            const mockAnnouncementDescription = "test description";
            await server_1.server.executeOperation({
                query: organizations_1.CREATE_ORGANIZATION_ANNOUNCEMENT,
                variables: {
                    organizationId: org.id,
                    title: mockAnnouncementTitle,
                    description: mockAnnouncementDescription
                }
            }, {
                req: { headers: { authorization: `Bearer ${adminUserToken}` } }
            });
            const announcements = await prisma.announcement.findMany({
                where: {
                    organizationId: org.id
                }
            });
            const emails = await mailhog.getEmails();
            const email = emails[0];
            const recepients = mailhog.getRecepients(email);
            expect(mailhog.getSender(email)).toEqual(process.env.EMAIL);
            expect(recepients[0]).toEqual(testData_1.USER1.email);
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
            const { user: adminUser, token: adminUserToken } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const { user: user1 } = await (0, dbUtil_1.setupUser)(testData_1.USER2);
            const { user: user2 } = await (0, dbUtil_1.setupUser)(testData_1.USER3);
            const org = await (0, dbUtil_1.createOrg)({
                db: prisma,
                notificationSettings: {
                    pushEnabled: false,
                    emailEnabled: true,
                    smsEnabled: false
                }
            });
            await (0, dbUtil_1.createAdminOrgMember)({ db: prisma, user: adminUser, org });
            await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user: user1, org, status: "pending" });
            await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user: user2, org });
            const group = await (0, dbUtil_2.createGroup)({
                db: prisma,
                org
            });
            await (0, dbUtil_2.createNonAdminGroupMember)({ db: prisma, user: user1, org, group });
            const mockAnnouncementTitle = "test title";
            const mockAnnouncementDescription = "test description";
            await server_1.server.executeOperation({
                query: organizations_1.CREATE_ORGANIZATION_ANNOUNCEMENT,
                variables: {
                    organizationId: org.id,
                    title: mockAnnouncementTitle,
                    description: mockAnnouncementDescription,
                    groupIds: [group.id]
                }
            }, {
                req: { headers: { authorization: `Bearer ${adminUserToken}` } }
            });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3JnYW5pemF0aW9ucy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Rlc3RzL09yZ2FuaXphdGlvbnMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDJDQUE4QztBQUM5QywwQ0FNdUI7QUFDdkIsOENBU3lCO0FBQ3pCLHNDQUFtQztBQUNuQyw0REFPa0M7QUFDbEMsNkRBQXFDO0FBQ3JDLDREQUFvRTtBQUNwRSwwQ0FBdUU7QUFFdkUsTUFBTSxNQUFNLEdBQUcsSUFBSSxxQkFBWSxFQUFFLENBQUM7QUFDbEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7QUFFOUIsUUFBUSxDQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBRTtJQUNsQyxVQUFVLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDcEIsTUFBTSxJQUFBLGlCQUFRLEdBQUUsQ0FBQztRQUNqQixNQUFNLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUNsQyxDQUFDLENBQUMsQ0FBQztJQUVILHdDQUF3QztJQUN4Qyw4RkFBOEY7SUFDOUYsTUFBTTtJQUNOLGdEQUFnRDtJQUNoRCw4REFBOEQ7SUFDOUQsTUFBTTtJQUNOLHVDQUF1QztJQUN2Qyx1RUFBdUU7SUFDdkUsc0VBQXNFO0lBQ3RFLE1BQU07SUFDTix3Q0FBd0M7SUFDeEMsdUVBQXVFO0lBQ3ZFLE1BQU07SUFDTixRQUFRLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO1FBQ3hDLEVBQUUsQ0FBQyx1RkFBdUYsRUFBRSxLQUFLLElBQUksRUFBRTs7WUFDckcsTUFBTSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxHQUFHLE1BQU0sSUFBQSxrQkFBUyxFQUFDLGdCQUFLLENBQUMsQ0FBQztZQUM1RSxNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxHQUFHLE1BQU0sSUFBQSxrQkFBUyxFQUFDLGdCQUFLLENBQUMsQ0FBQztZQUNyRCxNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxHQUFHLE1BQU0sSUFBQSxrQkFBUyxFQUFDLGdCQUFLLENBQUMsQ0FBQztZQUNyRCxNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxHQUFHLE1BQU0sSUFBQSxrQkFBUyxFQUFDLGdCQUFLLENBQUMsQ0FBQztZQUNyRCxNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxHQUFHLE1BQU0sSUFBQSxrQkFBUyxFQUFDLGdCQUFLLENBQUMsQ0FBQztZQUNyRCxNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxHQUFHLE1BQU0sSUFBQSxrQkFBUyxFQUFDLGdCQUFLLENBQUMsQ0FBQztZQUNyRCxNQUFNLEdBQUcsR0FBRyxNQUFNLElBQUEsa0JBQVMsRUFBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBQzVDLE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBQSw2QkFBb0IsRUFBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ25GLE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBQSxnQ0FBdUIsRUFBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3RGLE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBQSxnQ0FBdUIsRUFBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3RGLE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBQSxnQ0FBdUIsRUFBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3RGLE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBQSxnQ0FBdUIsRUFBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFdB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