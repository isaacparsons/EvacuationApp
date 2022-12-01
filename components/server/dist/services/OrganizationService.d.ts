import { PrismaClient } from "@prisma/client";
import { InviteUser } from "src/types";
interface GetOrganizationsInput {
    db: PrismaClient;
    userId: number;
}
interface GetOrganizationInput {
    db: PrismaClient;
    organizationId: number;
}
interface GetOrganizationForUserInput {
    db: PrismaClient;
    organizationId: number;
    userId: number;
}
interface CreateOrganizationInput {
    db: PrismaClient;
    name: string;
    userId: number;
}
interface DeleteOrganizationInput {
    db: PrismaClient;
    organizationId: number;
}
interface InvitedOrganizationUser {
    admin: boolean;
    email: string;
    inviteToGroups: InviteUser[];
}
interface UpdateOrgInviteInput {
    db: PrismaClient;
    organizationId: number;
    userId: number;
    status: string;
}
interface InviteToOrganizationInput {
    db: PrismaClient;
    organizationId: number;
    users: InvitedOrganizationUser[];
}
interface RemoveFromOrganizationInput {
    db: PrismaClient;
    organizationId: number;
    userIds: number[];
}
interface CreateOrganizationAnnouncementInput {
    db: PrismaClient;
    userId: number;
    organizationId: number;
    title: string;
    description?: string;
}
interface DeleteOrganizationAnnouncementInput {
    db: PrismaClient;
    userId: number;
    announcementId: number;
}
export declare const getOrganizationsForUser: (data: GetOrganizationsInput) => Promise<(import(".prisma/client").OrganizationMember & {
    organization: import(".prisma/client").Organization;
})[]>;
export declare const getOrganization: (data: GetOrganizationInput) => Promise<(import(".prisma/client").Organization & {
    groups: import(".prisma/client").Group[];
    members: (import(".prisma/client").OrganizationMember & {
        user: import(".prisma/client").User;
    })[];
    announcements: import(".prisma/client").Announcement[];
}) | null>;
export declare const getOrganizationForUser: (data: GetOrganizationForUserInput) => Promise<{
    groups: (import(".prisma/client").GroupMember & {
        group: import(".prisma/client").Group;
    })[];
    id?: number | undefined;
    name?: string | undefined;
    members?: (import(".prisma/client").OrganizationMember & {
        user: import(".prisma/client").User;
    })[] | undefined;
    announcements?: import(".prisma/client").Announcement[] | undefined;
}>;
export declare const createOrganization: (data: CreateOrganizationInput) => Promise<import(".prisma/client").Organization & {
    groups: import(".prisma/client").Group[];
    members: (import(".prisma/client").OrganizationMember & {
        user: import(".prisma/client").User;
    })[];
}>;
export declare const deleteOrganization: (data: DeleteOrganizationInput) => Promise<import(".prisma/client").Organization>;
export declare const inviteToOrganization: (data: InviteToOrganizationInput) => Promise<(import(".prisma/client").OrganizationMember & {
    organization: import(".prisma/client").Organization;
    user: import(".prisma/client").User;
})[]>;
export declare const updateOrgInvite: (data: UpdateOrgInviteInput) => Promise<import(".prisma/client").OrganizationMember>;
export declare const removeFromOrganization: (data: RemoveFromOrganizationInput) => Promise<(import(".prisma/client").OrganizationMember | null | undefined)[]>;
export declare const createOrganizationAnnouncement: (data: CreateOrganizationAnnouncementInput) => Promise<import(".prisma/client").Announcement>;
export declare const deleteOrganizationAnnouncement: (data: DeleteOrganizationAnnouncementInput) => Promise<import(".prisma/client").Announcement>;
export {};
