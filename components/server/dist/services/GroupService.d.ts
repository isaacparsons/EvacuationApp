import { Group, GroupMember } from "@prisma/client";
import { AddGroupUser, GroupNotificationSettingInput } from "../generated/graphql";
import { Context } from "../server";
export declare const getGroup: (data: {
    context: Context;
    groupId: number;
}) => Promise<Group & {
    notificationSetting: import(".prisma/client").GroupNotificationSetting | null;
    members: (GroupMember & {
        user: import(".prisma/client").User;
        organizationMember: import(".prisma/client").OrganizationMember;
    })[];
    evacuationEvents: (import(".prisma/client").EvacuationEvent & {
        responses: (import(".prisma/client").EvacuationResponse & {
            user: import(".prisma/client").User;
        })[];
    })[];
}>;
export declare const getGroupForUser: (data: {
    context: Context;
    groupId: number;
}) => Promise<Group & {
    members: (GroupMember & {
        user: import(".prisma/client").User;
        organizationMember: import(".prisma/client").OrganizationMember;
    })[];
    evacuationEvents: (import(".prisma/client").EvacuationEvent & {
        responses: (import(".prisma/client").EvacuationResponse & {
            user: import(".prisma/client").User;
        })[];
    })[];
}>;
export declare const getGroupMembers: (data: {
    context: Context;
    groupId: number;
    cursor?: number;
}) => Promise<{
    data: (GroupMember & {
        user: import(".prisma/client").User;
        organizationMember: import(".prisma/client").OrganizationMember;
    })[];
    cursor: number | undefined;
}>;
export declare const createGroup: (data: {
    context: Context;
    name: string;
    organizationId: number;
    groupNotificationSetting: GroupNotificationSettingInput;
}) => Promise<Group & {
    notificationSetting: import(".prisma/client").GroupNotificationSetting | null;
    members: GroupMember[];
}>;
export declare const deleteGroup: (data: {
    context: Context;
    groupId: number;
}) => Promise<Group>;
export declare const updateGroupNotificationOptions: (data: {
    context: Context;
    groupId: number;
    groupNotificationSetting: GroupNotificationSettingInput;
}) => Promise<import(".prisma/client").GroupNotificationSetting>;
export declare const addUsersToGroups: (data: {
    context: Context;
    organizationId: number;
    userIds: number[];
    groupIds: number[];
}) => Promise<void>;
export declare const addUsersToGroup: (data: {
    context: Context;
    groupId: number;
    users: AddGroupUser[];
}) => Promise<GroupMember[]>;
export declare const updateGroupMember: (data: {
    context: Context;
    groupId: number;
    userId: number;
    admin: boolean;
}) => Promise<GroupMember>;
export declare const removeMembers: (data: {
    context: Context;
    userIds: number[];
    groupId: number;
}) => Promise<{
    succeeded: GroupMember[];
    failed: number[];
}>;
