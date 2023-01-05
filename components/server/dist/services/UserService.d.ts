import { PrismaClient, User } from "@prisma/client";
import { Auth } from "../types";
interface SignupInput {
    db: PrismaClient;
    email: string;
    password: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
}
interface LoginInput {
    db: PrismaClient;
    email: string;
    password: string;
}
interface DeleteUserInput {
    db: PrismaClient;
    email: string;
}
interface UpdateUserInput {
    db: PrismaClient;
    user: User;
    phoneNumber?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
}
interface ResetPasswordInput {
    db: PrismaClient;
    email: string;
}
interface GetJoinedEntitiesInput {
    db: PrismaClient;
    userId: number;
}
export declare const login: (data: LoginInput) => Promise<{
    token: string;
    user: User & {
        groups: import(".prisma/client").GroupMember[];
        organizations: import(".prisma/client").OrganizationMember[];
    };
}>;
export declare const signup: (data: SignupInput) => Promise<Auth>;
export declare const deleteUser: (data: DeleteUserInput) => Promise<User | null>;
export declare const updateUser: (data: UpdateUserInput) => Promise<Omit<User, "passwordHash">>;
export declare const resetPassword: (data: ResetPasswordInput) => Promise<User>;
export declare const getJoinedEntities: (data: GetJoinedEntitiesInput) => Promise<(User & {
    groups: (import(".prisma/client").GroupMember & {
        group: import(".prisma/client").Group;
    })[];
    organizations: (import(".prisma/client").OrganizationMember & {
        organization: import(".prisma/client").Organization;
    })[];
}) | null>;
export {};
