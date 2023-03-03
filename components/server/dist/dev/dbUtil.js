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
exports.updateInvite = exports.inviteUsersToOrg = exports.createNonAdminGroupMember = exports.createAdminGroupMember = exports.createGroup = exports.createNonAdminOrgMember = exports.createAdminOrgMember = exports.createOrg = exports.setupUser = exports.deleteDb = void 0;
const client_1 = require("@prisma/client");
const apollo_server_1 = require("apollo-server");
const bcrypt = __importStar(require("bcryptjs"));
const server_1 = require("../server");
const TokenService_1 = __importDefault(require("../services/TokenService"));
const testData_1 = require("./testData");
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
const createOrg = async (db) => {
    return await prisma.organization.create({
        data: Object.assign(Object.assign({}, testData_1.ORG), { notificationSetting: {
                create: testData_1.ORG_NOTIFICATION_SETTINGS
            } })
    });
};
exports.createOrg = createOrg;
const createAdminOrgMember = async (db, user, org) => {
    return await prisma.organizationMember.create({
        data: {
            user: {
                connect: { id: user.id }
            },
            organization: {
                connect: { id: org.id }
            },
            status: "accepted",
            admin: true
        }
    });
};
exports.createAdminOrgMember = createAdminOrgMember;
const createNonAdminOrgMember = async (db, user, org) => {
    return await prisma.organizationMember.create({
        data: {
            user: {
                connect: { id: user.id }
            },
            organization: {
                connect: { id: org.id }
            },
            status: "accepted",
            admin: false
        }
    });
};
exports.createNonAdminOrgMember = createNonAdminOrgMember;
const createGroup = async ({ db, org, groupName, notificationSettings }) => {
    return await prisma.group.create({
        data: {
            name: groupName !== null && groupName !== void 0 ? groupName : testData_1.GROUP.name,
            organizationId: org.id,
            notificationSetting: {
                create: notificationSettings !== null && notificationSettings !== void 0 ? notificationSettings : testData_1.GROUP_NOTIFICATION_SETTING
            }
        },
        include: {
            notificationSetting: true
        }
    });
};
exports.createGroup = createGroup;
const createAdminGroupMember = async (db, user, org, group) => {
    return await prisma.groupMember.create({
        data: {
            group: {
                connect: {
                    id: group.id
                }
            },
            organizationMember: {
                connect: {
                    userId_organizationId: {
                        userId: user.id,
                        organizationId: org.id
                    }
                }
            },
            admin: true,
            user: {
                connect: { id: user.id }
            }
        }
    });
};
exports.createAdminGroupMember = createAdminGroupMember;
const createNonAdminGroupMember = async (db, user, org, group) => {
    return await prisma.groupMember.create({
        data: {
            group: {
                connect: {
                    id: group.id
                }
            },
            organizationMember: {
                connect: {
                    userId_organizationId: {
                        userId: user.id,
                        organizationId: org.id
                    }
                }
            },
            admin: false,
            user: {
                connect: { id: user.id }
            }
        }
    });
};
exports.createNonAdminGroupMember = createNonAdminGroupMember;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGJVdGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Rldi9kYlV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBOEM7QUFDOUMsaURBQW9DO0FBQ3BDLGlEQUFtQztBQUNuQyxzQ0FBbUM7QUFDbkMsNEVBQW9EO0FBUXBELHlDQUErRjtBQUUvRixNQUFNLE1BQU0sR0FBRyxJQUFJLHFCQUFZLEVBQUUsQ0FBQztBQUNsQyxNQUFNLFlBQVksR0FBRyxJQUFJLHNCQUFZLEVBQUUsQ0FBQztBQU9qQyxNQUFNLFFBQVEsR0FBRyxLQUFLLElBQUksRUFBRTtJQUNqQyxNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2pDLE1BQU0sTUFBTSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDekMsTUFBTSxNQUFNLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQy9DLE1BQU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDbEMsTUFBTSxNQUFNLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN4QyxNQUFNLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDckQsTUFBTSxNQUFNLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM1QyxNQUFNLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDakQsQ0FBQyxDQUFDO0FBVFcsUUFBQSxRQUFRLFlBU25CO0FBRUssTUFBTSxTQUFTLEdBQUcsS0FBSyxFQUFFLElBTy9CLEVBQUUsRUFBRTtJQUNILE1BQU0sSUFBSSxHQUFHLE1BQU0sTUFB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