import { Context } from "../types";
declare const OrganizationResolver: {
    Query: {
        getOrganizations: (parent: any, args: any, context: Context, info: any) => Promise<(import(".prisma/client").OrganizationMember & {
            organization: import(".prisma/client").Organization & {
                members: import(".prisma/client").OrganizationMember[];
            };
        })[]>;
        getOrganization: (parent: any, args: any, context: Context, info: any) => Promise<(import(".prisma/client").Organization & {
            groups: import(".prisma/client").Group[];
            members: (import(".prisma/client").OrganizationMember & {
                user: import(".prisma/client").User;
            })[];
            announcements: import(".prisma/client").Announcement[];
            notificationSetting: import(".prisma/client").OrganizationNotificationSetting | null;
        }) | null>;
        getOrganizationForUser: (parent: any, args: any, context: Context, info: any) => Promise<{
            groups: (import(".prisma/client").GroupMember & {
                group: import(".prisma/client").Group;
            })[];
            id?: number | undefined;
            name?: string | undefined;
            members?: (import(".prisma/client").OrganizationMember & {
                user: import(".prisma/client").User;
            })[] | undefined;
            announcements?: import(".prisma/client").Announcement[] | undefined;
            notificationSetting?: import(".prisma/client").OrganizationNotificationSetting | null | undefined;
        }>;
    };
    Mutation: {
        createOrganization: (parent: any, args: any, context: Context, info: any) => Promise<any>;
        deleteOrganization: (parent: any, args: any, context: Context, info: any) => Promise<any>;
        updateOrganizationNotificationOptions: (parent: any, args: any, context: Context, info: any) => Promise<any>;
        inviteToOrganization: (parent: any, args: any, context: Context, info: any) => Promise<any>;
        updateOrgInvite: (parent: any, args: any, context: Context, info: any) => Promise<any>;
        removeFromOrganization: (parent: any, args: any, context: any, info: any) => Promise<any>;
        createOrganizationAnnouncement: (parent: any, args: any, context: Context, info: any) => Promise<any>;
        deleteOrganizationAnnouncement: (parent: any, args: any, context: Context, info: any) => Promise<any>;
    };
};
export default OrganizationResolver;
