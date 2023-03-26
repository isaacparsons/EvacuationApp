import { PrismaClient } from "@prisma/client";
export default class EvacuationEventRepository {
    db: PrismaClient;
    constructor(db: PrismaClient);
    getEvacuationEvents: (data: {
        groupId: number;
        cursor?: number | null;
    }) => Promise<{
        data: import(".prisma/client").EvacuationEvent[];
        cursor: number | null | undefined;
    }>;
    getEvacuationEvent: (data: {
        evacuationId: number;
    }) => Promise<(import(".prisma/client").EvacuationEvent & {
        responses: (import(".prisma/client").EvacuationResponse & {
            user: import(".prisma/client").User;
        })[];
    }) | null>;
    getEvacuationEventById: (event: {
        evacuationId: number;
    }) => Promise<import(".prisma/client").EvacuationEvent | null>;
    getInProgressEvacuationEventByGroupId: (data: {
        groupId: number;
    }) => Promise<import(".prisma/client").EvacuationEvent | null>;
    getInProgressEvacuationEvents: (data: {
        userId: number;
    }) => Promise<import(".prisma/client").EvacuationEvent[]>;
    createEvent: (data: {
        groupId: number;
        msg: string;
        userId: number;
    }) => Promise<import(".prisma/client").EvacuationEvent>;
    updateEvent: (event: {
        evacuationId: number;
        status: string;
    }) => Promise<import(".prisma/client").EvacuationEvent>;
    createEventResponse: (data: {
        evacuationId: number;
        userId: number;
        response: string;
    }) => Promise<import(".prisma/client").EvacuationResponse>;
}
