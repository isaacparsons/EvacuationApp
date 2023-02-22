import { PrismaClient } from "@prisma/client";
export declare const getGroupMemberFromEvacuationId: (db: PrismaClient, userId: number, evacuationId: number) => Promise<Error | import(".prisma/client").GroupMember | null>;
