import { Context } from "../types";
declare const AuthResolver: {
    Query: {
        getJoinedEntities: (parent: any, args: any, context: Context, info: any) => Promise<(import(".prisma/client").User & {
            groups: (import(".prisma/client").GroupMember & {
                group: import(".prisma/client").Group;
            })[];
            organizations: (import(".prisma/client").OrganizationMember & {
                organization: import(".prisma/client").Organization;
            })[];
        }) | null>;
    };
    Mutation: {
        login: (parent: any, args: any, context: any) => Promise<{
            token: string;
            user: import(".prisma/client").User & {
                groups: import(".prisma/client").GroupMember[];
                organizations: import(".prisma/client").OrganizationMember[];
            };
        }>;
        resetPassword: (parent: any, args: any, context: any) => Promise<import(".prisma/client").User>;
        signup: (parent: any, args: any, context: any, info: any) => Promise<import("../types").Auth>;
        deleteUser: (parent: any, args: any, context: any, info: any) => Promise<import(".prisma/client").User | null>;
        updateUser: (parent: any, args: any, context: any, info: any) => Promise<Omit<import(".prisma/client").User, "passwordHash">>;
    };
};
export default AuthResolver;
