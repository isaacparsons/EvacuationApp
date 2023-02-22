"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EvacuationEventService_1 = require("../services/EvacuationEventService");
const EvacuationEventService_2 = require("../services/EvacuationEventService");
const NotificationService_1 = require("../services/NotificationService");
const EvacuationEventResolver = {
    Query: {
        getEvacuationEvents: async (parent, args, context, info) => {
            const evacuationEvents = await (0, EvacuationEventService_1.getEvacuationEvents)(Object.assign({ context }, args));
            return evacuationEvents;
        },
        getEvacuationEvent: async (parent, args, context, info) => {
            const evacuationEvent = await (0, EvacuationEventService_2.getEvacuationEvent)(Object.assign({ context }, args));
            return evacuationEvent;
        },
        getInProgressEvacuationEvents: async (parent, args, context, info) => {
            const evacuationEvents = await (0, EvacuationEventService_1.getInProgressEvacuationEvents)({
                context
            });
            return evacuationEvents;
        }
    },
    Mutation: {
        createEvacuationEvent: async (parent, args, context, info) => {
            const evacuationEvent = await (0, EvacuationEventService_2.createEvent)(Object.assign({ context }, args));
            await (0, NotificationService_1.sendAlertNotification)({
                db: context.db,
                evacuationEvent
            });
            return evacuationEvent;
        },
        updateEvacuationEvent: async (parent, args, context, info) => {
            const evacuationEvent = await (0, EvacuationEventService_2.updateEvent)(Object.assign({ context }, args));
            if (evacuationEvent.status === "ended") {
                await (0, NotificationService_1.sendAlertEndedNotification)({ db: context.db, evacuationEvent });
            }
            return evacuationEvent;
        },
        createEvacuationEventResponse: async (parent, args, context, info) => {
            const evacuationResponse = await (0, EvacuationEventService_2.createEventResponse)(Object.assign({ context }, args));
            return evacuationResponse;
        }
    }
};
exports.default = EvacuationEventResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXZhY3VhdGlvbkV2ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Jlc29sdmVycy9FdmFjdWF0aW9uRXZlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwrRUFHNEM7QUFDNUMsK0VBSzRDO0FBQzVDLHlFQUFvRztBQUVwRyxNQUFNLHVCQUF1QixHQUFjO0lBQ3pDLEtBQUssRUFBRTtRQUNMLG1CQUFtQixFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUN6RCxNQUFNLGdCQUFnQixHQUFHLE1BQU0sSUFBQSw0Q0FBbUIsa0JBQ2hELE9BQU8sSUFDSixJQUFJLEVBQ1AsQ0FBQztZQUNILE9BQU8sZ0JBQWdCLENBQUM7UUFDMUIsQ0FBQztRQUNELGtCQUFrQixFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUN4RCxNQUFNLGVBQWUsR0FBRyxNQUFNLElBQUEsMkNBQWtCLGtCQUM5QyxPQUFPLElBQ0osSUFBSSxFQUNQLENBQUM7WUFDSCxPQUFPLGVBQWUsQ0FBQztRQUN6QixDQUFDO1FBQ0QsNkJBQTZCLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQ25FLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxJQUFBLHNEQUE2QixFQUFDO2dCQUMzRCxPQUFPO2FBQ1IsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxnQkFBZ0IsQ0FBQztRQUMxQixDQUFDO0tBQ0Y7SUFDRCxRQUFRLEVBQUU7UUFDUixxQkFBcUIsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDM0QsTUFBTSxlQUFlLEdBQUcsTUFBTSxJQUFBLG9DQUFXLGtCQUN2QyxPQUFPLElBQ0osSUFBSSxFQUNQLENBQUM7WUFDSCxNQUFNLElBQUEsMkNBQXFCLEVBQUM7Z0JBQzFCLEVBQUUsRUFBRSxPQUFPLENBQUMsRUFBRTtnQkFDZCxlQUFlO2FBQ2hCLENBQUMsQ0FBQztZQUVILE9BQU8sZUFBZSxDQUFDO1FBQ3pCLENBQUM7UUFDRCxxQkFBcUIsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDM0QsTUFBTSxlQUFlLEdBQUcsTUFBTSxJQUFBLG9DQUFXLGtCQUN2QyxPQUFPLElBQ0osSUFBSSxFQUNQLENBQUM7WUFDSCxJQUFJLGVBQWUsQ0FBQyxNQUFNLEtBQUssT0FBTyxFQUFFO2dCQUN0QyxNQUFNLElBQUEsZ0RBQTBCLEVBQUMsRUFBRSxFQUFFLEVBQUUsT0FBTyxDQUFDLEVBQUUsRUFBRSxlQUFlLEVBQUUsQ0FBQyxDQUFDO2FBQ3ZFO1lBQ0QsT0FBTyxlQUFlLENBQUM7UUFDekIsQ0FBQztRQUNELDZCQUE2QixFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUNuRSxNQUFNLGtCQUFrQixHQUFHLE1BQU0sSUFBQSw0Q0FBbUIsa0JBQ2xELE9BQU8sSUFDSixJQUFJLEVBQ1AsQ0FBQztZQUNILE9BQU8sa0JBQWtCLENBQUM7UUFDNUIsQ0FBQztLQUNGO0NBQ0YsQ0FBQztBQUVGLGtCQUFlLHVCQUF1QixDQUFDIn0=