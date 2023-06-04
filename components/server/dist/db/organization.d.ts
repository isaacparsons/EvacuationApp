import { PrismaClient } from "@prisma/client";
import { OrganizationNotificationSettingInput } from "../generated/graphql";
export default class OrganizationRepository {
    db: PrismaClient;
    constructor(db: PrismaClient);
    getOrganizationsForUser: (data: {
        userId: number;
    }) => Promise<(import(".prisma/client").OrganizationMember & {
        organization: import(".prisma/client").Organization & {
            members: import(".prisma/client").OrganizationMember[];
        };
    })[]>;
    getOrganization: (data: {
        organizationId: number;
    }) => Promise<(import(".prisma/client").Organization & {
        groups: import(".prisma/client").Group[];
        members: (import(".prisma/client").OrganizationMember & {
            user: import(".prisma/client").User;
        })[];
        announcements: import(".prisma/client").Announcement[];
        notificationSetting: import(".prisma/client").OrganizationNotificationSetting | null;
    }) | null>;
    getOrganizationById: (data: {
        organizationId: number;
    }) => Promise<import(".prisma/client").Organization | null>;
    getAnnouncementById: (data: {
        announcementId: number;
    }) => Promise<import(".prisma/client").Announcement | null>;
    getOrganizationMembers: (data: {
        organizationId: number;
        cursor?: number | null;
    }) => Promise<{
        data: (import(".prisma/client").OrganizationMember & {
            user: import(".prisma/client").User;
        })[];
        cursor: number | null | undefined;
    }>;
    getOrganizationMember: (data: {
        userId: number;
        organizationId: number;
    }) => Promise<import(".prisma/client").OrganizationMember | null>;
    getOrganizationMemberByEmail: (data: {
        email: string;
        organizationId: number;
    }) => Promise<(import(".prisma/client").OrganizationMember & {
        user: import(".prisma/client").User;
    }) | null>;
    getOrgWithAcceptedMembers: (data: {
        organizationId: number;
    }) => Promise<(import(".prisma/client").Organization & {
        members: (import(".prisma/client").OrganizationMember & {
            user: import(".prisma/client").User;
        })[];
        notificationSetting: import(".prisma/client").OrganizationNotificationSetting | null;
    }) | null>;
    getOrganizationForUser: (data: {
        organizationId: number;
        userId: number;
    }) => Promise<(import(".prisma/client").Organization & {
        members: (import(".prisma/client").OrganizationMember & {
            user: import(".prisma/client").User;
        })[];
        announcements: import(".prisma/client").Announcement[];
        notificationSetting: import(".prisma/client").OrganizationNotificationSetting | null;
    }) | null>;
    createOrganization: (data: {
        name: string;
        organizationNotificationSetting: OrganizationNotificationSettingInput;
        userId: number;
    }) => Promise<import(".prisma/client").Organization & {
        groups: import(".prisma/client").Group[];
        members: (import(".prisma/client").OrganizationMember & {
            user: import(".prisma/client").User;
        })[];
        notificationSetting: import(".prisma/client").OrganizationNotificationSetting | null;
    }>;
    deleteOrganization: (data: {
        organizationId: number;
    }) => Promise<import(".prisma/client").Organization>;
    updateOrganizationNotificationOptions: (data: {
        organizationId: number;
        organizationNotificationSetting: OrganizationNotificationSettingInput;
    }) => Promise<import(".prisma/client").OrganizationNotificationSetting>;
    createOrganizationMember: (data: {
        organizationId: number;
        admin: boolean;
        email: string;
    }) => Promise<import(".prisma/client").OrganizationMember & {
        user: import(".prisma/client").User;
    }>;
    updateOrgInvite: (data: {
        organizationId: number;
        status: string;
        userId: number;
    }) => Promise<import(".prisma/client").OrganizationMember | undefined>;
    removeFromOrganization: (data: {
        organizationId: number;
        userId: number;
    }) => Promise<import(".prisma/client").OrganizationMember & {
        user: import(".prisma/client").User;
    }>;
    createOrganizationAnnouncement: (data: {
        organizationId: number;
        userId: number;
        title: string;
        description?: string | null;
    }) => Promise<import(".prisma/client").Announcement>;
    deleteOrganizationAnnouncement: (data: {
        announcementId: number;
    }) => Promise<import(".prisma/client").Announcement>;
    getAnnouncements: (data: {
        organizationId: number;
        cursor?: number | null;
    }) => Promise<{
        data: import(".prisma/client").Announcement[];
        cursor: number | null | undefined;
    }>;
}
