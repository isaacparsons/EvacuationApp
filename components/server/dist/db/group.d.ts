import { Group, User, PrismaClient } from "@prisma/client";
import { GroupNotificationSettingInput } from "../generated/graphql";
export default class GroupRepository {
    db: PrismaClient;
    constructor(db: PrismaClient);
    getGroupById: (data: {
        groupId: number;
    }) => Promise<(Group & {
        members: (import(".prisma/client").GroupMember & {
            user: User;
            organizationMember: import(".prisma/client").OrganizationMember;
        })[];
        notificationSetting: import(".prisma/client").GroupNotificationSetting | null;
    }) | null>;
    getGroupForUser: (data: {
        userId: number;
        groupId: number;
    }) => Promise<(Group & {
        members: (import(".prisma/client").GroupMember & {
            user: User;
            organizationMember: import(".prisma/client").OrganizationMember;
        })[];
        evacuationEvents: (import(".prisma/client").EvacuationEvent & {
            responses: (import(".prisma/client").EvacuationResponse & {
                user: User;
            })[];
        })[];
    }) | null>;
    getGroupsForUserInOrganization: (data: {
        userId: number;
        organizationId: number;
    }) => Promise<(import(".prisma/client").GroupMember & {
        group: Group;
        organizationMember: import(".prisma/client").OrganizationMember;
    })[]>;
    getGroupMembers: (data: {
        groupId: number;
        cursor?: number | null;
    }) => Promise<{
        data: (import(".prisma/client").GroupMember & {
            user: User;
            organizationMember: import(".prisma/client").OrganizationMember;
        })[];
        cursor: number | null | undefined;
    }>;
    getGroupMember: (data: {
        userId: number;
        groupId: number;
    }) => Promise<import(".prisma/client").GroupMember | null>;
    getGroupWithAcceptedMembers: (data: {
        groupId: number;
    }) => Promise<(Group & {
        members: (import(".prisma/client").GroupMember & {
            user: User;
        })[];
        notificationSetting: import(".prisma/client").GroupNotificationSetting | null;
    }) | null>;
    getAcceptedUsersByGroupIds: (data: {
        groupIds: number[];
    }) => Promise<User[]>;
    createGroup: (data: {
        name: string;
        userId: number;
        organizationId: number;
        groupNotificationSetting: GroupNotificationSettingInput;
    }) => Promise<Group & {
        members: import(".prisma/client").GroupMember[];
        notificationSetting: import(".prisma/client").GroupNotificationSetting | null;
    }>;
    deleteGroup: (data: {
        groupId: number;
    }) => Promise<Group>;
    updateGroupNotificationOptions: (data: {
        groupId: number;
        groupNotificationSetting: GroupNotificationSettingInput;
    }) => Promise<import(".prisma/client").GroupNotificationSetting>;
    createGroupMember: (data: {
        userId: number;
        organizationId: number;
        groupId: number;
        admin: boolean;
    }) => Promise<import(".prisma/client").GroupMember>;
    updateGroupMember: (data: {
        groupId: number;
        userId: number;
        admin: boolean;
    }) => Promise<import(".prisma/client").GroupMember>;
    removeMember: (data: {
        userId: number;
        groupId: number;
    }) => Promise<import(".prisma/client").GroupMember>;
}
