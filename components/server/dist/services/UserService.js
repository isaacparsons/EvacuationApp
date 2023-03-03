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
const errors_1 = require("../util/errors");
const TokenService_1 = __importDefault(require("./TokenService"));
const tokenService = new TokenService_1.default();
const login = async (data) => {
    const { password, email, context } = data;
    const emailLowercase = email.toLowerCase();
    const user = await context.db.user.findUnique({
        where: { email: emailLowercase },
        include: {
            organizations: true,
            groups: true
        }
    });
    if (!user) {
        throw new errors_1.RequestError(`No user found with email: ${email}`);
    }
    if (!user.accountCreated) {
        throw new errors_1.RequestError(`Account has not been setup, go to signup to complete`);
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
        throw new errors_1.RequestError("Password is incorrect");
    }
    const userWithoutPassword = (0, db_1.exclude)(user, "passwordHash");
    return {
        token: tokenService.create(user),
        user: userWithoutPassword
    };
};
exports.login = login;
const signup = async (data) => {
    const { password, email, phoneNumber, firstName, lastName, context } = data;
    const passwordHash = await bcrypt.hash(password, 10);
    const emailLowercase = email.toLowerCase();
    const firstNameLowerCase = firstName.toLowerCase();
    const lastNameLowerCase = lastName.toLowerCase();
    const existingUser = await context.db.user.findUnique({
        where: {
            email: emailLowercase
        }
    });
    if (existingUser && existingUser.accountCreated) {
        throw new errors_1.RequestError("An account with this email already exists");
    }
    try {
        let user;
        if (existingUser && !existingUser.accountCreated) {
            user = await context.db.user.update({
                where: { email: emailLowercase },
                data: {
                    phoneNumber,
                    passwordHash,
                    firstName: firstNameLowerCase,
                    lastName: lastNameLowerCase,
                    accountCreated: true
                }
            });
        }
        if (!existingUser) {
            user = await context.db.user.create({
                data: {
                    email: emailLowercase,
                    phoneNumber,
                    passwordHash,
                    firstName: firstNameLowerCase,
                    lastName: lastNameLowerCase,
                    accountCreated: true
                }
            });
        }
        const userWithoutPassword = (0, db_1.exclude)(user, "passwordHash");
        return {
            token: tokenService.create(user),
            user: userWithoutPassword
        };
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                throw new errors_1.RequestError("An account with this phone number already exists");
            }
        }
        throw error;
    }
};
exports.signup = signup;
const deleteUser = async (data) => {
    const { context } = data;
    const user = await context.db.user.delete({
        where: { email: context.user.email.toLowerCase() }
    });
    const userWithoutPassword = (0, db_1.exclude)(user, "passwordHash");
    return user;
};
exports.deleteUser = deleteUser;
const updateUser = async (data) => {
    const { phoneNumber, password, firstName, lastName, context } = data;
    const accountCreated = (password || context.user.passwordHash) && (phoneNumber || context.user.phoneNumber)
        ? true
        : false;
    const updateParams = Object.assign(Object.assign(Object.assign(Object.assign({}, (phoneNumber && { phoneNumber })), (accountCreated && { accountCreated })), (firstName && { firstName: firstName.toLowerCase() })), (lastName && { lastName: lastName.toLowerCase() }));
    if (password) {
        const passwordHash = await bcrypt.hash(password, 10);
        updateParams.passwordHash = passwordHash;
    }
    try {
        const updatedUser = await context.db.user.update({
            where: {
                id: context.user.id
            },
            data: updateParams
        });
        const userWithoutPassword = (0, db_1.exclude)(updatedUser, "passwordHash");
        return userWithoutPassword;
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                throw new errors_1.RequestError("An account with this phone number already exists");
            }
        }
        throw error;
    }
};
exports.updateUser = updateUser;
const resetPassword = async (data) => {
    const { context, email } = data;
    const user = await context.db.user.findUnique({
        where: { email: email.toLowerCase() }
    });
    if (!user) {
        throw new errors_1.RequestError(`No user found for email: ${email}`);
    }
    if (!user.accountCreated) {
        throw new errors_1.RequestError(`Account has not been setup, go to signup to complete`);
    }
    const userWithoutPassword = (0, db_1.exclude)(user, "passwordHash");
    return user;
};
exports.resetPassword = resetPassword;
const getJoinedEntities = async (data) => {
    const { context } = data;
    const user = await context.db.user.findUnique({
        where: {
            id: context.user.id
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlclNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvVXNlclNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBOEM7QUFDOUMsaURBQW1DO0FBR25DLG1DQUFxQztBQUNyQywyQ0FBOEM7QUFDOUMsa0VBQTBDO0FBQzFDLE1BQU0sWUFBWSxHQUFHLElBQUksc0JBQVksRUFBRSxDQUFDO0FBRWpDLE1BQU0sS0FBSyxHQUFHLEtBQUssRUFBRSxJQUEyRCxFQUFFLEVBQUU7SUFDekYsTUFBTSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDO0lBQzFDLE1BQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUMzQyxNQUFNLElBQUksR0FBRyxNQUFNLE9BQU8sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUM1QyxLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFO1FBQ2hDLE9BQU8sRUFBRTtZQUNQLGFBQWEsRUFBRSxJQUFJO1lBQ25CLE1BQU0sRUFBRSxJQUFJO1NBQ2I7S0FDRixDQUFDLENBQUM7SUFDSCxJQUFJLENBQUMsSUFBSSxFQUFFO1FBQ1QsTUFBTSxJQUFJLHFCQUFZLENBQUMsNkJBQTZCLEtBQUssRUFBRSxDQUFDLENBQUM7S0FDOUQ7SUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRTtRQUN4QixNQUFNLElBQUkscUJBQVksQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO0tBQ2hGO0lBQ0QsTUFBTSxLQUFLLEdBQUcsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDaEUsSUFBSSxDQUFDLEtBQUssRUFBRTtRQUNWLE1BQU0sSUFBSSxxQkFBWSxDQUFDLHVC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