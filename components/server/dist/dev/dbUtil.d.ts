import { PrismaClient } from "@prisma/client";
import { User, Group, Organization, GroupNotificationSettingInput, OrganizationNotificationSettingInput } from "../generated/graphql";
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
export declare const createOrg: ({ db, notificationSettings }: {
    db: PrismaClient;
    notificationSettings?: OrganizationNotificationSettingInput | undefined;
}) => Promise<import(".prisma/client").Organization>;
export declare const createAdminOrgMember: ({ db, user, org, status }: {
    db: PrismaClient;
    user: User;
    org: Organization;
    status?: string | undefined;
}) => Promise<import(".prisma/client").OrganizationMember>;
export declare const createNonAdminOrgMember: ({ db, user, org, status }: {
    db: PrismaClient;
    user: User;
    org: Organization;
    status?: string | undefined;
}) => Promise<import(".prisma/client").OrganizationMember>;
export declare const createGroup: ({ db, org, groupName, notificationSettings }: {
    db: PrismaClient;
    org: Organization;
    groupName?: string | undefined;
    notificationSettings?: GroupNotificationSettingInput | undefined;
}) => Promise<import(".prisma/client").Group & {
    notificationSetting: import(".prisma/client").GroupNotificationSetting | null;
}>;
export declare const createAdminGroupMember: ({ db, user, org, group }: {
    db: PrismaClient;
    user: User;
    org: Organization;
    group: Group;
}) => Promise<import(".prisma/client").GroupMember>;
export declare const createNonAdminGroupMember: ({ db, user, org, group }: {
    db: PrismaClient;
    user: User;
    org: Organization;
    group: Group;
}) => Promise<import(".prisma/client").GroupMember>;
