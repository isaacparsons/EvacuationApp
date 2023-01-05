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
exports.createGroup = exports.deleteOrg = exports.removeOrgMembers = exports.updateInvite = exports.inviteUsersToOrg = exports.createOrg = exports.setupUser = exports.deleteDb = void 0;
const client_1 = require("@prisma/client");
const apollo_server_1 = require("apollo-server");
const bcrypt = __importStar(require("bcryptjs"));
const server_1 = require("../server");
const TokenService_1 = __importDefault(require("../services/TokenService"));
const prisma = new client_1.PrismaClient();
const tokenService = new TokenService_1.default();
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
const setupUser = async (data) => {
    const hash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
        data: {
            email: data.email,
            phoneNumber: data.phoneNumber,
            accountCreated: data.accountCreated,
            firstName: data.firstName,
            lastName: data.lastName,
            passwordHash: hash
        }
    });
    const token = tokenService.create(user);
    return { user, token };
};
exports.setupUser = setupUser;
const createOrg = async (orgName, token) => { };
exports.createOrg = createOrg;
const inviteUsersToOrg = async (organizationId, users, token) => {
    return;
};
exports.inviteUsersToOrg = inviteUsersToOrg;
const updateInvite = async (organizationId, status, token) => {
    return server_1.server.executeOperation({
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
    return;
};
exports.removeOrgMembers = removeOrgMembers;
const deleteOrg = async (organizationId, token) => { };
exports.deleteOrg = deleteOrg;
const createGroup = async (variables, token) => {
    return;
};
exports.createGroup = createGroup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGJVdGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Rldi9kYlV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBOEM7QUFDOUMsaURBQW9DO0FBQ3BDLGlEQUFtQztBQUNuQyxzQ0FBbUM7QUFDbkMsNEVBQW9EO0FBR3BELE1BQU0sTUFBTSxHQUFHLElBQUkscUJBQVksRUFBRSxDQUFDO0FBQ2xDLE1BQU0sWUFBWSxHQUFHLElBQUksc0JBQVksRUFBRSxDQUFDO0FBT2pDLE1BQU0sUUFBUSxHQUFHLEtBQUssSUFBSSxFQUFFO0lBQ2pDLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDakMsTUFBTSxNQUFNLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN6QyxNQUFNLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDL0MsTUFBTSxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNsQyxNQUFNLE1BQU0sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3hDLE1BQU0sTUFBTSxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNyRCxNQUFNLE1BQU0sQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzVDLE1BQU0sTUFBTSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNqRCxDQUFDLENBQUM7QUFUVyxRQUFBLFFBQVEsWUFTbkI7QUFFSyxNQUFNLFNBQVMsR0FBRyxLQUFLLEVBQUUsSUFPL0IsRUFBRSxFQUFFO0lBQ0gsTUFBTSxJQUFJLEdBQUcsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDbEQsTUFBTSxJQUFJLEdBQUcsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUNwQyxJQUFJLEVBQUU7WUFDSixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDakIsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXO1lBQzdCLGNBQWMsRUFBRSxJQUFJLENBQUMsY0FBYztZQUNuQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7WUFDekIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO1lBQ3ZCLFlBQVksRUFBRSxJQUFJO1NBQ25CO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUV4QyxPQUFPLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDO0FBQ3pCLENBQUMsQ0FBQztBQXRCVyxRQUFBLFNBQVMsYUFzQnBCO0FBRUssTUFBTSxTQUFTLEdBQUcsS0FBSyxFQUFFLE9BQWUsRUFBRSxLQUFhLEVBQUUsRUFBRSxHQUFFLENBQUMsQ0FBQztBQUF6RCxRQUFBLFNBQVMsYUFBZ0Q7QUFFL0QsTUFBTSxnQkFBZ0IsR0FBRyxLQUFLLEVBQ25DLGNBQXNCLEVBQ3RCLEtBQWdDLEVBQ2hDLEtBQWEsRUFDYixFQUFFO0lBQ0YsT0FBTztBQUNULENBQUMsQ0FBQztBQU5XLFFBQUEsZ0JBQWdCLG9CQU0zQjtBQUVLLE1BQU0sWUFBWSxHQUFHLEtBQUssRUFDL0IsY0FBc0IsRUFDdEIsTUFBYyxFQUNkLEtBQWEsRUFDYixFQUFFO0lBQ0YsT0FBTyxlQUFNLENBQUMsZ0JBQWdCLENBQzVCO1FBQ0UsS0FBSyxFQUFFLElBQUEsbUJBQUcsRUFBQTs7Ozs7Ozs7OztPQVVUO1FBQ0QsU0FBUyxFQUFFLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRTtLQUN0QyxFQUNELEVBQUUsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsYUFBYSxFQUFFLFVBQVUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFTLENBQ2xFLENBQUM7QUFDSixDQUFDLENBQUM7QUF0QlcsUUFBQSxZQUFZLGdCQXNCdkI7QUFFSyxNQUFNLGdCQUFnQixHQUFHLEtBQUssRUFDbkMsY0FBc0IsRUFDdEIsU0FBbUIsRUFDbkIsS0FBYSxFQUNiLEVBQUU7SUFDRixPQUFPO0FBQ1QsQ0FBQyxDQUFDO0FBTlcsUUFBQSxnQkFBZ0Isb0JBTTNCO0FBRUssTUFBTSxTQUFTLEdBQUcsS0FBSyxFQUFFLGNBQXNCLEVBQUUsS0FBYSxFQUFFLEVBQUUsR0FBRSxDQUFDLENBQUM7QUFBaEUsUUFBQSxTQUFTLGFBQXVEO0FBRXRFLE1BQU0sV0FBVyxHQUFHLEtBQUssRUFBRSxTQUFjLEVBQUUsS0FBYSxFQUFFLEVBQUU7SUFDakUsT0FBTztBQUNULENBQUMsQ0FBQztBQUZXLFFBQUEsV0FBVyxlQUV0QiJ9