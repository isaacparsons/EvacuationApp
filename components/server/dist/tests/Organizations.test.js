"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const apollo_server_1 = require("apollo-server");
const dbUtil_1 = require("../dev/dbUtil");
const testData_1 = require("../dev/testData");
const server_1 = require("../server");
const prisma = new client_1.PrismaClient();
describe("organization tests", () => {
    beforeEach(async () => {
        await (0, dbUtil_1.deleteDb)();
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
        it("should invite users to org if user is admin", async () => {
            const { user: adminUser, token: adminUserToken } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const { user: invitedUser, token: invitedUserToken } = await (0, dbUtil_1.setupUser)(testData_1.USER2);
            const users = [{ admin: false, email: invitedUser.email }];
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
                query: (0, apollo_server_1.gql) `
            mutation InviteToOrganization(
              $organizationId: Int!
              $users: [InvitedOrganizationUser]
            ) {
              inviteToOrganization(
                organizationId: $organizationId
                users: $users
              ) {
                id
                userId
                organizationId
              }
            }
          `,
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
            expect(invitedOrgMember).toEqual({
                id: expect.any(Number),
                userId: invitedUser.id,
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
                query: (0, apollo_server_1.gql) `
            mutation InviteToOrganization(
              $organizationId: Int!
              $users: [InvitedOrganizationUser]
            ) {
              inviteToOrganization(
                organizationId: $organizationId
                users: $users
              ) {
                id
                userId
                organizationId
              }
            }
          `,
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
                query: (0, apollo_server_1.gql) `
            mutation RemoveFromOrganization(
              $organizationId: Int!
              $userIds: [Int]
            ) {
              removeFromOrganization(
                organizationId: $organizationId
                userIds: $userIds
              ) {
                id
                organizationId
                user {
                  email
                  firstName
                  id
                  lastName
                }
              }
            }
          `,
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
                query: (0, apollo_server_1.gql) `
            mutation RemoveFromOrganization(
              $organizationId: Int!
              $userIds: [Int]
            ) {
              removeFromOrganization(
                organizationId: $organizationId
                userIds: $userIds
              ) {
                id
                organizationId
                user {
                  email
                  firstName
                  id
                  lastName
                }
              }
            }
          `,
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
                query: (0, apollo_server_1.gql) `
            mutation UpdateOrgInvite($organizationId: Int!, $status: String!) {
              updateOrgInvite(
                organizationId: $organizationId
                status: $status
              ) {
                id
                userId
                organizationId
                status
                admin
              }
            }
          `,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3JnYW5pemF0aW9ucy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Rlc3RzL09yZ2FuaXphdGlvbnMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJDQUE4QztBQUM5QyxpREFBb0M7QUFDcEMsMENBQW9EO0FBQ3BELDhDQU95QjtBQUN6QixzQ0FBbUM7QUFFbkMsTUFBTSxNQUFNLEdBQUcsSUFBSSxxQkFBWSxFQUFFLENBQUM7QUFFbEMsUUFBUSxDQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBRTtJQUNsQyxVQUFVLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDcEIsTUFBTSxJQUFBLGlCQUFRLEdBQUUsQ0FBQztJQUNuQixDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO1FBQzFCLEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSxLQUFLLElBQUksRUFBRTs7WUFDMUMsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxNQUFNLElBQUEsa0JBQVMsRUFBQyxnQkFBSyxDQUFDLENBQUM7WUFDL0MsTUFBTSxNQUFNLEdBQUcsTUFBTSxlQUFNLENBQUMsZ0JBQWdCLENBQzFDO2dCQUNFLEtBQUssRUFBRSxJQUFBLG1CQUFHLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztXQTJCVDtnQkFDRCxTQUFTLEVBQUU7b0JBQ1QsSUFBSSxFQUFFLGNBQUcsQ0FBQyxJQUFJO29CQUNkLCtCQUErQixFQUFFLG9DQUF5QjtpQkFDM0Q7YUFDRixFQUNELEVBQUUsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsYUFBYSxFQUFFLFVBQVUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFTLENBQ2xFLENBQUM7WUFDRixNQUFNLEdBQUcsR0FBRyxNQUFBLE1BQU0sQ0FBQyxJQUFJLDBDQUFFLGtCQUFrQixDQUFDO1lBQzVDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxP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