"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EvacuationEventRepository {
    constructor(db) {
        this.getEvacuationEvents = async (data) => {
            const { groupId, cursor } = data;
            const evacuationEvents = await this.db.evacuationEvent.findMany(Object.assign(Object.assign(Object.assign({}, (cursor && { skip: 1 })), (cursor && {
                cursor: {
                    id: cursor
                }
            })), { take: 5, orderBy: {
                    id: "desc"
                }, where: {
                    groupId
                } }));
            return {
                data: evacuationEvents,
                cursor: evacuationEvents.length > 0 ? evacuationEvents[evacuationEvents.length - 1].id : cursor
            };
        };
        this.getEvacuationEvent = async (data) => {
            const { evacuationId } = data;
            const evacuationEvents = await this.db.evacuationEvent.findUnique({
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
            return evacuationEvents;
        };
        this.getEvacuationEventById = async (event) => {
            const { evacuationId } = event;
            const evacuationEvent = await this.db.evacuationEvent.findFirst({
                where: {
                    id: evacuationId
                }
            });
            return evacuationEvent;
        };
        this.getInProgressEvacuationEventByGroupId = async (data) => {
            const { groupId } = data;
            const evacuationEvent = await this.db.evacuationEvent.findFirst({
                where: {
                    groupId,
                    status: "in-progress"
                }
            });
            return evacuationEvent;
        };
        this.getInProgressEvacuationEvents = async (data) => {
            const { userId } = data;
            const evacuationEvents = await this.db.groupMember.findMany({
                where: {
                    userId: userId
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
        this.createEvent = async (data) => {
            const { groupId, msg, userId } = data;
            const evacuationEvent = await this.db.evacuationEvent.create({
                data: {
                    startTime: new Date().toISOString(),
                    message: msg,
                    type: "evacuation",
                    createdBy: userId,
                    status: "in-progress",
                    groupId
                }
            });
            return evacuationEvent;
        };
        this.updateEvent = async (event) => {
            const { evacuationId, status } = event;
            const evacuationEvent = await this.db.evacuationEvent.update({
                where: { id: evacuationId },
                data: {
                    status,
                    endTime: new Date().toISOString()
                }
            });
            return evacuationEvent;
        };
        this.deleteEvent = async (event) => {
            const { evacuationId } = event;
            const evacuationEvent = await this.db.evacuationEvent.delete({
                where: { id: evacuationId }
            });
            return evacuationEvent;
        };
        this.createEventResponse = async (data) => {
            const { evacuationId, userId, response } = data;
            const evacuationResponse = await this.db.evacuationResponse.create({
                data: {
                    response,
                    userId,
                    time: new Date().toISOString(),
                    evacuationId
                }
            });
            return evacuationResponse;
        };
        this.db = db;
    }
}
exports.default = EvacuationEventRepository;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZhY3VhdGlvbkV2ZW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kYi9ldmFjdWF0aW9uRXZlbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsTUFBcUIseUJBQXlCO0lBRzVDLFlBQVksRUFBZ0I7UUFJNUIsd0JBQW1CLEdBQUcsS0FBSyxFQUFFLElBQWlELEVBQUUsRUFBRTtZQUNoRixNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQztZQUNqQyxNQUFNLGdCQUFnQixHQUFHLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsUUFBUSwrQ0FDMUQsQ0FBQyxNQUFNLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FDdkIsQ0FBQyxNQUFNLElBQUk7Z0JBQ1osTUFBTSxFQUFFO29CQUNOLEVBQUUsRUFBRSxNQUFNO2lCQUNYO2FBQ0YsQ0FBQyxLQUNGLElBQUksRUFBRSxDQUFDLEVBQ1AsT0FBTyxFQUFFO29CQUNQLEVBQUUsRUFBRSxNQUFNO2lCQUNYLEVBQ0QsS0FBSyxFQUFFO29CQUNMLE9BQU87aUJBQ1IsSUFDRCxDQUFDO1lBRUgsT0FBTztnQkFDTCxJQUFJLEVBQUUsZ0JBQWdCO2dCQUN0QixNQUFNLEVBQ0osZ0JBQWdCLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTTthQUMxRixDQUFDO1FBQ0osQ0FBQyxDQUFDO1FBRUYsdUJBQWtCLEdBQUcsS0FBSyxFQUFFLElBQThCLEVBQUUsRUFBRTtZQUM1RCxNQUFNLEVBQUUsWUFBWSxFQUFFLEdBQUcsSUFBSSxDQUFDO1lBQzlCLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxJQUFJLENBQUMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUM7Z0JB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