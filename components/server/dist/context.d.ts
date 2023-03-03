import { User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { DeepMockProxy } from "jest-mock-extended";
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
export declare const createMockContext: () => MockContext;
export declare const auth: ({ req }: {
    req: any;
}) => Promise<Context>;
