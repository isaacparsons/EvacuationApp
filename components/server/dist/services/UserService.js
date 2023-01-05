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
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const db_1 = require("../util/db");
const TokenService_1 = __importDefault(require("./TokenService"));
const tokenService = new TokenService_1.default();
const login = async (data) => {
    const { password, email, db } = data;
    const emailLowercase = email.toLowerCase();
    const user = await db.user.findUnique({
        where: { email: emailLowercase },
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
    const emailLowercase = email.toLowerCase();
    const firstNameLowerCase = firstName.toLowerCase();
    const lastNameLowerCase = lastName.toLowerCase();
    const existingUser = await db.user.findUnique({
        where: {
            email: emailLowercase
        }
    });
    if (existingUser && existingUser.accountCreated) {
        throw new Error("An account with this email/phone number already exists");
    }
    let user;
    if (existingUser && !existingUser.accountCreated) {
        user = await db.user.update({
            where: { email: emailLowercase },
            data: {
                phoneNumber,
                passwordHash,
                firstName: firstNameLowerCase,
                lastName: lastNameLowerCase,
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
                email: emailLowercase,
                phoneNumber,
                passwordHash,
                firstName: firstNameLowerCase,
                lastName: lastNameLowerCase,
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
            where: { email: email.toLowerCase() }
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
    const updateParams = Object.assign(Object.assign(Object.assign(Object.assign({}, (phoneNumber && { phoneNumber })), (accountCreated && { accountCreated })), (firstName && { firstName: firstName.toLowerCase() })), (lastName && { lastName: lastName.toLowerCase() }));
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
    const user = await db.user.findUnique({
        where: { email: email.toLowerCase() }
    });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlclNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvVXNlclNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBNEQ7QUFDNUQsaURBQW1DO0FBRW5DLG1DQUFxQztBQUNyQyxrRUFBMEM7QUFFMUMsTUFBTSxZQUFZLEdBQUcsSUFBSSxzQkFBWSxFQUFFLENBQUM7QUF5Q2pDLE1BQU0sS0FBSyxHQUFHLEtBQUssRUFBRSxJQUFnQixFQUFFLEVBQUU7SUFDOUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDO0lBQ3JDLE1BQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUMzQyxNQUFNLElBQUksR0FBRyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3BDLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUU7UUFDaEMsT0FBTyxFQUFFO1lBQ1AsYUFBYSxFQUFFLElBQUk7WUFDbkIsTUFBTSxFQUFFLElBQUk7U0FDYjtLQUNGLENBQUMsQ0FBQztJQUNILElBQUksQ0FBQyxJQUFJLEVBQUU7UUFDVCxNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixLQUFLLEVBQUUsQ0FBQyxDQUFDO0tBQ3ZEO0lBQ0QsTUFBTSxLQUFLLEdBQUcsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDaEUsSUFBSSxDQUFDLEtBQUssRUFBRTtRQUNWLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztLQUNyQztJQUNELE1BQU0sbUJBQW1CLEdBQUcsSUFBQSxZQUFPLEVBQ2pDLElBQUksRUFDSixjQUFjLENBQ2YsQ0FBQztJQUNGLE9BQU87UUFDTCxLQUFLLEVBQUUs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