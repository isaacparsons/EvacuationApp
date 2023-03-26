import { User, OrganizationNotificationSetting, OrganizationMember } from "@prisma/client";
import EmailService from "./EmailService";
import PushNotificationService from "./PushNotificationService";
import { INotification, NotificationDetails } from "../services/NotificationService";
import OrganizationRepository from "../db/organization";
import { InvitedOrganizationUser } from "../generated/graphql";
import { Context } from "../context";
export declare const createOrganizationNotifications: (data: {
    emailService: EmailService;
    pushNotificationService: PushNotificationService;
    users: User[];
    notificationSettings: OrganizationNotificationSetting;
    notificationDetails: NotificationDetails;
}) => INotification[];
export declare const inviteUsersToOrganization: (data: {
    organizationRepository: OrganizationRepository;
    users: InvitedOrganizationUser[];
    organizationId: number;
    context: Context;
}) => Promise<{
    succeeded: (OrganizationMember & {
        user: User;
    })[];
    failed: string[];
}>;
export declare const removeUsersFromOrganization: (data: {
    organizationRepository: OrganizationRepository;
    userIds: number[];
    organizationId: number;
    context: Context;
}) => Promise<{
    succeeded: (OrganizationMember & {
        user: User;
    })[];
    failed: number[];
}>;
