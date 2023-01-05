import { EvacuationEvent, Organization, OrganizationMember, PrismaClient, User } from "@prisma/client";
interface SendAlertNotifications {
    db: PrismaClient;
    evacuationEvent: EvacuationEvent;
}
interface SendCompleteSignupNotifications {
    db: PrismaClient;
    members: Array<OrganizationMember & {
        user: User;
        organization: Organization;
    }>;
}
export declare const sendAlertNotification: (data: SendAlertNotifications) => Promise<void>;
export declare const sendAlertEndedNotification: (data: SendAlertNotifications) => Promise<void>;
export declare const sendPasswordResetNotification: (user: User) => Promise<void>;
export declare const sendCompleteSignupNotifications: (data: SendCompleteSignupNotifications) => Promise<void>;
export declare const sendOrgAnnouncementNotification: () => void;
export {};
