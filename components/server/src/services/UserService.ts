import { Prisma, User } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { Auth } from "../generated/graphql";
import { Context } from "../server";
import { exclude } from "../util/db";
import { RequestError } from "../util/errors";
import TokenService from "./TokenService";
const tokenService = new TokenService();

export const login = async (data: { email: string; password: string; context: Context }) => {
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
    throw new RequestError(`No user found with email: ${email}`);
  }
  if (!user.accountCreated) {
    throw new RequestError(`Account has not been setup, go to signup to complete`);
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new RequestError("Password is incorrect");
  }
  const userWithoutPassword = exclude<User, "passwordHash">(user, "passwordHash");
  return {
    token: tokenService.create(user),
    user: userWithoutPassword
  };
};

export const signup = async (data: {
  context: Context;
  email: string;
  password: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
}): Promise<Auth> => {
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
    throw new RequestError("An account with this email already exists");
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
    const userWithoutPassword = exclude<User, "passwordHash">(user, "passwordHash");
    return {
      token: tokenService.create(user),
      user: userWithoutPassword
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new RequestError("An account with this phone number already exists");
      }
    }
    throw error;
  }
};

export const deleteUser = async (data: { context: Context }) => {
  const { context } = data;
  const user = await context.db.user.delete({
    where: { email: context.user!.email.toLowerCase() }
  });
  const userWithoutPassword = exclude<User, "passwordHash">(user, "passwordHash");
  return user;
};

export const updateUser = async (data: {
  context: Context;
  phoneNumber?: string | null;
  password?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}) => {
  const { phoneNumber, password, firstName, lastName, context } = data;
  const accountCreated =
    (password || context.user!.passwordHash) && (phoneNumber || context.user!.phoneNumber)
      ? true
      : false;
  const updateParams: Partial<User> = {
    ...(phoneNumber && { phoneNumber }),
    ...(accountCreated && { accountCreated }),
    ...(firstName && { firstName: firstName.toLowerCase() }),
    ...(lastName && { lastName: lastName.toLowerCase() })
  };
  if (password) {
    const passwordHash = await bcrypt.hash(password, 10);
    updateParams.passwordHash = passwordHash;
  }
  try {
    const updatedUser = await context.db.user.update({
      where: {
        id: context.user!.id
      },
      data: updateParams
    });
    const userWithoutPassword = exclude<User, "passwordHash">(updatedUser, "passwordHash");
    return userWithoutPassword;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new RequestError("An account with this phone number already exists");
      }
    }
    throw error;
  }
};

export const resetPassword = async (data: { context: Context; email: string }) => {
  const { context, email } = data;
  const user = await context.db.user.findUnique({
    where: { email: email.toLowerCase() }
  });
  if (!user) {
    throw new RequestError(`No user found for email: ${email}`);
  }
  if (!user.accountCreated) {
    throw new RequestError(`Account has not been setup, go to signup to complete`);
  }
  const userWithoutPassword = exclude<User, "passwordHash">(user, "passwordHash");
  return user;
};

export const getJoinedEntities = async (data: { context: Context }) => {
  const { context } = data;

  const user = await context.db.user.findUnique({
    where: {
      id: context.user!.id
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
