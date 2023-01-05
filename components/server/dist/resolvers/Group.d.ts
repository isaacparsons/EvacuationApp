import { Group } from "@prisma/client";
import { Context, GroupNotificationSetting } from "../types";
declare const GroupResolver: {
    Query: {
        getGroup: (parent: any, args: any, context: Context, info: any) => Promise<(Group & {
            members: (import(".prisma/client").GroupMember & {
                user: import(".prisma/client").User;
            })[];
            evacuationEvents: (import(".prisma/client").EvacuationEvent & {
                responses: (import(".prisma/client").EvacuationResponse & {
                    user: import(".prisma/client").User;
                })[];
            })[];
            notificationSetting: import(".prisma/client").GroupNotificationSetting | null;
        }) | null>;
        getGroupForUser: (parent: any, args: any, context: Context, info: any) => Promise<(Group & {
            members: (import(".prisma/client").GroupMember & {
                user: import(".prisma/client").User;
            })[];
            evacuationEvents: (import(".prisma/client").EvacuationEvent & {
                responses: (import(".prisma/client").EvacuationResponse & {
                    user: import(".prisma/client").User;
                })[];
            })[];
        }) | null>;
    };
    Mutation: {
        createGroup: (parent: any, args: any, context: any, info: any) => Promise<Group>;
        deleteGroup: (parent: any, args: any, context: any, info: any) => Promise<Group>;
        updateGroupNotificationOptions: (parent: any, args: any, context: any, info: any) => Promise<GroupNotificationSetting>;
        inviteUsers: (parent: any, args: any, context: any, info: any) => Promise<import(".prisma/client").GroupMember[]>;
        removeMembers: (parent: any, args: any, context: any, info: any) => Promise<(import(".prisma/client").GroupMember | null | undefined)[]>;
        updateInvite: (parent: any, args: any, context: any, info: any) => Promise<import(".prisma/client").GroupMember>;
        updateGroupMember: (parent: any, args: any, context: any, info: any) => Promise<import(".prisma/client").GroupMember>;
    };
};
export default GroupResolver;
