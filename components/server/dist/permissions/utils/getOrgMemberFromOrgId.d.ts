import { PrismaClient } from "@prisma/client";
export declare const getOrgMemberFromOrgId: (db: PrismaClient, userId: number, organizationId: number) => Promise<import(".prisma/client").OrganizationMember | null>;
