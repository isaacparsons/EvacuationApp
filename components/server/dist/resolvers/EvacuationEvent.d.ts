declare const EvacuationEventResolver: {
    Query: {
        getEvacuationEvent: (parent: any, args: any, context: any, info: any) => Promise<(import(".prisma/client").EvacuationEvent & {
            responses: (import(".prisma/client").EvacuationResponse & {
                user: import(".prisma/client").User;
            })[];
        }) | null>;
        getInProgressEvacuationEvents: (parent: any, args: any, context: any, info: any) => Promise<import(".prisma/client").EvacuationEvent[]>;
    };
    Mutation: {
        createEvacuationEvent: (parent: any, args: any, context: any, info: any) => Promise<import(".prisma/client").EvacuationEvent>;
        updateEvacuationEvent: (parent: any, args: any, context: any, info: any) => Promise<import(".prisma/client").EvacuationEvent>;
        createEvacuationEventResponse: (parent: any, args: any, context: any, info: any) => Promise<import(".prisma/client").EvacuationResponse>;
    };
};
export default EvacuationEventResolver;
