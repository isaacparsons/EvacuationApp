import { makeExecutableSchema } from "@graphql-tools/schema";
import { readFileSync } from "fs";

import { ApolloServer } from "apollo-server";

import { User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { applyMiddleware } from "graphql-middleware";
import { authDirectiveTransformer } from "./directives/auth";
import { requiredScopesDirectiveTransformer } from "./directives/requiredScopes";
import { resolvers } from "./graphql/resolver";
import { permissions } from "./permissions/index";
import { GraphQLErrorsHandler } from "./plugins/error";
import TokenService from "./services/TokenService";

const tokenService = new TokenService();

const typeDefs = readFileSync("src/graphql/schema.graphql", {
  encoding: "utf-8"
});

let schema = makeExecutableSchema({
  typeDefs,
  resolvers
});
schema = applyMiddleware(schema, permissions);
// schema = requiredScopesDirectiveTransformer(schema);
// schema = authDirectiveTransformer(schema);

interface InitialContext {
  db: PrismaClient;
  user?: User;
}

const auth = async ({ req }) => {
  const prisma: PrismaClient = new PrismaClient();
  const result: InitialContext = { db: prisma };
  if (req.headers.authorization) {
    const token = req.headers.authorization.replace("Bearer ", "");
    const { userId } = tokenService.verify(token);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        groups: {
          include: {
            group: true
          }
        },
        organizations: true
      }
    });
    if (user) {
      result.user = user;
    }
  }
  return result;
};

export const server = new ApolloServer({
  schema,
  context: auth,
  // cors: {
  //   origin: [
  //     'http://localhost.com:3000',
  //     'http://ec2-3-19-24-165.us-east-2.compute.amazonaws.com',
  //     'https://studio.apollographql.com'
  //   ]
  // },
  plugins: [GraphQLErrorsHandler]
});
