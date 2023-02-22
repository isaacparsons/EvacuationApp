import { PrismaClient } from "@prisma/client";
export declare const getOrgMemberFromEvacuationId: (db: PrismaClient, userId: number, evacuationId: number) => Promise<Error | import(".prisma/client").OrganizationMember | null>;
