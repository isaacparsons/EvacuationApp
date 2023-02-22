import { Context } from "../server";
import { GroupNotificationSettingInput, AddGroupUser } from "../generated/graphql";
import { Group, GroupMember } from "@prisma/client";
export declare const getGroup: (data: {
    context: Context;
    groupId: number;
}) => Promise<Group & {
    members: (GroupMember & {
        user: import(".prisma/client").User;
    })[];
    evacuationEvents: (import(".prisma/client").EvacuationEvent & {
        responses: (import(".prisma/client").EvacuationResponse & {
            user: import(".prisma/client").User;
        })[];
    })[];
    notificationSetting: import(".prisma/client").GroupNotificationSetting | null;
}>;
export declare const getGroupForUser: (data: {
    context: Context;
    groupId: number;
}) => Promise<Group & {
    members: (GroupMember & {
        user: import(".prisma/client").User;
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
    members: GroupMember[];
    notificationSetting: import(".prisma/client").GroupNotificationSetting | null;
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
