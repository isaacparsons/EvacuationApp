import { Announcement, EvacuationEvent, Group, Organization, OrganizationNotificationSetting, User, GroupNotificationSetting } from "@prisma/client";
import { Context } from "../context";
export declare enum NotificationType {
    EMAIL = "email",
    PUSH = "push"
}
export interface Notification {
    type: NotificationType;
    users: User[];
    content: NotificationDetails;
}
export interface NotificationDetails {
    subject: string;
    message: string;
    appLink?: string;
    signupLink?: string;
}
export declare const sendNotifications: (data: {
    context: Context;
    notifications: Notification[];
}) => Promise<void>;
export declare const createOrganizationNotifications: (data: {
    users: User[];
    notificationSettings: OrganizationNotificationSetting;
    notificationDetails: NotificationDetails;
}) => Notification[];
export declare const createGroupNotifications: (data: {
    users: User[];
    notificationSettings: GroupNotificationSetting;
    notificationDetails: NotificationDetails;
}) => Notification[];
export declare const createAnnouncementNotification: (data: {
    announcement: Announcement;
}) => {
    subject: string;
    message: string;
};
export declare const createAlertNotification: (data: {
    evacuationEvent: EvacuationEvent;
    group: Group;
}) => {
    subject: string;
    message: string;
    appLink: string;
};
export declare const createAlertEndedNotification: (data: {
    evacuationEvent: EvacuationEvent;
    group: Group;
}) => {
    subject: string;
    message: string;
    appLink: string;
};
export declare const createPasswordResetNotification: (data: {
    user: User;
}) => {
    subject: string;
    message: string;
};
export declare const createCompleteSignupNotification: (data: {
    user: User;
    organization: Organization;
}) => {
    subject: string;
    message: string;
    signupLink: string;
};
export declare const createInvitedToOrgNotification: (data: {
    organization: Organization;
}) => {
    subject: string;
    message: string;
};
