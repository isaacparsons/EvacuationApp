import { User } from "@prisma/client";
import { Auth } from "../generated/graphql";
import { Context } from "../context";
export declare const login: (data: {
    email: string;
    password: string;
    context: Context;
}) => Promise<{
    token: string;
    user: Omit<User, "passwordHash">;
}>;
export declare const signup: (data: {
    context: Context;
    email: string;
    password: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
}) => Promise<Auth>;
export declare const deleteUser: (data: {
    context: Context;
}) => Promise<User>;
export declare const updateUser: (data: {
    context: Context;
    phoneNumber?: string | null;
    password?: string | null;
    firstName?: string | null;
    lastName?: string | null;
}) => Promise<Omit<User, "passwordHash">>;
export declare const resetPassword: (data: {
    context: Context;
    email: string;
}) => Promise<User>;
export declare const getJoinedEntities: (data: {
    context: Context;
}) => Promise<(User & {
    groups: (import(".prisma/client").GroupMember & {
        group: import(".prisma/client").Group;
    })[];
    organizations: (import(".prisma/client").OrganizationMember & {
        organization: import(".prisma/client").Organization;
    })[];
}) | null>;
