import { PrismaClient } from "@prisma/client";
import { User, Group, Organization, GroupNotificationSettingInput } from "../generated/graphql";
interface InvitedOrganizationUser {
    admin: boolean;
    email: string;
}
export declare const deleteDb: () => Promise<void>;
export declare const setupUser: (data: {
    email: string;
    phoneNumber: string;
    password: string;
    accountCreated: boolean;
    firstName?: string;
    lastName?: string;
}) => Promise<{
    user: import(".prisma/client").User;
    token: string;
}>;
export declare const createOrg: (db: PrismaClient) => Promise<import(".prisma/client").Organization>;
export declare const createAdminOrgMember: (db: PrismaClient, user: User, org: Organization) => Promise<import(".prisma/client").OrganizationMember>;
export declare const createNonAdminOrgMember: (db: PrismaClient, user: User, org: Organization) => Promise<import(".prisma/client").OrganizationMember>;
export declare const createGroup: ({ db, org, groupName, notificationSettings }: {
    db: PrismaClient;
    org: Organization;
    groupName?: string | undefined;
    notificationSettings?: GroupNotificationSettingInput | undefined;
}) => Promise<import(".prisma/client").Group & {
    notificationSetting: import(".prisma/client").GroupNotificationSetting | null;
}>;
export declare const createAdminGroupMember: (db: PrismaClient, user: User, org: Organization, group: Group) => Promise<import(".prisma/client").GroupMember>;
export declare const createNonAdminGroupMember: (db: PrismaClient, user: User, org: Organization, group: Group) => Promise<import(".prisma/client").GroupMember>;
export declare const inviteUsersToOrg: (organizationId: number, users: InvitedOrganizationUser[], token: string) => Promise<void>;
export declare const updateInvite: (organizationId: number, status: string, token: string) => Promise<import("apollo-server-plugin-base").GraphQLResponse>;
export {};
