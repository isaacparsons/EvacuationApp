import { PrismaClient } from "@prisma/client";
export declare const getOrgMemberFromGroupId: (db: PrismaClient, userId: number, groupId: number) => Promise<Error | import(".prisma/client").OrganizationMember | null>;
