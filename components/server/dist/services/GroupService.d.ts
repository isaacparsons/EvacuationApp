import { Group, GroupMember, PrismaClient } from "@prisma/client";
import { InviteUser } from "../types";
interface GetGroupInput {
    db: PrismaClient;
    groupId: number;
}
interface GetGroupForUserInput {
    db: PrismaClient;
    groupId: number;
    userId: number;
}
interface GroupNotificationSettingInput {
    emailEnabled: boolean;
    pushEnabled: boolean;
    smsEnabled: boolean;
}
interface CreateGroupInput {
    db: PrismaClient;
    name: string;
    organizationId: number;
    userId: number;
    groupNotificationSetting: GroupNotificationSettingInput;
}
interface DeleteGroupInput {
    db: PrismaClient;
    groupId: number;
}
interface UpdateGroupNotificationSettingInput {
    db: PrismaClient;
    groupId: number;
    groupNotificationSetting: GroupNotificationSettingInput;
}
interface InvitedUsersInput {
    db: PrismaClient;
    groupId: number;
    userId: number;
    users: [InviteUser];
}
interface RemoveMembersInput {
    db: PrismaClient;
    memberIds: [number];
}
interface UpdateInviteInput {
    db: PrismaClient;
    groupId: number;
    userId: number;
    response: string;
}
interface UpdateGroupMemberInput {
    db: PrismaClient;
    groupId: number;
    userId: number;
    admin: boolean;
}
export declare const getGroup: (data: GetGroupInput) => Promise<(Group & {
    members: (GroupMember & {
        user: import(".prisma/client").User;
    })[];
    evacuationEvents: (import(".prisma/client").EvacuationEvent & {
        responses: (import(".prisma/client").EvacuationResponse & {
            user: import(".prisma/client").User;
        })[];
    })[];
    notificationSetting: import(".prisma/client").GroupNotificationSetting | null;
}) | null>;
export declare const getGroupForUser: (data: GetGroupForUserInput) => Promise<(Group & {
    members: (GroupMember & {
        user: import(".prisma/client").User;
    })[];
    evacuationEvents: (import(".prisma/client").EvacuationEvent & {
        responses: (import(".prisma/client").EvacuationResponse & {
            user: import(".prisma/client").User;
        })[];
    })[];
}) | null>;
export declare const createGroup: (data: CreateGroupInput) => Promise<Group>;
export declare const deleteGroup: (data: DeleteGroupInput) => Promise<Group>;
export declare const updateGroupNotificationOptions: (data: UpdateGroupNotificationSettingInput) => Promise<import(".prisma/client").GroupNotificationSetting>;
export declare const inviteUsers: (data: InvitedUsersInput) => Promise<GroupMember[]>;
export declare const updateInvite: (data: UpdateInviteInput) => Promise<GroupMember>;
export declare const updateGroupMember: (data: UpdateGroupMemberInput) => Promise<GroupMember>;
export declare const removeMembers: (data: RemoveMembersInput) => Promise<(GroupMember | null | undefined)[]>;
export {};
