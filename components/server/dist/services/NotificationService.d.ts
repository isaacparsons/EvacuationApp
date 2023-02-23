import { Announcement, EvacuationEvent, OrganizationMember, PrismaClient, User } from "@prisma/client";
import { Context } from "../server";
interface SendAlertNotifications {
    db: PrismaClient;
    evacuationEvent: EvacuationEvent;
}
export declare const sendAnnouncementNotification: (data: {
    db: PrismaClient;
    announcement: Announcement;
    groupIds?: number[] | null;
}) => Promise<void>;
export declare const sendAlertNotification: (data: SendAlertNotifications) => Promise<void>;
export declare const sendAlertEndedNotification: (data: SendAlertNotifications) => Promise<void>;
export declare const sendPasswordResetNotification: (user: User) => Promise<void>;
export declare const sendCompleteSignupNotifications: (data: {
    context: Context;
    organizationId: number;
    members: Array<OrganizationMember & {
        user: User;
    }>;
}) => Promise<void>;
export {};
