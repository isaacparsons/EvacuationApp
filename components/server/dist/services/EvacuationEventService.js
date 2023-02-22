"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEventResponse = exports.updateEvent = exports.createEvent = exports.getInProgressEvacuationEvents = exports.getEvacuationEvent = exports.getEvacuationEvents = void 0;
const getEvacuationEvents = async (data) => {
    const { groupId, context, cursor } = data;
    const evacuationEvents = await context.db.evacuationEvent.findMany(Object.assign(Object.assign(Object.assign({}, (cursor && { skip: 1 })), (cursor && {
        cursor: {
            id: cursor
        }
    })), { take: 5, orderBy: {
            id: "asc"
        }, where: {
            groupId
        } }));
    return {
        data: evacuationEvents,
        cursor: evacuationEvents.length > 0 ? evacuationEvents[evacuationEvents.length - 1].id : cursor
    };
};
exports.getEvacuationEvents = getEvacuationEvents;
const getEvacuationEvent = async (data) => {
    const { context, evacuationId } = data;
    const evacuationEvents = await context.db.evacuationEvent.findUnique({
        where: {
            id: evacuationId
        },
        include: {
            responses: {
                include: {
                    user: true
                }
            }
        }
    });
    if (!evacuationEvents) {
        throw new Error(`Evacuation event with id: ${evacuationId} does not exist`);
    }
    return evacuationEvents;
};
exports.getEvacuationEvent = getEvacuationEvent;
const getInProgressEvacuationEvents = async (data) => {
    const { context } = data;
    const evacuationEvents = await context.db.groupMember.findMany({
        where: {
            userId: context.user.id
        },
        include: {
            group: {
                include: {
                    evacuationEvents: {
                        where: {
                            status: "in-progress"
                        }
                    }
                }
            }
        }
    });
    const result = evacuationEvents.reduce((res, curr) => [...res, ...curr.group.evacuationEvents], []);
    return result;
};
exports.getInProgressEvacuationEvents = getInProgressEvacuationEvents;
const createEvent = async (data) => {
    const { groupId, msg, context } = data;
    const existingEvacuationEvent = await context.db.evacuationEvent.findFirst({
        where: {
            groupId,
            status: "in-progress"
        }
    });
    if (existingEvacuationEvent) {
        throw new Error("An evacuation event is still in progress");
    }
    const evacuationEvent = await context.db.evacuationEvent.create({
        data: {
            startTime: new Date().toISOString(),
            message: msg,
            type: "evacuation",
            createdBy: context.user.id,
            status: "in-progress",
            groupId
        }
    });
    // this.sendNotifications(evacuationEvent);
    return evacuationEvent;
};
exports.createEvent = createEvent;
const updateEvent = async (event) => {
    const { context, evacuationId, status } = event;
    const existingEvacuationEvent = await context.db.evacuationEvent.findFirst({
        where: {
            id: evacuationId
        },
        include: {
            group: true
        }
    });
    if (!existingEvacuationEvent) {
        throw new Error("Event does not exist");
    }
    if (existingEvacuationEvent.status === "ended") {
        throw new Error("Event has already ended");
    }
    const evacuationEvent = await context.db.evacuationEvent.update({
        where: { id: evacuationId },
        data: {
            status,
            endTime: new Date().toISOString()
        }
    });
    return evacuationEvent;
};
exports.updateEvent = updateEvent;
const createEventResponse = async (data) => {
    const { context, evacuationId, response } = data;
    const evacuationEvent = await context.db.evacuationEvent.findFirst({
        where: {
            id: evacuationId
        },
        include: {
            group: true
        }
    });
    if (!evacuationEvent) {
        throw new Error("Evacuation Event does not exist");
    }
    if (evacuationEvent.status !== "in-progress") {
        throw new Error("Evacuation Event is no longer in progress");
    }
    const evacuationResponse = await context.db.evacuationResponse.create({
        data: {
            response,
            userId: context.user.id,
            time: new Date().toISOString(),
            evacuationId
        }
    });
    return evacuationResponse;
};
exports.createEventResponse = createEventResponse;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXZhY3VhdGlvbkV2ZW50U2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9FdmFjdWF0aW9uRXZlbnRTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVPLE1BQU0sbUJBQW1CLEdBQUcsS0FBSyxFQUFFLElBSXpDLEVBQUUsRUFBRTtJQUNILE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQztJQUMxQyxNQUFNLGdCQUFnQixHQUFHLE1BQU0sT0FBTyxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsUUFBUSwrQ0FDN0QsQ0FBQyxNQUFNLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FDdkIsQ0FBQyxNQUFNLElBQUk7UUFDWixNQUFNLEVBQUU7WUFDTixFQUFFLEVBQUUsTUFBTTtTQUNYO0tBQ0YsQ0FBQyxLQUNGLElBQUksRUFBRSxDQUFDLEVBQ1AsT0FBTyxFQUFFO1lBQ1AsRUFBRSxFQUFFLEtBQUs7U0FDVixFQUNELEtBQUssRUFBRTtZQUNMLE9BQU87U0FDUixJQUNELENBQUM7SUFFSCxPQUFPO1FBQ0wsSUFBSSxFQUFFLGdCQUFnQjtRQUN0QixNQUFNLEVBQUUsZ0JBQWdCLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTTtLQUNoRyxDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBMUJXLFFBQUEsbUJBQW1CLHVCQTBCOUI7QUFFSyxNQUFNLGtCQUFrQixHQUFHLEtBQUssRUFBRSxJQUFnRCxFQUFFLEVBQUU7SUFDM0YsTUFBTSxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsR0FBRyxJQUFJLENBQUM7SUFDdkMsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLE9BQU8sQ0FBQyxFQUFF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