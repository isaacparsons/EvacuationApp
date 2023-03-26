import { Prisma, PrismaClient, User } from "@prisma/client";

export default class UserRepository {
  db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  getUserByEmail = async (data: { email: string }) => {
    const { email } = data;
    const emailLowercase = email.toLowerCase();
    return await this.db.user.findUnique({
      where: { email: emailLowercase }
    });
  };
  getUserById = async (data: { id: number }) => {
    const { id } = data;
    return await this.db.user.findUnique({
      where: { id }
    });
  };

  createUser = async (data: {
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    passwordHash: string;
  }) => {
    const { email, phoneNumber, firstName, lastName, passwordHash } = data;
    const emailLowercase = email.toLowerCase();
    const firstNameLowerCase = firstName.toLowerCase();
    const lastNameLowerCase = lastName.toLowerCase();
    try {
      return await this.db.user.create({
        data: {
          email: emailLowercase,
          phoneNumber,
          passwordHash,
          firstName: firstNameLowerCase,
          lastName: lastNameLowerCase,
          accountCreated: true
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new Error("An account with this email/phone number already exists");
        }
      }
      throw error;
    }
  };

  updateUser = async (data: {
    email: string;
    phoneNumber?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    accountCreated?: boolean | null;
    passwordHash?: string | null;
  }) => {
    const { email, phoneNumber, firstName, lastName, passwordHash, accountCreated } = data;
    const emailLowercase = email.toLowerCase();
    const updateParams: Partial<User> = {
      ...(phoneNumber && { phoneNumber }),
      ...(accountCreated && { accountCreated }),
      ...(firstName && { firstName: firstName.toLowerCase() }),
      ...(lastName && { lastName: lastName.toLowerCase() }),
      ...(passwordHash && { passwordHash })
    };
    return await this.db.user.update({
      where: { email: emailLowercase },
      data: updateParams
    });
  };

  deleteUser = async (data: { email: string }) => {
    const { email } = data;
    const user = await this.db.user.delete({
      where: { email: email.toLowerCase() }
    });
    return user;
  };

  getJoinedEntities = async (data: { userId: number }) => {
    const { userId } = data;

    const user = await this.db.user.findUnique({
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
}
