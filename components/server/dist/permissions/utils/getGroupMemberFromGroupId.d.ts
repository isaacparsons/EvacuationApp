import { PrismaClient } from "@prisma/client";
export declare const getGroupMemberFromGroupId: (db: PrismaClient, userId: number, groupId: number) => Promise<import(".prisma/client").GroupMember | null>;
