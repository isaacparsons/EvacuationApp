"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const TokenService_1 = __importDefault(require("../services/TokenService"));
const dbUtil_1 = require("../dev/dbUtil");
const dbUtil_2 = require("../dev/dbUtil");
const prisma = new client_1.PrismaClient();
const tokenService = new TokenService_1.default();
describe("organization tests", () => {
    beforeEach(async () => {
        await prisma.user.deleteMany({});
        await prisma.organization.deleteMany({});
        await prisma.organizationMember.deleteMany({});
    });
    describe("create org", () => {
        it("should create organization", async () => {
            const { user, token } = await (0, dbUtil_2.setupUser)("test@email.com", "4031234567");
            const orgName = "test-org-1";
            const result = await (0, dbUtil_2.createOrg)(orgName, token);
            const organizations = await prisma.organizationMember.findMany({
                where: {
                    userId: user.id
                },
                include: {
                    organization: true
                }
            });
            expect(organizations.length).toEqual(1);
            expect(organizations[0].userId).toEqual(user.id);
            expect(organizations[0].admin).toEqual(true);
            expect(organizations[0].status).toEqual("accepted");
            expect(organizations[0].organization.name).toEqual(orgName);
        });
    });
    describe("invite to org", () => {
        it("should invite a user that doesnt exist to org and a user that does", async () => {
            var _a, _b;
            const orgName = "test-org-2";
            const { user: user1, token: token1 } = await (0, dbUtil_2.setupUser)("test1@email.com", "4031234567");
            const { user: user2, token: token2 } = await (0, dbUtil_2.setupUser)("test2@email.com", "4038910111");
            const notExistUserEmail = "test3@email.com";
            const org = await (0, dbUtil_2.createOrg)(orgName, token1);
            const orgId = (_b = (_a = org.data) === null || _a === void 0 ? void 0 : _a.createOrganization) === null || _b === void 0 ? void 0 : _b.id;
            const users = [
                {
                    admin: false,
                    email: user2.email,
                    inviteToGroups: []
                },
                {
                    admin: false,
                    email: notExistUserEmail,
                    inviteToGroups: []
                }
            ];
            const invitedUsers = await (0, dbUtil_2.inviteUsersToOrg)(orgId, users, token1);
            const _user3 = await prisma.user.findUnique({
                where: {
                    email: notExistUserEmail
                }
            });
            const orgMember2 = await prisma.organizationMember.findUnique({
                where: {
                    userId_organizationId: {
                        userId: user2.id,
                        organizationId: orgId
                    }
                }
            });
            const orgMember3 = await prisma.organizationMember.findUnique({
                where: {
                    userId_organizationId: {
                        userId: _user3 === null || _user3 === void 0 ? void 0 : _user3.id,
                        organizationId: orgId
                    }
                }
            });
            expect(_user3 === null || _user3 === void 0 ? void 0 : _user3.accountCreated).toEqual(false);
            expect(orgMember2 === null || orgMember2 === void 0 ? void 0 : orgMember2.admin).toEqual(false);
            expect(orgMember3 === null || orgMember3 === void 0 ? void 0 : orgMember3.admin).toEqual(false);
            expect(orgMember2 === null || orgMember2 === void 0 ? void 0 : orgMember2.organizationId).toEqual(orgId);
            expect(orgMember3 === null || orgMember3 === void 0 ? void 0 : orgMember3.organizationId).toEqual(orgId);
            expect(orgMember2 === null || orgMember2 === void 0 ? void 0 : orgMember2.status).toEqual("pending");
            expect(orgMember3 === null || orgMember3 === void 0 ? void 0 : orgMember3.status).toEqual("pending");
        });
        it("should return error when inviting because inviter is not admin", async () => {
            var _a, _b, _c;
            const orgName = "test-org-2";
            const { user: user1, token: token1 } = await (0, dbUtil_2.setupUser)("test1@email.com", "4031234567");
            const { user: user2, token: token2 } = await (0, dbUtil_2.setupUser)("test2@email.com", "4038910111");
            const { user: user3, token: token3 } = await (0, dbUtil_2.setupUser)("test3@email.com", "4032131415");
            const org = await (0, dbUtil_2.createOrg)(orgName, token1);
            const orgId = (_b = (_a = org.data) === null || _a === void 0 ? void 0 : _a.createOrganization) === null || _b === void 0 ? void 0 : _b.id;
            const users = [
                {
                    admin: false,
                    email: user2.email,
                    inviteToGroups: []
                }
            ];
            const invitedUsers = await (0, dbUtil_2.inviteUsersToOrg)(orgId, users, token3);
            expect((_c = invitedUsers === null || invitedUsers === void 0 ? void 0 : invitedUsers.errors) === null || _c === void 0 ? void 0 : _c.length).toEqual(1);
        });
    });
    describe("update invite", () => {
        it("should delete account if invite was declined", async () => {
            var _a, _b;
            const orgName = "test-org-2";
            const { user: user1, token: token1 } = await (0, dbUtil_2.setupUser)("test1@email.com", "4031234567");
            const { user: user2, token: token2 } = await (0, dbUtil_2.setupUser)("test2@email.com", "4038910111");
            const org = await (0, dbUtil_2.createOrg)(orgName, token1);
            const orgId = (_b = (_a = org.data) === null || _a === void 0 ? void 0 : _a.createOrganization) === null || _b === void 0 ? void 0 : _b.id;
            const users = [
                {
                    admin: false,
                    email: user2.email,
                    inviteToGroups: []
                }
            ];
            const invitedUsers = await (0, dbUtil_2.inviteUsersToOrg)(orgId, users, token1);
            await (0, dbUtil_1.updateInvite)(orgId, "declined", token2);
            const orgMember = await prisma.organizationMember.findUnique({
                where: {
                    userId_organizationId: {
                        userId: user2 === null || user2 === void 0 ? void 0 : user2.id,
                        organizationId: orgId
                    }
                }
            });
            expect(orgMember).toBeNull();
        });
        it("should update status if not declined", async () => {
            var _a, _b;
            const orgName = "test-org-2";
            const { user: user1, token: token1 } = await (0, dbUtil_2.setupUser)("test1@email.com", "4031234567");
            const { user: user2, token: token2 } = await (0, dbUtil_2.setupUser)("test2@email.com", "4038910111");
            const org = await (0, dbUtil_2.createOrg)(orgName, token1);
            const orgId = (_b = (_a = org.data) === null || _a === void 0 ? void 0 : _a.createOrganization) === null || _b === void 0 ? void 0 : _b.id;
            const users = [
                {
                    admin: false,
                    email: user2.email,
                    inviteToGroups: []
                }
            ];
            const invitedUsers = await (0, dbUtil_2.inviteUsersToOrg)(orgId, users, token1);
            await (0, dbUtil_1.updateInvite)(orgId, "accepted", token2);
            const orgMember = await prisma.organizationMember.findUnique({
                where: {
                    userId_organizationId: {
                        userId: user2 === null || user2 === void 0 ? void 0 : user2.id,
                        organizationId: orgId
                    }
                }
            });
            expect(orgMember === null || orgMember === void 0 ? void 0 : orgMember.status).toEqual("accepted");
        });
    });
    describe("remove from org", () => {
        it("should remove users from org", async () => {
            var _a, _b, _c;
            const orgName = "test-org-2";
            const { user: user1, token: token1 } = await (0, dbUtil_2.setupUser)("test1@email.com", "4031234567");
            const { user: user2, token: token2 } = await (0, dbUtil_2.setupUser)("test2@email.com", "4038910111");
            const org = await (0, dbUtil_2.createOrg)(orgName, token1);
            const orgId = (_b = (_a = org.data) === null || _a === void 0 ? void 0 : _a.createOrganization) === null || _b === void 0 ? void 0 : _b.id;
            const users = [
                {
                    admin: false,
                    email: user2.email,
                    inviteToGroups: []
                }
            ];
            const invitedUsers = await (0, dbUtil_2.inviteUsersToOrg)(orgId, users, token1);
            const members = ((_c = invitedUsers.data) === null || _c === void 0 ? void 0 : _c.inviteToOrganization)
                ? invitedUsers.data.inviteToOrganization.find((item) => item.userId === user2.id)
                : [];
            const removeMemberIds = [members.id];
            await (0, dbUtil_2.removeOrgMembers)(orgId, removeMemberIds, token1);
            const orgMembers = await prisma.organizationMember.findMany({
                where: {
                    organizationId: orgId
                }
            });
            expect(orgMembers.length).toEqual(1);
            expect(orgMembers[0].userId).toEqual(user1.id);
        });
        it("shouldnt remove users from org if not org admin", async () => {
            var _a, _b, _c, _d;
            const orgName = "test-org-2";
            const { user: user1, token: token1 } = await (0, dbUtil_2.setupUser)("test1@email.com", "4031234567");
            const { user: user2, token: token2 } = await (0, dbUtil_2.setupUser)("test2@email.com", "4038910111");
            const org = await (0, dbUtil_2.createOrg)(orgName, token1);
            const orgId = (_b = (_a = org.data) === null || _a === void 0 ? void 0 : _a.createOrganization) === null || _b === void 0 ? void 0 : _b.id;
            const users = [
                {
                    admin: false,
                    email: user2.email,
                    inviteToGroups: []
                }
            ];
            const invitedUsers = await (0, dbUtil_2.inviteUsersToOrg)(orgId, users, token1);
            const members = ((_c = invitedUsers.data) === null || _c === void 0 ? void 0 : _c.inviteToOrganization)
                ? invitedUsers.data.inviteToOrganization.find((item) => item.userId === user2.id)
                : [];
            const removeMemberIds = [members.id];
            const result = await (0, dbUtil_2.removeOrgMembers)(orgId, removeMemberIds, token2);
            expect((_d = result === null || result === void 0 ? void 0 : result.errors) === null || _d === void 0 ? void 0 : _d.length).toEqual(1);
        });
    });
    describe("delete org", () => {
        it("should delete org", async () => {
            var _a, _b;
            const orgName = "test-org-2";
            const { user: user1, token: token1 } = await (0, dbUtil_2.setupUser)("test1@email.com", "4031234567");
            const org = await (0, dbUtil_2.createOrg)(orgName, token1);
            const orgId = (_b = (_a = org.data) === null || _a === void 0 ? void 0 : _a.createOrganization) === null || _b === void 0 ? void 0 : _b.id;
            await (0, dbUtil_2.deleteOrg)(orgId, token1);
            const organization = await prisma.organization.findUnique({
                where: {
                    id: orgId
                }
            });
            expect(organization).toBeNull();
        });
        it("shouldnt delete org if not org admin", async () => {
            var _a, _b, _c;
            const orgName = "test-org-2";
            const { user: user1, token: token1 } = await (0, dbUtil_2.setupUser)("test1@email.com", "4031234567");
            const { user: user2, token: token2 } = await (0, dbUtil_2.setupUser)("test2@email.com", "4038910111");
            const org = await (0, dbUtil_2.createOrg)(orgName, token1);
            const orgId = (_b = (_a = org.data) === null || _a === void 0 ? void 0 : _a.createOrganization) === null || _b === void 0 ? void 0 : _b.id;
            const deletedOrg = await (0, dbUtil_2.deleteOrg)(orgId, token2);
            expect((_c = deletedOrg === null || deletedOrg === void 0 ? void 0 : deletedOrg.errors) === null || _c === void 0 ? void 0 : _c.length).toEqual(1);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3JnYW5pemF0aW9ucy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Rlc3RzL09yZ2FuaXphdGlvbnMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLDJDQUE4QztBQUM5Qyw0RUFBb0Q7QUFHcEQsMENBQTZDO0FBQzdDLDBDQU11QjtBQUV2QixNQUFNLE1BQU0sR0FBRyxJQUFJLHFCQUFZLEVBQUUsQ0FBQztBQUNsQyxNQUFNLFlBQVksR0FBRyxJQUFJLHNCQUFZLEVBQUUsQ0FBQztBQVF4QyxRQUFRLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxFQUFFO0lBQ2xDLFVBQVUsQ0FBQyxLQUFLLElBQUksRUFBRTtRQUNwQixNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sTUFBTSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDekMsTUFBTSxNQUFNLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2pELENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUU7UUFDMUIsRUFBRSxDQUFDLDRCQUE0QixFQUFFLEtBQUssSUFBSSxFQUFFO1lBQzFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsTUFBTSxJQUFBLGtCQUFTLEVBQUMsZ0JBQWdCLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDeEUsTUFBTSxPQUFPLEdBQUcsWUFBWSxDQUFDO1lBRTdCLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBQSxrQkFBUyxFQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztZQUUvQyxNQUFNLGFBQWEsR0FBRyxNQUFNLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUM7Z0JBQzdELEtBQUssRUFBRTtvQkFDTCxNQUFNLEVBQUUsSUFBSSxDQUFD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