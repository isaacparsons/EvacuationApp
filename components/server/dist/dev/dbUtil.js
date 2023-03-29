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
exports.createNonAdminGroupMember = exports.createAdminGroupMember = exports.createGroup = exports.createNonAdminOrgMember = exports.createAdminOrgMember = exports.createOrg = exports.setupUser = exports.deleteDb = void 0;
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
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
const createOrg = async ({ db, notificationSettings }) => {
    return await db.organization.create({
        data: Object.assign(Object.assign({}, testData_1.ORG), { notificationSetting: {
                create: notificationSettings !== null && notificationSettings !== void 0 ? notificationSettings : testData_1.ORG_NOTIFICATION_SETTINGS
            } })
    });
};
exports.createOrg = createOrg;
const createAdminOrgMember = async ({ db, user, org, status }) => {
    return await db.organizationMember.create({
        data: {
            user: {
                connect: { id: user.id }
            },
            organization: {
                connect: { id: org.id }
            },
            status: status !== null && status !== void 0 ? status : "accepted",
            admin: true
        }
    });
};
exports.createAdminOrgMember = createAdminOrgMember;
const createNonAdminOrgMember = async ({ db, user, org, status }) => {
    return await db.organizationMember.create({
        data: {
            user: {
                connect: { id: user.id }
            },
            organization: {
                connect: { id: org.id }
            },
            status: status !== null && status !== void 0 ? status : "accepted",
            admin: false
        }
    });
};
exports.createNonAdminOrgMember = createNonAdminOrgMember;
const createGroup = async ({ db, org, groupName, notificationSettings }) => {
    return await db.group.create({
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
const createAdminGroupMember = async ({ db, user, org, group }) => {
    return await db.groupMember.create({
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
const createNonAdminGroupMember = async ({ db, user, org, group }) => {
    return await db.groupMember.create({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGJVdGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Rldi9kYlV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBOEM7QUFDOUMsaURBQW1DO0FBQ25DLDRFQUFvRDtBQVFwRCx5Q0FBK0Y7QUFFL0YsTUFBTSxNQUFNLEdBQUcsSUFBSSxxQkFBWSxFQUFFLENBQUM7QUFDbEMsTUFBTSxZQUFZLEdBQUcsSUFBSSxzQkFBWSxFQUFFLENBQUM7QUFFakMsTUFBTSxRQUFRLEdBQUcsS0FBSyxJQUFJLEVBQUU7SUFDakMsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNqQyxNQUFNLE1BQU0sQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3pDLE1BQU0sTUFBTSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMvQyxNQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2xDLE1BQU0sTUFBTSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDeEMsTUFBTSxNQUFNLENBQUMsd0JBQXdCLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3JELE1BQU0sTUFBTSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDNUMsTUFBTSxNQUFNLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2pELENBQUMsQ0FBQztBQVRXLFFBQUEsUUFBUSxZQVNuQjtBQUVLLE1BQU0sU0FBUyxHQUFHLEtBQUssRUFBRSxJQU8vQixFQUFFLEVBQUU7SUFDSCxNQUFNLElBQUksR0FBRyxNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFD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