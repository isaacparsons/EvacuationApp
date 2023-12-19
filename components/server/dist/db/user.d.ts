import { PrismaClient, User } from "@prisma/client";
export default class UserRepository {
    db: PrismaClient;
    constructor(db: PrismaClient);
    getUserByEmail: (data: {
        email: string;
    }) => Promise<User | null>;
    getUserById: (data: {
        id: number;
    }) => Promise<User | null>;
    createUser: (data: {
        email: string;
        phoneNumber: string;
        firstName: string;
        lastName: string;
        passwordHash: string;
    }) => Promise<User>;
    updateUser: (data: {
        email: string;
        phoneNumber?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        accountCreated?: boolean | null;
        passwordHash?: string | null;
    }) => Promise<User>;
    deleteUser: (data: {
        email: string;
    }) => Promise<User>;
    getJoinedEntities: (data: {
        userId: number;
    }) => Promise<(User & {
        groups: (import(".prisma/client").GroupMember & {
            group: import(".prisma/client").Group;
        })[];
        organizations: (import(".prisma/client").OrganizationMember & {
            organization: import(".prisma/client").Organization;
        })[];
    }) | null>;
}
