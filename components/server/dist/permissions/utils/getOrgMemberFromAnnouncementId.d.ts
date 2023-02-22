import { PrismaClient } from "@prisma/client";
export declare const getOrgMemberFromAnnouncementId: (db: PrismaClient, userId: number, announcementId: number) => Promise<Error | import(".prisma/client").OrganizationMember | null>;
