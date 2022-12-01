import { PrismaClient } from "@prisma/client";
interface SendNotifications {
    db: PrismaClient;
    groupId: number;
}
export declare const sendNotifications: (data: SendNotifications) => Promise<void>;
export {};
