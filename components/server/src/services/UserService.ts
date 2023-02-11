import { Prisma, PrismaClient, User } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { Auth, UserWithoutPassword } from "../types";
import { exclude } from "../util/db";
import TokenService from "./TokenService";

const tokenService = new TokenService();

interface SignupInput {
  db: PrismaClient;
  email: string;
  password: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
}

interface LoginInput {
  db: PrismaClient;
  email: string;
  password: string;
}

interface DeleteUserInput {
  db: PrismaClient;
  email: string;
}

interface UpdateUserInput {
  db: PrismaClient;
  user: User;
  phoneNumber?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

interface ResetPasswordInput {
  db: PrismaClient;
  email: string;
}

interface GetJoinedEntitiesInput {
  db: PrismaClient;
  userId: number;
}

export const login = async (data: LoginInput) => {
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
  const userWithoutPassword = exclude<User, "passwordHash">(
    user,
    "passwordHash"
  );
  return {
    token: tokenService.create(user),
    user
  };
};

export const signup = async (data: SignupInput): Promise<Auth> => {
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

  try {
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
        }
      });
    }
    const userWithoutPassword = exclude<User, "passwordHash">(
      user,
      "passwordHash"
    );
    return {
      token: tokenService.create(user),
      user
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("An account with this phone number already exists");
      }
    }
    throw error;
  }
};

export const deleteUser = async (data: DeleteUserInput) => {
  const { email, db } = data;
  const user = await db.user.delete({
    where: { email: email.toLowerCase() }
  });
  const userWithoutPassword = exclude<User, "passwordHash">(
    user,
    "passwordHash"
  );
  return user;
};

export const updateUser = async (data: UpdateUserInput) => {
  const { user, phoneNumber, password, firstName, lastName, db } = data;
  const accountCreated =
    (password || user.passwordHash) && (phoneNumber || user.phoneNumber)
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
    const updatedUser = await db.user.update({
      where: {
        id: user.id
      },
      data: updateParams
    });
    const userWithoutPassword = exclude<User, "passwordHash">(
      updatedUser,
      "passwordHash"
    );
    return userWithoutPassword;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("An account with this phone number already exists");
      }
    }
    throw error;
  }
};

export const resetPassword = async (data: ResetPasswordInput) => {
  const { db, email } = data;
  const user = await db.user.findUnique({
    where: { email: email.toLowerCase() }
  });
  if (!user) {
    throw new Error(`No user found for email: ${email}`);
  }
  const userWithoutPassword = exclude<User, "passwordHash">(
    user,
    "passwordHash"
  );
  return user;
};

export const getJoinedEntities = async (data: GetJoinedEntitiesInput) => {
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
