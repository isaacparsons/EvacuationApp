import { EvacuationEvent, PrismaClient } from "@prisma/client";
interface GetEvacuationEvent {
    db: PrismaClient;
    evacuationId: number;
}
interface GetInProgressEvacuationEvents {
    db: PrismaClient;
    userId: number;
}
interface CreateEvent {
    db: PrismaClient;
    userId: number;
    groupId: number;
    msg: string;
}
interface UpdateEvent {
    db: PrismaClient;
    evacuationId: number;
    status: string;
}
interface CreateEvacuationResponse {
    db: PrismaClient;
    evacuationId: number;
    response: string;
    userId: number;
}
export declare const getEvacuationEvent: (data: GetEvacuationEvent) => Promise<(EvacuationEvent & {
    responses: (import(".prisma/client").EvacuationResponse & {
        user: import(".prisma/client").User;
    })[];
}) | null>;
export declare const getInProgressEvacuationEvents: (data: GetInProgressEvacuationEvents) => Promise<EvacuationEvent[]>;
export declare const createEvent: (data: CreateEvent) => Promise<EvacuationEvent>;
export declare const updateEvent: (event: UpdateEvent) => Promise<EvacuationEvent>;
export declare const createEventResponse: (data: CreateEvacuationResponse) => Promise<import(".prisma/client").EvacuationResponse>;
export {};
