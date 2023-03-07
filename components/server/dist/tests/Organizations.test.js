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
const prisma = new client_1.PrismaClient();
const mailhog = new Mailhog_1.default();
describe("organization tests", () => {
    beforeEach(async () => {
        await (0, dbUtil_1.deleteDb)();
        await mailhog.deleteAllEmails();
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
        it("should invite users to org if user is admin and send complete signup email", async () => {
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3JnYW5pemF0aW9ucy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Rlc3RzL09yZ2FuaXphdGlvbnMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDJDQUE4QztBQUM5QywwQ0FNdUI7QUFDdkIsOENBQStFO0FBQy9FLHNDQUFtQztBQUNuQyw0REFNa0M7QUFDbEMsNkRBQXFDO0FBRXJDLE1BQU0sTUFBTSxHQUFHLElBQUkscUJBQVksRUFBRSxDQUFDO0FBQ2xDLE1BQU0sT0FBTyxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO0FBRTlCLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUU7SUFDbEMsVUFBVSxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ3BCLE1BQU0sSUFBQSxpQkFBUSxHQUFFLENBQUM7UUFDakIsTUFBTSxPQUFPLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDbEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTtRQUMxQixFQUFFLENBQUMsNEJBQTRCLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDMUMsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxNQUFNLElBQUEsa0JBQVMsRUFBQyxnQkFBSyxDQUFDLENBQUM7WUFDL0MsTUFBTSxlQUFNLENBQUMsZ0JBQWdCLENBQzNCO2dCQUNFLEtBQUssRUFBRSwwQkFBVTtnQkFDakIsU0FBUyxFQUFFO29CQUNULElBQUksRUFBRSxjQUFHLENBQUMsSUFBSTtvQkFDZCwrQkFBK0IsRUFBRSxvQ0FBeUI7aUJBQzNEO2FBQ0YsRUFDRCxFQUFFLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLGFBQWEsRUFBRSxVQUFVLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBUyxDQUNsRSxDQUFDO1lBQ0YsTUFBTSxPQUFPLEdBQUcsTUFBTSxNQUFNLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQztnQkFDbEQsS0FBSyxFQUFFO29CQUNMLElBQUksRUFBRSxjQUFHLENBQUMsSUFBSTtpQkFDZjtnQkFDRCxPQUFPLEVBQUU7b0JBQ1AsT0FBTyxFQUFFLElBQUk7b0JBQ2IsbUJBQW1CLEVBQUUsSUFBSTtpQkFDMUI7YUFDRixDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUN0QixFQUFFLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7Z0JBQ3RCLElBQUksRUFBRSxjQUFHLENBQUMsSUFBSTtnQkFDZCxtQkFBbUIsa0NBQ2Qsb0NBQXlCLEtBQzVCLEVBQUUsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUN0QixjQUFjLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FDbkM7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQO3dCQUNFLEVBQUUsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQzt3QkFDdEIsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFO3dCQUNmLGNBQWMsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQzt3QkFDbEMsTUFBTSxFQUFFLFVBQVU7d0JBQ2xCLEtBQUssRUFBRSxJQUFJO3FCQUNaO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO1FBQzFCLEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRSxLQUFLLElBQUksRUFBRTtZQUNsRCxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLE1BQU0sSUFBQSxrQkFBUyxFQUFDLGdCQUFLLENBQUMsQ0FBQztZQUMvQyxNQUFNLEdBQUcsR0FBRyxNQUFNLElBQUEsa0JBQVMsRUFBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBQzVDLE1BQU0sSUFBQSw2QkFBb0IsRUFBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDdEQsTUFBTSxlQUFNLENBQUMsZ0JBQWdCLENBQzNCO2dCQUNFLEtBQUssRUFBRSwwQkFBVTtnQkFDakIsU0FBUyxFQUFFLEVBQUUsY0FBYyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUU7YUFDdEMsRUFDRCxFQUFFLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLGFBQWEsRUFBRSxVQUFVLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBUyxDQUNsRSxDQUFDO1lBQ0YsTUFBTSxPQUFPLEdBQUcsTUFBTSxNQUFNLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQztnQkFDbkQsS0FBSyxFQUFFO29CQUNMLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRTtpQkFDWDthQUNGLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFDLENBQUM7UUFDSCxFQUFFLENBQUMsNENBQTRDLEVBQUUsS0FBSyxJQUFJLEVBQUU7O1lBQzFELE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsTUFBTSxJQUFBLGtCQUFTLEVBQUMsZ0JBQUssQ0FBQyxDQUFDO1lBQy9DLE1BQU0sR0FBRyxHQUFHLE1BQU0sSUFBQSxrQkFBUyxFQUFDLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDNUMsTUFBTSxJQUFBLGdDQUF1QixFQUFDLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUV6RCxNQUFNLE1BQU0sR0FBRyxNQUFNLGVBQU0sQ0FBQyxnQkFBZ0IsQ0FDMUM7Z0JBQ0UsS0FBSyxFQUFFLDBCQUFVO2dCQUNqQixTQUFTLEVBQUUsRUFBRSxjQUFjLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRTthQUN0QyxFQUNELEVBQUUsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsYUFBYSxFQUFFLFVBQVUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFTLENBQ2xFLENBQUM7WUFFRixNQUFNLENBQUMsTUFBQSxNQUFNLENBQUMsTUFBTSwwQ0FBRSxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekMsTUFBTSxDQUFDLE1BQUEsTUFBQSxNQUFNLENBQUMsTUFBTSwwQ0FBRyxDQUFDLENBQUMsMENBQUUsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDakUsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFO1FBQzVCLEVBQUUsQ0FBQyw0RUFBNEUsRUFBRSxLQUFLLElBQUksRUFBRTtZQUMxRixNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFLEdBQUcsTUFBTSxJQUFBLGtCQUFTLEVBQUMsZ0JBQUssQ0FBQyxDQUFDO1lBRTFFLE1BQU0sS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxnQkFBSyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDckQsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFBLGtCQUFTLEVBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztZQUM1QyxNQUFNLElBQUEsNkJBQW9CLEVBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUVqRSxNQUFNLGVBQU0sQ0FBQyxnQkFBZ0IsQ0FDM0I7Z0JBQ0UsS0FBSyxFQUFFLDZCQUFhO2dCQUNwQixTQUFTLEVBQUUsRUFBRSxjQUFjLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUU7YUFDN0MsRUFDRDtnQkFDRSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxhQUFhLEVBQUUsVUFBVSxjQUFjLEVBQUUsRUFBRSxFQUFFO2FBQ3pELENBQ1QsQ0FBQztZQUNGLE1BQU0sV0FBVyxHQUFHLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7Z0JBQy9DLEtBQUssRUFBRTtvQkFDTCxLQUFLLEVBQUUsZ0JBQUssQ0FBQyxLQUFLO2lCQUNuQjthQUNGLENBQUMsQ0FBQztZQUNILE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxNQUFNLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDO2dCQUNsRSxLQUFLLEVBQUU7b0JBQ0wscUJBQXFCLEVBQUU7d0JBQ3JCLE1BQU0sRUFBRSxXQUFZLENBQUMsRUFBRTt3QkFDdkIsY0FBYyxFQUFFLEdBQUcsQ0FBQyxFQUFFO3FCQUN2QjtpQkFDRjthQUNGLENBQUMsQ0FBQztZQUNILE1BQU0sTUFBTSxHQUFHLE1BQU0sT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBRXpDLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QixNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2hELE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDNUQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnQkFBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzNDLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUNwRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUMxQixFQUFFLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7Z0JBQ3RCLEtBQUssRUFBRSxnQkFBSyxDQUFDLEtBQUs7Z0JBQ2xCLFNBQVMsRUFBRSxJQUFJO2dCQUNmLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFdBQVcsRUFBRSxJQUFJO2dCQUNqQixZQUFZLEVBQUUsSUFBSTtnQkFDbEIsY0FBYyxFQUFFLEtBQUs7YUFDdEIsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUMvQixFQUFFLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7Z0JBQ3RCLE1BQU0sRUFBRSxXQUFXLGFBQVgsV0FBVyx1QkFBWCxXQUFXLENBQUUsRUFBRTtnQkFDdkIsY0FBYyxFQUFFLEdBQUcsQ0FBQyxFQUFFO2dCQUN0QixNQUFNLEVBQUUsU0FBUztnQkFDakIsS0FBSyxFQUFFLEtBQUs7YUFDYixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILEVBQUUsQ0FBQyxxREFBcUQsRUFBRSxLQUFLLElBQUksRUFBRTs7WUFDbkUsTUFBTSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxHQUFHLE1BQU0sSUFBQSxrQkFBUyxFQUFDLGdCQUFLLENBQUMsQ0FBQztZQUMxRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxHQUFHLE1BQU0sSUFBQSxrQkFBUyxFQUFDLGdCQUFLLENBQUMsQ0FBQztZQUVyRCxNQUFNLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDM0QsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFBLGtCQUFTLEVBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztZQUM1QyxNQUFNLElBQUEsZ0NBQXVCLEVBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUVwRSxNQUFNLE1BQU0sR0FBRyxNQUFNLGVBQU0sQ0FBQyxnQkFBZ0IsQ0FDMUM7Z0JBQ0UsS0FBSyxFQUFFLDZCQUFhO2dCQUNwQixTQUFTLEVBQUUsRUFBRSxjQUFjLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUU7YUFDN0MsRUFDRDtnQkFDRSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxhQUFhLEVBQUUsVUFBVSxjQUFjLEVBQUUsRUFBRSxFQUFFO2FBQ3pELENBQ1QsQ0FBQztZQUNGLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxNQUFNLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDO2dCQUNsRSxLQUFLLEVBQUU7b0JBQ0wscUJBQXFCLEVBQUU7d0JBQ3JCLE1BQU0sRUFBRSxXQUFXLENBQUMsRUFBRTt3QkFDdEIsY0FBYyxFQUFFLEdBQUcsQ0FBQyxFQUFFO3FCQUN2QjtpQkFDRjthQUNGLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxNQUFBLE1BQU0sQ0FBQyxNQUFNLDBDQUFFLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QyxNQUFNLENBQUMsTUFBQSxNQUFBLE1BQU0sQ0FBQyxNQUFNLDBDQUFHLENBQUMsQ0FBQywwQ0FBRSxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUMvRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFO1FBQzVCLEVBQUUsQ0FBQywrQ0FBK0MsRUFBRSxLQUFLLElBQUksRUFBRTs7WUFDN0QsTUFBTSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxHQUFHLE1BQU0sSUFBQSxrQkFBUyxFQUFDLGdCQUFLLENBQUMsQ0FBQztZQUMxRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxHQUFHLE1BQU0sSUFBQSxrQkFBUyxFQUFDLGdCQUFLLENBQUMsQ0FBQztZQUVwRCxNQUFNLEdBQUcsR0FBRyxNQUFNLElBQUEsa0JBQVMsRUFBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBQzVDLE1BQU0sSUFBQSxnQ0FBdUIsRUFBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3JFLE1BQU0sSUFBQSw2QkFBb0IsRUFBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ2pFLE1BQU0sTUFBTSxHQUFHLE1BQU0sZUFBTSxDQUFDLGdCQUFnQixDQUMxQztnQkFDRSxLQUFLLEVBQUUsK0JBQWU7Z0JBQ3RCLFNBQVMsRUFBRSxFQUFFLGNBQWMsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTthQUNoRSxFQUNEO2dCQUNFLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLGFBQWEsRUFBRSxVQUFVLGNBQWMsRUFBRSxFQUFFLEVBQUU7YUFDekQsQ0FDVCxDQUFDO1lBRUYsTUFBTSxDQUFDLE1BQUEsTUFBTSxDQUFDLElBQUksMENBQUUsc0JBQXNCLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ2xEO29CQUNFLEVBQUUsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztvQkFDdEIsY0FBYyxFQUFFLEdBQUcsQ0FBQyxFQUFFO29CQUN0QixJQUFJLEVBQUU7d0JBQ0osS0FBSyxFQUFFLGdCQUFLLENBQUMsS0FBSzt3QkFDbEIsU0FBUyxFQUFFLGdCQUFLLENBQUMsU0FBUzt3QkFDMUIsUUFBUSxFQUFFLGdCQUFLLENBQUMsUUFBUTt3QkFDeEIsRUFBRSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO3FCQUN2QjtpQkFDRjthQUNGLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsRUFBRSxDQUFDLHVEQUF1RCxFQUFFLEtBQUssSUFBSSxFQUFFOztZQUNyRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxHQUFHLE1BQU0sSUFBQSxrQkFBUyxFQUFDLGdCQUFLLENBQUMsQ0FBQztZQUNuRCxNQUFNLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsZUFBZSxFQUFFLEdBQUcsTUFBTSxJQUFBLGtCQUFTLEVBQUMsZ0JBQUssQ0FBQyxDQUFDO1lBRTVFLE1BQU0sR0FBRyxHQUFHLE1BQU0sSUFBQSxrQkFBUyxFQUFDLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDNUMsTUFBTSxJQUFBLGdDQUF1QixFQUFDLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDckUsTUFBTSxJQUFBLDZCQUFvQixFQUFDLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFFakUsTUFBTSxNQUFNLEdBQUcsTUFBTSxlQUFNLENBQUMsZ0JBQWdCLENBQzFDO2dCQUNFLEtBQUssRUFBRSwrQkFBZTtnQkFDdEIsU0FBUyxFQUFFLEVBQUUsY0FBYyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFO2FBQy9ELEVBQ0Q7Z0JBQ0UsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsYUFBYSxFQUFFLFVBQVUsZUFBZSxFQUFFLEVBQUUsRUFBRTthQUMxRCxDQUNULENBQUM7WUFFRixNQUFNLENBQUMsTUFBQSxNQUFNLENBQUMsTUFBTSwwQ0FBRSxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekMsTUFBTSxDQUFDLE1BQUEsTUFBQSxNQUFNLENBQUMsTUFBTSwwQ0FBRyxDQUFDLENBQUMsMENBQUUsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDakUsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUNILFFBQVEsQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO1FBQzdCLEVBQUUsQ0FBQyxvREFBb0QsRUFBRSxLQUFLLElBQUksRUFBRTtZQUNsRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxHQUFHLE1BQU0sSUFBQSxrQkFBUyxFQUFDLGdCQUFLLENBQUMsQ0FBQztZQUNuRCxNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUsR0FBRyxNQUFNLElBQUEsa0JBQVMsRUFBQyxnQkFBSyxDQUFDLENBQUM7WUFDOUUsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFBLGtCQUFTLEVBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztZQUM1QyxNQUFNLElBQUEsNkJBQW9CLEVBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUNqRSxNQUFNLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUM7Z0JBQ3JDLElBQUksRUFBRTtvQkFDSixNQUFNLEVBQUUsU0FBUztvQkFDakIsS0FBSyxFQUFFLEtBQUs7b0JBQ1osSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRTs0QkFDUCxFQUFFLEVBQUUsV0FBVyxDQUFDLEVBQUU7eUJBQ25CO3FCQUNGO29CQUNELFlBQVksRUFBRTt3QkFDWixPQUFPLEVBQUU7NEJBQ1AsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFO3lCQUNYO3FCQUNGO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsTUFBTSxlQUFNLENBQUMsZ0JBQWdCLENBQzNCO2dCQUNFLEtBQUssRUFBRSxpQ0FBaUI7Z0JBQ3hCLFNBQVMsRUFBRSxFQUFFLGNBQWMsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUU7YUFDMUQsRUFDRDtnQkFDRSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxhQUFhLEVBQUUsVUFBVSxnQkFBZ0IsRUFBRSxFQUFFLEVBQUU7YUFDM0QsQ0FDVCxDQUFDO1lBQ0YsTUFBTSxTQUFTLEdBQUcsTUFBTSxNQUFNLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDO2dCQUMzRCxLQUFLLEVBQUU7b0JBQ0wscUJBQXFCLEVBQUU7d0JBQ3JCLE1BQU0sRUFBRSxXQUFXLENBQUMsRUFBRTt3QkFDdEIsY0FBYyxFQUFFLEdBQUcsQ0FBQyxFQUFFO3FCQUN2QjtpQkFDRjthQUNGLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3hCLEVBQUUsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztnQkFDdEIsTUFBTSxFQUFFLFdBQVcsQ0FBQyxFQUFFO2dCQUN0QixjQUFjLEVBQUUsR0FBRyxDQUFDLEVBQUU7Z0JBQ3RCLE1BQU0sRUFBRSxVQUFVO2dCQUNsQixLQUFLLEVBQUUsS0FBSzthQUNiLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9