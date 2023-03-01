"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const apollo_server_1 = require("apollo-server");
const dbUtil_1 = require("../dev/dbUtil");
const testData_1 = require("../dev/testData");
const server_1 = require("../server");
const organizations_1 = require("../dev/gql/organizations");
const Mailhog_1 = __importDefault(require("../dev/Mailhog"));
const prisma = new client_1.PrismaClient();
const mailhog = new Mailhog_1.default();
describe("organization tests", () => {
    beforeEach(async () => {
        await (0, dbUtil_1.deleteDb)();
        await mailhog.deleteAllEmails();
    });
    describe("create org", () => {
        it("should create organization", async () => {
            var _a;
            const { user, token } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const result = await server_1.server.executeOperation({
                query: (0, apollo_server_1.gql) `
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
                    name: testData_1.ORG.name,
                    organizationNotificationSetting: testData_1.ORG_NOTIFICATION_SETTINGS
                }
            }, { req: { headers: { authorization: `Bearer ${token}` } } });
            const org = (_a = result.data) === null || _a === void 0 ? void 0 : _a.createOrganization;
            expect(org).toEqual({
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
            const org = await prisma.organization.create({
                data: Object.assign(Object.assign({}, testData_1.ORG), { members: {
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
            mutation RemoveFromOrganization($organizationId: Int!) {
              deleteOrganization(organizationId: $organizationId) {
                id
                name
              }
            }
          `,
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
            const org = await prisma.organization.create({
                data: Object.assign(Object.assign({}, testData_1.ORG), { members: {
                        create: Object.assign({ user: {
                                connect: { id: user.id }
                            } }, testData_1.ORG_NON_ADMIN_MEMBER)
                    } }),
                include: {
                    members: true
                }
            });
            const result = await server_1.server.executeOperation({
                query: (0, apollo_server_1.gql) `
            mutation RemoveFromOrganization($organizationId: Int!) {
              deleteOrganization(organizationId: $organizationId) {
                id
                name
              }
            }
          `,
                variables: { organizationId: org.id }
            }, { req: { headers: { authorization: `Bearer ${token}` } } });
            expect((_a = result.errors) === null || _a === void 0 ? void 0 : _a.length).toEqual(1);
            expect((_c = (_b = result.errors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message).toEqual("Not Authorised!");
        });
    });
    describe("invite users", () => {
        it("should invite users to org if user is admin and send complete signup email", async () => {
            const { user: adminUser, token: adminUserToken } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const users = [{ admin: false, email: testData_1.USER2.email }];
            const org = await prisma.organization.create({
                data: Object.assign(Object.assign({}, testData_1.ORG), { members: {
                        create: Object.assign({ user: {
                                connect: { id: adminUser.id }
                            } }, testData_1.ORG_ADMIN_MEMBER)
                    } }),
                include: {
                    members: true
                }
            });
            const result = await server_1.server.executeOperation({
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
                        userId: invitedUser === null || invitedUser === void 0 ? void 0 : invitedUser.id,
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
        it("should not invite users to org if user is not admin", async () => {
            var _a, _b, _c;
            const { user: adminUser, token: adminUserToken } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const { user: invitedUser, token: invitedUserToken } = await (0, dbUtil_1.setupUser)(testData_1.USER2);
            const users = [{ admin: false, email: invitedUser.email }];
            const org = await prisma.organization.create({
                data: Object.assign(Object.assign({}, testData_1.ORG), { members: {
                        create: Object.assign({ user: {
                                connect: { id: adminUser.id }
                            } }, testData_1.ORG_NON_ADMIN_MEMBER)
                    } }),
                include: {
                    members: true
                }
            });
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
            const { user: memberUser, token: memberUserToken } = await (0, dbUtil_1.setupUser)(testData_1.USER2);
            const org = await prisma.organization.create({
                data: Object.assign(Object.assign({}, testData_1.ORG), { members: {
                        createMany: {
                            data: [
                                Object.assign({ userId: adminUser.id }, testData_1.ORG_ADMIN_MEMBER),
                                Object.assign({ userId: memberUser.id }, testData_1.ORG_NON_ADMIN_MEMBER)
                            ]
                        }
                    } }),
                include: {
                    members: {
                        include: {
                            user: true
                        }
                    }
                }
            });
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
            const { user: adminUser, token: adminUserToken } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const { user: memberUser, token: memberUserToken } = await (0, dbUtil_1.setupUser)(testData_1.USER2);
            const org = await prisma.organization.create({
                data: Object.assign(Object.assign({}, testData_1.ORG), { members: {
                        createMany: {
                            data: [
                                Object.assign({ userId: adminUser.id }, testData_1.ORG_ADMIN_MEMBER),
                                Object.assign({ userId: memberUser.id }, testData_1.ORG_NON_ADMIN_MEMBER)
                            ]
                        }
                    } }),
                include: {
                    members: {
                        include: {
                            user: true
                        }
                    }
                }
            });
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
            const { user: adminUser, token: adminUserToken } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const { user: invitedUser, token: invitedUserToken } = await (0, dbUtil_1.setupUser)(testData_1.USER2);
            const org = await prisma.organization.create({
                data: Object.assign(Object.assign({}, testData_1.ORG), { members: {
                        createMany: {
                            data: [
                                Object.assign({ userId: adminUser.id }, testData_1.ORG_ADMIN_MEMBER),
                                {
                                    userId: invitedUser.id,
                                    status: "pending",
                                    admin: false
                                }
                            ]
                        }
                    } }),
                include: {
                    members: true
                }
            });
            const result = await server_1.server.executeOperation({
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3JnYW5pemF0aW9ucy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Rlc3RzL09yZ2FuaXphdGlvbnMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDJDQUE4QztBQUM5QyxpREFBb0M7QUFDcEMsMENBQW9EO0FBQ3BELDhDQU95QjtBQUN6QixzQ0FBbUM7QUFDbkMsNERBQTZGO0FBQzdGLDZEQUFxQztBQUVyQyxNQUFNLE1BQU0sR0FBRyxJQUFJLHFCQUFZLEVBQUUsQ0FBQztBQUNsQyxNQUFNLE9BQU8sR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztBQUU5QixRQUFRLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxFQUFFO0lBQ2xDLFVBQVUsQ0FBQyxLQUFLLElBQUksRUFBRTtRQUNwQixNQUFNLElBQUEsaUJBQVEsR0FBRSxDQUFDO1FBQ2pCLE1BQU0sT0FBTyxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQ2xDLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUU7UUFDMUIsRUFBRSxDQUFDLDRCQUE0QixFQUFFLEtBQUssSUFBSSxFQUFFOztZQUMxQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLE1BQU0sSUFBQSxrQkFBUyxFQUFDLGdCQUFLLENBQUMsQ0FBQztZQUMvQyxNQUFNLE1BQU0sR0FBRyxNQUFNLGVBQU0sQ0FBQyxnQkFBZ0IsQ0FDMUM7Z0JBQ0UsS0FBSyxFQUFFLElBQUEsbUJBQUcsRUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1dBMkJUO2dCQUNELFNBQVMsRUFBRTtvQkFDVCxJQUFJLEVBQUUsY0FBRyxDQUFDLElBQUk7b0JBQ2QsK0JBQStCLEVBQUUsb0NBQXlCO2lCQUMzRDthQUNGLEVBQ0QsRUFBRSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxhQUFhLEVBQUUsVUFBVSxLQUFLLEVBQUUsRUFBRSxFQUFF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