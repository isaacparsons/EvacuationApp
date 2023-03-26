import { User } from "@prisma/client";
import { Context } from "../context";
import EmailService from "./EmailService";
import PushNotificationService from "./PushNotificationService";
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
    emailLink?: string;
}
export declare const sendNotifications: (data: {
    context: Context;
    notifications: INotification[];
}) => Promise<void>;
export interface INotification {
    send: () => Promise<void>;
}
export declare class EmailNotification implements INotification {
    emailService: EmailService;
    userEmails: string[];
    message: string;
    subject: string;
    emailLink?: string;
    constructor(emailService: EmailService, userEmails: string[], message: string, subject: string, emailLink?: string);
    send(): Promise<void>;
}
export declare class PushNotification implements INotification {
    pushNotificationService: PushNotificationService;
    userIds: string[];
    message: string;
    app_url?: string;
    constructor(pushNotificationService: PushNotificationService, userIds: string[], message: string, app_url?: string);
    send(): Promise<void>;
}
