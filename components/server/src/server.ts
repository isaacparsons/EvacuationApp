import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServer } from "apollo-server";
import { readFileSync } from "fs";
import { applyMiddleware } from "graphql-middleware";
import { resolvers } from "./graphql/resolver";
import { permissions } from "./permissions/index";
import { GraphQLErrorsHandler } from "./plugins/error";
import { Context, auth } from "./context";

const typeDefs = readFileSync("src/graphql/schema.graphql", {
  encoding: "utf-8"
});

let schema = makeExecutableSchema<Context>({
  typeDefs,
  resolvers
});
schema = applyMiddleware(schema, permissions);

export const server = new ApolloServer({
  schema,
  context: auth,
  plugins: [GraphQLErrorsHandler]
});
