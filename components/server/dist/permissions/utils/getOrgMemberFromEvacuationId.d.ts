import { PrismaClient } from "@prisma/client";
export declare const getOrgMemberFromEvacuationId: (db: PrismaClient, userId: number, evacuationId: number) => Promise<import(".prisma/client").OrganizationMember | null>;
