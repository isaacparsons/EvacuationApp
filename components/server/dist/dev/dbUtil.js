"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrg = exports.removeOrgMembers = exports.updateInvite = exports.inviteUsersToOrg = exports.createOrg = exports.setupUser = exports.deleteDb = exports.seedDb = void 0;
const bcrypt = __importStar(require("bcryptjs"));
const index_1 = require("../index");
const client_1 = require("@prisma/client");
const TokenService_1 = __importDefault(require("../services/TokenService"));
const apollo_server_1 = require("apollo-server");
const prisma = new client_1.PrismaClient();
const tokenService = new TokenService_1.default();
const seedDb = async () => {
    const orgName = "test-org-2";
    const { user: user1, token: token1 } = await (0, exports.setupUser)("test1@email.com", "4031234567");
    await (0, exports.createOrg)(orgName, token1);
};
exports.seedDb = seedDb;
const deleteDb = async () => {
    await prisma.user.deleteMany({});
    await prisma.organization.deleteMany({});
    await prisma.organizationMember.deleteMany({});
    await prisma.group.deleteMany({});
    await prisma.groupMember.deleteMany({});
    await prisma.groupNotificationSetting.deleteMany({});
    await prisma.evacuationEvent.deleteMany({});
    await prisma.evacuationResponse.deleteMany({});
};
exports.deleteDb = deleteDb;
const setupUser = async (email, phoneNumber) => {
    const hash = await bcrypt.hash("123", 10);
    const user = await prisma.user.create({
        data: {
            email,
            phoneNumber,
            passwordHash: hash,
            accountCreated: true
        }
    });
    const token = tokenService.create(user);
    return { user, token };
};
exports.setupUser = setupUser;
const createOrg = async (orgName, token) => {
    return await index_1.server.executeOperation({
        query: (0, apollo_server_1.gql) `
        mutation Mutation($name: String!) {
          createOrganization(name: $name) {
            id
            name
            members {
              id
              userId
              organizationId
              status
              admin
              user {
                id
                email
                phoneNumber
                passwordHash
                accountCreated
              }
            }
          }
        }
      `,
        variables: { name: orgName }
    }, { req: { headers: { authorization: `Bearer ${token}` } } });
};
exports.createOrg = createOrg;
const inviteUsersToOrg = async (organizationId, users, token) => {
    return await index_1.server.executeOperation({
        query: (0, apollo_server_1.gql) `
        mutation InviteToOrganization(
          $organizationId: Int!
          $users: [InvitedOrganizationUser]
        ) {
          inviteToOrganization(organizationId: $organizationId, users: $users) {
            id
            userId
            organizationId
          }
        }
      `,
        variables: { organizationId, users }
    }, { req: { headers: { authorization: `Bearer ${token}` } } });
};
exports.inviteUsersToOrg = inviteUsersToOrg;
const updateInvite = async (organizationId, status, token) => {
    return await index_1.server.executeOperation({
        query: (0, apollo_server_1.gql) `
        mutation UpdateOrgInvite($organizationId: Int!, $status: String!) {
          updateOrgInvite(organizationId: $organizationId, status: $status) {
            id
            userId
            organizationId
            status
            admin
          }
        }
      `,
        variables: { organizationId, status }
    }, { req: { headers: { authorization: `Bearer ${token}` } } });
};
exports.updateInvite = updateInvite;
const removeOrgMembers = async (organizationId, memberIds, token) => {
    return await index_1.server.executeOperation({
        query: (0, apollo_server_1.gql) `
        mutation RemoveFromOrganization(
          $organizationId: Int!
          $memberIds: [Int]
        ) {
          removeFromOrganization(
            organizationId: $organizationId
            memberIds: $memberIds
          ) {
            id
            organizationId
          }
        }
      `,
        variables: { organizationId, memberIds }
    }, { req: { headers: { authorization: `Bearer ${token}` } } });
};
exports.removeOrgMembers = removeOrgMembers;
const deleteOrg = async (organizationId, token) => {
    return await index_1.server.executeOperation({
        query: (0, apollo_server_1.gql) `
        mutation RemoveFromOrganization($organizationId: Int!) {
          deleteOrganization(organizationId: $organizationId) {
            id
            name
          }
        }
      `,
        variables: { organizationId }
    }, { req: { headers: { authorization: `Bearer ${token}` } } });
};
exports.deleteOrg = deleteOrg;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGJVdGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Rldi9kYlV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpREFBbUM7QUFDbkMsb0NBQWtDO0FBQ2xDLDJDQUE4QztBQUM5Qyw0RUFBb0Q7QUFDcEQsaURBQW9DO0FBR3BDLE1BQU0sTUFBTSxHQUFHLElBQUkscUJBQVksRUFBRSxDQUFDO0FBQ2xDLE1BQU0sWUFBWSxHQUFHLElBQUksc0JBQVksRUFBRSxDQUFDO0FBUWpDLE1BQU0sTUFBTSxHQUFHLEtBQUssSUFBSSxFQUFFO0lBQy9CLE1BQU0sT0FBTyxHQUFHLFlBQVksQ0FBQztJQUM3QixNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsTUFBTSxJQUFBLGlCQUFTLEVBQ3BELGlCQUFpQixFQUNqQixZQUFZLENBQ2IsQ0FBQztJQUVGLE1BQU0sSUFBQSxpQkFBUyxFQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNuQyxDQUFDLENBQUM7QUFSVyxRQUFBLE1BQU0sVUFRakI7QUFFSyxNQUFNLFFBQVEsR0FBRyxLQUFLLElBQUksRUFBRTtJQUNqQyxNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2pDLE1BQU0sTUFBTSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDekMsTUFBTSxNQUFNLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQy9DLE1BQU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDbEMsTUFBTSxNQUFNLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN4QyxNQUFNLE1BQU0sQ0FBQyx3QkFBd0IsQ0FB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