import { makeExecutableSchema } from "@graphql-tools/schema";
import { readFileSync } from "fs";
import { ApolloServer } from "apollo-server";
import { User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { applyMiddleware } from "graphql-middleware";
import { resolvers } from "./graphql/resolver";
import { permissions } from "./permissions/index";
import { GraphQLErrorsHandler } from "./plugins/error";
import TokenService from "./services/TokenService";
import logger from "./config/logger";

const tokenService = new TokenService();

const typeDefs = readFileSync("src/graphql/schema.graphql", {
  encoding: "utf-8"
});

let schema = makeExecutableSchema({
  typeDefs,
  resolvers
});
schema = applyMiddleware(schema, permissions);

interface InitialContext {
  db: PrismaClient;
  user?: User;
  log?: any;
}

const auth = async ({ req }) => {
  const log = logger("Kiwitinohk Communications App");
  const prisma: PrismaClient = new PrismaClient();
  const result: InitialContext = { db: prisma, log };
  if (req.headers.authorization) {
    const token = req.headers.authorization.replace("Bearer ", "");
    const { userId } = tokenService.verify(token);
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (user) {
      result.log = logger("Kiwitinohk Communications App", { userId: user.id });
      result.user = user;
    }
  }
  return result;
};

export const server = new ApolloServer({
  schema,
  context: auth,
  plugins: [GraphQLErrorsHandler]
});
