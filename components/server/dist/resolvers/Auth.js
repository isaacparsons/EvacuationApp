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
const NotificationService_1 = require("../services/NotificationService");
const EmailService_1 = __importDefault(require("../services/EmailService"));
const NotificationService_2 = require("../services/NotificationService");
const user_1 = __importDefault(require("../db/user"));
const bcrypt = __importStar(require("bcryptjs"));
const db_1 = require("../util/db");
const client_1 = require("@prisma/client");
const TokenService_1 = __importDefault(require("../services/TokenService"));
const tokenService = new TokenService_1.default();
const emailService = new EmailService_1.default();
const AuthResolver = {
    Query: {
        getJoinedEntities: async (parent, args, context) => {
            const userRepository = new user_1.default(context.db);
            const entities = await userRepository.getJoinedEntities({
                userId: context.user.id
            });
            return entities;
        }
    },
    Mutation: {
        login: async (parent, args, context) => {
            const { password, email } = args;
            const userRepository = new user_1.default(context.db);
            const user = await userRepository.getUserByEmail({ email });
            if (!user) {
                throw new Error(`No user found with email: ${email}`);
            }
            if (!user.accountCreated) {
                throw new Error(`Account has not been setup, go to signup to complete`);
            }
            const valid = await bcrypt.compare(password, user.passwordHash);
            if (!valid) {
                throw new Error("Password is incorrect");
            }
            const userWithoutPassword = (0, db_1.exclude)(user, "passwordHash");
            const token = tokenService.createAccessToken(user.id);
            const refreshToken = tokenService.createRefreshToken(user.id);
            return {
                token,
                refreshToken,
                user: userWithoutPassword
            };
        },
        token: async (parent, args, context) => {
            const { refreshToken } = args;
            const userRepository = new user_1.default(context.db);
            const { userId } = tokenService.verifyRefreshToken(refreshToken);
            const user = await userRepository.getUserById({ id: userId });
            if (!user) {
                throw new Error(`User with id: ${userId} no longer exists`);
            }
            const token = tokenService.createAccessToken(userId);
            const newRefreshToken = tokenService.createRefreshToken(userId);
            return {
                token,
                refreshToken: newRefreshToken,
                user
            };
        },
        resetPassword: async (parent, args, context) => {
            const { email } = args;
            const userRepository = new user_1.default(context.db);
            const user = await userRepository.getUserByEmail({ email });
            if (!user) {
                throw new Error(`No user found for email: ${email}`);
            }
            if (!user.accountCreated) {
                throw new Error(`Account has not been setup, go to signup to complete`);
            }
            const token = tokenService.createAccessToken(user.id);
            const resetLink = `${process.env.CLIENT_URL}/changePassword?token=${token}`;
            const subject = "Reset Password";
            const message = `Visit the link below to reset your password: \n`;
            const notification = new NotificationService_1.EmailNotification(emailService, [user.email], message, subject, resetLink);
            await (0, NotificationService_2.sendNotifications)({
                context,
                notifications: [notification]
            });
            return email;
        },
        signup: async (parent, args, context) => {
            const { password, email, phoneNumber, firstName, lastName } = args;
            const userRepository = new user_1.default(context.db);
            const passwordHash = await bcrypt.hash(password, 10);
            const existingUser = await userRepository.getUserByEmail({ email });
            if (existingUser && existingUser.accountCreated) {
                throw new Error("An account with this email already exists");
            }
            let user;
            if (existingUser && !existingUser.accountCreated) {
                user = await userRepository.updateUser({
                    email,
                    phoneNumber,
                    firstName,
                    lastName,
                    passwordHash,
                    accountCreated: true
                });
            }
            if (!existingUser) {
                user = await userRepository.createUser({
                    email,
                    phoneNumber,
                    firstName,
                    lastName,
                    passwordHash
                });
            }
            const userWithoutPassword = (0, db_1.exclude)(user, "passwordHash");
            const token = tokenService.createAccessToken(user.id);
            const refreshToken = tokenService.createRefreshToken(user.id);
            return {
                token,
                refreshToken,
                user: userWithoutPassword
            };
        },
        deleteUser: async (parent, args, context) => {
            const userRepository = new user_1.default(context.db);
            const user = await userRepository.deleteUser({
                email: context.user.email
            });
            return user;
        },
        updateUser: async (parent, args, context) => {
            const { phoneNumber, password, firstName, lastName } = args;
            const userRepository = new user_1.default(context.db);
            const accountCreated = (password || context.user.passwordHash) && (phoneNumber || context.user.phoneNumber)
                ? true
                : false;
            const passwordHash = password ? await bcrypt.hash(password, 10) : null;
            try {
                const user = await userRepository.updateUser({
                    email: context.user.email,
                    passwordHash,
                    phoneNumber,
                    firstName,
                    lastName,
                    accountCreated
                });
                const userWithoutPassword = (0, db_1.exclude)(user, "passwordHash");
                return userWithoutPassword;
            }
            catch (error) {
                if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                    if (error.code === "P2002") {
                        throw new Error("An account with this phone number already exists");
                    }
                }
                throw error;
            }
        }
    }
};
exports.default = AuthResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXV0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXNvbHZlcnMvQXV0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EseUVBQW9FO0FBQ3BFLDRFQUFvRDtBQUNwRCx5RUFBb0U7QUFDcEUsc0RBQXdDO0FBQ3hDLGlEQUFtQztBQUVuQyxtQ0FBcUM7QUFDckMsMkNBQThDO0FBQzlDLDRFQUFvRDtBQUVwRCxNQUFNLFlBQVksR0FBRyxJQUFJLHNCQUFZLEVBQUUsQ0FBQztBQUN4QyxNQUFNLFlBQVksR0FBRyxJQUFJLHNCQUFZLEVBQUUsQ0FBQztBQUV4QyxNQUFNLFlBQVksR0FBYztJQUM5QixLQUFLLEVBQUU7UUFDTCxpQkFBaUIsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsRUFBRTtZQUNqRCxNQUFNLGNBQWMsR0FBRyxJQUFJLGNBQWMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDdEQsTUFBTSxRQUFRLEdBQUcsTUFBTSxjQUFjLENBQUMsaUJBQWlCLENBQUM7Z0JBQ3RELE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSyxDQUFDLEVBQUU7YUFDekIsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxRQUFRLENBQUM7UUFDbEIsQ0FBQztLQUNGO0lBQ0QsUUFBUSxFQUFFO1FBQ1IsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFO1lBQ3JDLE1BQU0sRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLEdBQUcsSUFBSSxDQUFDO1lBQ2pDLE1BQU0sY0FBYyxHQUFHLElBQUksY0FBYyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN0RCxNQUFNLElBQUksR0FBRyxNQUFNLGNBQWMsQ0FBQyxjQUFjLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQzVELElBQUksQ0FB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