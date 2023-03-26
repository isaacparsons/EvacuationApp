import { Resolvers } from "../generated/graphql";
import { EmailNotification } from "../services/NotificationService";
import EmailService from "../services/EmailService";
import { sendNotifications } from "../services/NotificationService";
import UserRepository from "../db/user";
import * as bcrypt from "bcryptjs";

import { exclude } from "../util/db";
import { User, Prisma } from "@prisma/client";
import TokenService from "../services/TokenService";

const tokenService = new TokenService();
const emailService = new EmailService();

const AuthResolver: Resolvers = {
  Query: {
    getJoinedEntities: async (parent, args, context) => {
      const userRepository = new UserRepository(context.db);
      const entities = await userRepository.getJoinedEntities({
        userId: context.user!.id
      });
      return entities;
    }
  },
  Mutation: {
    login: async (parent, args, context) => {
      const { password, email } = args;
      const userRepository = new UserRepository(context.db);
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
      const userWithoutPassword = exclude<User, "passwordHash">(user, "passwordHash");
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
      const userRepository = new UserRepository(context.db);
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
      const userRepository = new UserRepository(context.db);
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
      const notification = new EmailNotification(
        emailService,
        [user.email],
        message,
        subject,
        resetLink
      );
      await sendNotifications({
        context,
        notifications: [notification]
      });
      return email;
    },
    signup: async (parent, args, context) => {
      const { password, email, phoneNumber, firstName, lastName } = args;
      const userRepository = new UserRepository(context.db);
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
      const userWithoutPassword = exclude<User, "passwordHash">(user, "passwordHash");
      const token = tokenService.createAccessToken(user.id);
      const refreshToken = tokenService.createRefreshToken(user.id);
      return {
        token,
        refreshToken,
        user: userWithoutPassword
      };
    },
    deleteUser: async (parent, args, context) => {
      const userRepository = new UserRepository(context.db);
      const user = await userRepository.deleteUser({
        email: context.user!.email
      });
      return user;
    },
    updateUser: async (parent, args, context) => {
      const { phoneNumber, password, firstName, lastName } = args;
      const userRepository = new UserRepository(context.db);
      const accountCreated =
        (password || context.user!.passwordHash) && (phoneNumber || context.user!.phoneNumber)
          ? true
          : false;
      const passwordHash = password ? await bcrypt.hash(password, 10) : null;

      try {
        const user = await userRepository.updateUser({
          email: context.user!.email,
          passwordHash,
          phoneNumber,
          firstName,
          lastName,
          accountCreated
        });
        const userWithoutPassword = exclude<User, "passwordHash">(user, "passwordHash");
        return userWithoutPassword;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new Error("An account with this phone number already exists");
          }
        }
        throw error;
      }
    }
  }
};

export default AuthResolver;
