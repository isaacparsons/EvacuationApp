import { PrismaClient } from "@prisma/client";
export declare const getOrgMemberFromGroupId: (db: PrismaClient, userId: number, groupId: number) => Promise<import(".prisma/client").OrganizationMember | null>;
