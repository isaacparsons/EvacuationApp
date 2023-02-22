import { User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { ApolloServer } from "apollo-server";
export interface Context {
    db: PrismaClient;
    user?: User;
    log: any;
}
export declare const server: ApolloServer;
