"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EvacuationEventService_1 = require("../services/EvacuationEventService");
const EvacuationEventService_2 = require("../services/EvacuationEventService");
const NotificationService_1 = require("../services/NotificationService");
// const evacuationEventService = new EvacuationEventService();
const EvacuationEventResolver = {
    Query: {
        getEvacuationEvent: async (parent, args, context, info) => {
            const evacuationEvent = await (0, EvacuationEventService_2.getEvacuationEvent)(Object.assign({ db: context.db }, args));
            return evacuationEvent;
        },
        getInProgressEvacuationEvents: async (parent, args, context, info) => {
            const evacuationEvents = await (0, EvacuationEventService_1.getInProgressEvacuationEvents)({
                db: context.db,
                userId: context.user.id
            });
            return evacuationEvents;
        }
    },
    Mutation: {
        createEvacuationEvent: async (parent, args, context, info) => {
            const evacuationEvent = await (0, EvacuationEventService_2.createEvent)(Object.assign({ db: context.db, userId: context.user.id }, args));
            await (0, NotificationService_1.sendAlertNotification)({
                db: context.db,
                evacuationEvent
            });
            return evacuationEvent;
        },
        updateEvacuationEvent: async (parent, args, context, info) => {
            const evacuationEvent = await (0, EvacuationEventService_2.updateEvent)(Object.assign({ db: context.db }, args));
            if (evacuationEvent.status === "ended") {
                await (0, NotificationService_1.sendAlertEndedNotification)({ db: context.db, evacuationEvent });
            }
            return evacuationEvent;
        },
        createEvacuationEventResponse: async (parent, args, context, info) => {
            const evacuationResponse = await (0, EvacuationEventService_2.createEventResponse)(Object.assign(Object.assign({ db: context.db }, args), { userId: context.user.id }));
            return evacuationResponse;
        }
    }
};
exports.default = EvacuationEventResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXZhY3VhdGlvbkV2ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Jlc29sdmVycy9FdmFjdWF0aW9uRXZlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrRUFBbUY7QUFDbkYsK0VBSzRDO0FBQzVDLHlFQUd5QztBQUV6QywrREFBK0Q7QUFFL0QsTUFBTSx1QkFBdUIsR0FBRztJQUM5QixLQUFLLEVBQUU7UUFDTCxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDeEQsTUFBTSxlQUFlLEdBQUcsTUFBTSxJQUFBLDJDQUFrQixrQkFDOUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxFQUFFLElBQ1gsSUFBSSxFQUNQLENBQUM7WUFDSCxPQUFPLGVBQWUsQ0FBQztRQUN6QixDQUFDO1FBQ0QsNkJBQTZCLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQ25FLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxJQUFBLHNEQUE2QixFQUFDO2dCQUMzRCxFQUFFLEVBQUUsT0FBTyxDQUFDLEVBQUU7Z0JBQ2QsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTthQUN4QixDQUFDLENBQUM7WUFDSCxPQUFPLGdCQUFnQixDQUFDO1FBQzFCLENBQUM7S0FDRjtJQUNELFFBQVEsRUFBRTtRQUNSLHFCQUFxQixFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUMzRCxNQUFNLGVBQWUsR0FBRyxNQUFNLElBQUEsb0NBQVcsa0JBQ3ZDLEVBQUUsRUFBRSxPQUFPLENBQUMsRUFBRSxFQUNkLE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFDcEIsSUFBSSxFQUNQLENBQUM7WUFDSCxNQUFNLElBQUEsMkNBQXFCLEVBQUM7Z0JBQzFCLEVBQUUsRUFBRSxPQUFPLENBQUMsRUFBRTtnQkFDZCxlQUFlO2FBQ2hCLENBQUMsQ0FBQztZQUVILE9BQU8sZUFBZSxDQUFDO1FBQ3pCLENBQUM7UUFDRCxxQkFBcUIsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDM0QsTUFBTSxlQUFlLEdBQUcsTUFBTSxJQUFBLG9DQUFXLGtCQUN2QyxFQUFFLEVBQUUsT0FBTyxDQUFDLEVBQUUsSUFDWCxJQUFJLEVBQ1AsQ0FBQztZQUNILElBQUksZUFBZSxDQUFDLE1BQU0sS0FBSyxPQUFPLEVBQUU7Z0JBQ3RDLE1BQU0sSUFBQSxnREFBMEIsRUFBQyxFQUFFLEVBQUUsRUFBRSxPQUFPLENBQUMsRUFBRSxFQUFFLGVBQWUsRUFBRSxDQUFDLENBQUM7YUFDdkU7WUFDRCxPQUFPLGVBQWUsQ0FBQztRQUN6QixDQUFDO1FBQ0QsNkJBQTZCLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQ25FLE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxJQUFBLDRDQUFtQixnQ0FDbEQsRUFBRSxFQUFFLE9BQU8sQ0FBQyxFQUFFLElBQ1gsSUFBSSxLQUNQLE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFDdkIsQ0FBQztZQUNILE9BQU8sa0JBQWtCLENBQUM7UUFDNUIsQ0FBQztLQUNGO0NBQ0YsQ0FBQztBQUVGLGtCQUFlLHVCQUF1QixDQUFDIn0=