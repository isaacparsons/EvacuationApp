import { User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import logger, { mockLogger } from "./config/logger";
import TokenService from "./services/TokenService";
import { AuthenticationError, NotFoundError } from "./util/errors";

const tokenService = new TokenService();

export interface Context {
  db: PrismaClient;
  user?: User;
  log: any;
}

export type MockContext = {
  db: DeepMockProxy<PrismaClient>;
  log: any;
  user?: User;
};

export const createMockContext = (): MockContext => {
  return {
    db: mockDeep<PrismaClient>(),
    log: mockLogger
  };
};

export const auth = async ({ req }) => {
  let log = logger("Kiwitinohk Communications App");
  const prisma: PrismaClient = new PrismaClient();
  const result: Context = { db: prisma, log };
  if (req?.headers?.authorization) {
    const token = req.headers.authorization.replace("Bearer ", "");
    try {
      const { userId } = tokenService.verifyAccessToken(token);
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw NotFoundError("User does not exist");
      }
      log = logger("Kiwitinohk Communications App", { userId: user.id });
      result.user = user;
    } catch (error) {
      throw AuthenticationError("Invalid access token");
    }
    result.log = log;
  }
  return result;
};
