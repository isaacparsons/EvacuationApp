import { User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import logger from "./config/logger";
import TokenService from "./services/TokenService";

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
    log: {
      error: () => {},
      info: () => {}
    }
  };
};

export const auth = async ({ req }) => {
  const log = logger("Kiwitinohk Communications App");
  const prisma: PrismaClient = new PrismaClient();
  const result: Context = { db: prisma, log };
  if (req?.headers?.authorization) {
    const token = req.headers.authorization.replace("Bearer ", "");
    const { userId } = tokenService.verify(token);
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error("User does not exist for the given access token");
    }
    result.log = logger("Kiwitinohk Communications App", { userId: user.id });
    result.user = user;
  }
  return result;
};
