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
exports.getJoinedEntities = exports.resetPassword = exports.updateUser = exports.deleteUser = exports.signup = exports.login = void 0;
const bcrypt = __importStar(require("bcryptjs"));
const db_1 = require("../util/db");
const TokenService_1 = __importDefault(require("./TokenService"));
const client_1 = require("@prisma/client");
const tokenService = new TokenService_1.default();
const login = async (data) => {
    const { password, email, db } = data;
    const user = await db.user.findUnique({
        where: { email },
        include: {
            organizations: true,
            groups: true
        }
    });
    if (!user) {
        throw new Error(`No user found with email: ${email}`);
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
        throw new Error("Invalid password");
    }
    const userWithoutPassword = (0, db_1.exclude)(user, "passwordHash");
    return {
        token: tokenService.create(user),
        user
    };
};
exports.login = login;
const signup = async (data) => {
    const { password, email, phoneNumber, firstName, lastName, db } = data;
    const passwordHash = await bcrypt.hash(password, 10);
    const existingUser = await db.user.findUnique({
        where: {
            email
        }
    });
    if (existingUser && existingUser.accountCreated) {
        throw new Error("An account with this email/phone number already exists");
    }
    let user;
    if (existingUser && !existingUser.accountCreated) {
        user = await db.user.update({
            where: { email },
            data: {
                phoneNumber,
                passwordHash,
                firstName,
                lastName,
                accountCreated: true
            },
            include: {
                organizations: true,
                groups: true
            }
        });
    }
    if (!existingUser) {
        user = await db.user.create({
            data: {
                email,
                phoneNumber,
                passwordHash,
                firstName,
                lastName,
                accountCreated: true
            },
            include: {
                organizations: true,
                groups: true
            }
        });
    }
    const userWithoutPassword = (0, db_1.exclude)(user, "passwordHash");
    return {
        token: tokenService.create(user),
        user
    };
};
exports.signup = signup;
const deleteUser = async (data) => {
    const { email, db } = data;
    try {
        const user = await db.user.delete({
            where: { email }
        });
        const userWithoutPassword = (0, db_1.exclude)(user, "passwordHash");
        return user;
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return null;
            }
        }
        throw error;
    }
};
exports.deleteUser = deleteUser;
const updateUser = async (data) => {
    const { user, phoneNumber, password, firstName, lastName, db } = data;
    const accountCreated = (password || user.passwordHash) && (phoneNumber || user.phoneNumber)
        ? true
        : false;
    const updateParams = Object.assign(Object.assign(Object.assign(Object.assign({}, (phoneNumber && { phoneNumber })), (accountCreated && { accountCreated })), (firstName && { firstName })), (lastName && { lastName }));
    if (password) {
        const passwordHash = await bcrypt.hash(password, 10);
        updateParams.passwordHash = passwordHash;
    }
    const updatedUser = await db.user.update({
        where: {
            id: user.id
        },
        data: updateParams
    });
    const userWithoutPassword = (0, db_1.exclude)(updatedUser, "passwordHash");
    return userWithoutPassword;
};
exports.updateUser = updateUser;
const resetPassword = async (data) => {
    const { db, email } = data;
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error(`No user found for email: ${email}`);
    }
    const userWithoutPassword = (0, db_1.exclude)(user, "passwordHash");
    // const emailService = new EmailService();
    // await emailService.sendPasswordReset(user);
    return user;
};
exports.resetPassword = resetPassword;
const getJoinedEntities = async (data) => {
    const { db, userId } = data;
    const user = await db.user.findUnique({
        where: {
            id: userId
        },
        include: {
            groups: {
                include: {
                    group: true
                }
            },
            organizations: {
                include: {
                    organization: true
                }
            }
        }
    });
    return user;
};
exports.getJoinedEntities = getJoinedEntities;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlclNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvVXNlclNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpREFBbUM7QUFDbkMsbUNBQXFDO0FBQ3JDLGtFQUEwQztBQUUxQywyQ0FBNEQ7QUFFNUQsTUFBTSxZQUFZLEdBQUcsSUFBSSxzQkFBWSxFQUFFLENBQUM7QUF5Q2pDLE1BQU0sS0FBSyxHQUFHLEtBQUssRUFBRSxJQUFnQixFQUFFLEVBQUU7SUFDOUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDO0lBQ3JDLE1BQU0sSUFBSSxHQUFHLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDcEMsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFO1FBQ2hCLE9BQU8sRUFBRTtZQUNQLGFBQWEsRUFBRSxJQUFJO1lBQ25CLE1BQU0sRUFBRSxJQUFJO1NBQ2I7S0FDRixDQUFDLENBQUM7SUFDSCxJQUFJLENBQUMsSUFBSSxFQUFFO1FBQ1QsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsS0FBSyxFQUFFLENBQUMsQ0FBQztLQUN2RDtJQUNELE1BQU0sS0FBSyxHQUFHLE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ2hFLElBQUksQ0FBQyxLQUFLLEVBQUU7UUFDVixNQUFNLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7S0FDckM7SUFDRCxNQUFNLG1CQUFtQixHQUFHLElBQUEsWUFBTyxFQUNqQyxJQUFJLEVBQ0osY0FBYyxDQUNmLENBQUM7SUFDRixPQUFPO1FBQ0wsS0FBSyxFQUFFLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hDLElBQUk7S0FDTCxDQUFDO0FBQ0os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