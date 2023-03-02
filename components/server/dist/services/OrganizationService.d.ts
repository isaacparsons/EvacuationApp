import { OrganizationMember, User } from "@prisma/client";
import {
  InvitedOrganizationUser,
  OrganizationNotificationSettingInput
} from "../generated/graphql";
import { Context } from "../context";
export declare const getOrganizationsForUser: (data: { context: Context }) => Promise<
  (OrganizationMember & {
    organization: import(".prisma/client").Organization & {
      members: OrganizationMember[];
    };
  })[]
>;
export declare const getOrganization: (data: {
  context: Context;
  organizationId: number;
}) => Promise<
  import(".prisma/client").Organization & {
    groups: import(".prisma/client").Group[];
    members: (OrganizationMember & {
      user: User;
    })[];
    announcements: import(".prisma/client").Announcement[];
    notificationSetting: import(".prisma/client").OrganizationNotificationSetting | null;
  }
>;
export declare const getOrganizationMembers: (data: {
  context: Context;
  organizationId: number;
  cursor?: number | null;
}) => Promise<{
  data: (OrganizationMember & {
    user: User;
  })[];
  cursor: number | null | undefined;
}>;
export declare const getOrganizationForUser: (data: {
  context: Context;
  organizationId: number;
}) => Promise<{
  groups: (import(".prisma/client").GroupMember & {
    group: import(".prisma/client").Group;
  })[];
  id: number;
  name: string;
  members: (OrganizationMember & {
    user: User;
  })[];
  announcements: import(".prisma/client").Announcement[];
  notificationSetting: import(".prisma/client").OrganizationNotificationSetting | null;
}>;
export declare const createOrganization: (data: {
  context: Context;
  name: string;
  organizationNotificationSetting: OrganizationNotificationSettingInput;
}) => Promise<
  import(".prisma/client").Organization & {
    groups: import(".prisma/client").Group[];
    members: (OrganizationMember & {
      user: User;
    })[];
    notificationSetting: import(".prisma/client").OrganizationNotificationSetting | null;
  }
>;
export declare const deleteOrganization: (data: {
  context: Context;
  organizationId: number;
}) => Promise<import(".prisma/client").Organization>;
export declare const updateOrganizationNotificationOptions: (data: {
  context: Context;
  organizationId: number;
  organizationNotificationSetting: OrganizationNotificationSettingInput;
}) => Promise<import(".prisma/client").OrganizationNotificationSetting>;
export declare const inviteToOrganization: (data: {
  context: Context;
  organizationId: number;
  users: InvitedOrganizationUser[];
}) => Promise<{
  succeeded: (OrganizationMember & {
    user: User;
  })[];
  failed: string[];
}>;
export declare const updateOrgInvite: (data: {
  context: Context;
  organizationId: number;
  status: string;
}) => Promise<OrganizationMember>;
export declare const removeFromOrganization: (data: {
  context: Context;
  organizationId: number;
  userIds: number[];
}) => Promise<{
  succeeded: (OrganizationMember & {
    user: User;
  })[];
  failed: number[];
}>;
export declare const createOrganizationAnnouncement: (data: {
  context: Context;
  organizationId: number;
  title: string;
  description?: string | null;
}) => Promise<import(".prisma/client").Announcement>;
export declare const deleteOrganizationAnnouncement: (data: {
  context: Context;
  announcementId: number;
}) => Promise<import(".prisma/client").Announcement>;
export declare const getAnnouncements: (data: {
  context: Context;
  organizationId: number;
  cursor?: number | null;
}) => Promise<{
  data: import(".prisma/client").Announcement[];
  cursor: number | null | undefined;
}>;
