"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GroupService_1 = require("../services/GroupService");
const NotificationService_1 = require("../services/NotificationService");
const NotificationService_2 = require("../services/NotificationService");
const EvacuationEventService_1 = require("../services/EvacuationEventService");
const EvacuationEventService_2 = require("../services/EvacuationEventService");
const EvacuationEventResolver = {
    Query: {
        getEvacuationEvents: async (parent, args, context) => {
            const evacuationEvents = await (0, EvacuationEventService_1.getEvacuationEvents)(Object.assign({ context }, args));
            return evacuationEvents;
        },
        getEvacuationEvent: async (parent, args, context) => {
            const evacuationEvent = await (0, EvacuationEventService_2.getEvacuationEvent)(Object.assign({ context }, args));
            return evacuationEvent;
        },
        getInProgressEvacuationEvents: async (parent, args, context) => {
            const evacuationEvents = await (0, EvacuationEventService_1.getInProgressEvacuationEvents)({
                context
            });
            return evacuationEvents;
        }
    },
    Mutation: {
        createEvacuationEvent: async (parent, args, context) => {
            const { groupId } = args;
            const evacuationEvent = await (0, EvacuationEventService_2.createEvent)(Object.assign({ context }, args));
            const group = await (0, GroupService_1.getGroupWithAcceptedMembers)({
                context,
                groupId
            });
            if (group.notificationSetting) {
                const notificationDetails = (0, NotificationService_2.createAlertNotification)({
                    evacuationEvent,
                    group
                });
                const users = group.members.map((member) => member.user);
                const notifications = (0, NotificationService_2.createGroupNotifications)({
                    users,
                    notificationSettings: group.notificationSetting,
                    notificationDetails
                });
                await (0, NotificationService_2.sendNotifications)({
                    context,
                    notifications
                });
            }
            return evacuationEvent;
        },
        updateEvacuationEvent: async (parent, args, context) => {
            const evacuationEvent = await (0, EvacuationEventService_2.updateEvent)(Object.assign({ context }, args));
            const group = await (0, GroupService_1.getGroupWithAcceptedMembers)({
                context,
                groupId: evacuationEvent.groupId
            });
            if (group.notificationSetting && evacuationEvent.status === "ended") {
                const notificationDetails = (0, NotificationService_1.createAlertEndedNotification)({
                    evacuationEvent,
                    group
                });
                const users = group.members.map((member) => member.user);
                const notifications = (0, NotificationService_2.createGroupNotifications)({
                    users,
                    notificationSettings: group.notificationSetting,
                    notificationDetails
                });
                await (0, NotificationService_2.sendNotifications)({
                    context,
                    notifications
                });
            }
            return evacuationEvent;
        },
        createEvacuationEventResponse: async (parent, args, context) => {
            const evacuationResponse = await (0, EvacuationEventService_2.createEventResponse)(Object.assign({ context }, args));
            return evacuationResponse;
        }
    }
};
exports.default = EvacuationEventResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXZhY3VhdGlvbkV2ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Jlc29sdmVycy9FdmFjdWF0aW9uRXZlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwyREFBdUU7QUFDdkUseUVBQStFO0FBQy9FLHlFQUl5QztBQUN6QywrRUFHNEM7QUFDNUMsK0VBSzRDO0FBRTVDLE1BQU0sdUJBQXVCLEdBQWM7SUFDekMsS0FBSyxFQUFFO1FBQ0wsbUJBQW1CLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUU7WUFDbkQsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLElBQUEsNENBQW1CLGtCQUNoRCxPQUFPLElBQ0osSUFBSSxFQUNQLENBQUM7WUFDSCxPQUFPLGdCQUFnQixDQUFDO1FBQzFCLENBQUM7UUFDRCxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsRUFBRTtZQUNsRCxNQUFNLGVBQWUsR0FBRyxNQUFNLElBQUEsMkNBQWtCLGtCQUM5QyxPQUFPLElBQ0osSUFBSSxFQUNQLENBQUM7WUFDSCxPQUFPLGVBQWUsQ0FBQztRQUN6QixDQUFDO1FBQ0QsNkJBQTZCLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUU7WUFDN0QsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLElBQUEsc0RBQTZCLEVBQUM7Z0JBQzNELE9BQU87YUFDUixDQUFDLENBQUM7WUFDSCxPQUFPLGdCQUFnQixDQUFDO1FBQzFCLENBQUM7S0FDRjtJQUNELFFBQVEsRUFBRTtRQUNSLHFCQUFxQixFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFO1lBQ3JELE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUM7WUFDekIsTUFBTSxlQUFlLEdBQUcsTUFBTSxJQUFBLG9DQUFXLGtCQUN2QyxPQUFPLElBQ0osSUFBSSxFQUNQLENBQUM7WUFDSCxNQUFNLEtBQUssR0FBRyxNQUFNLElBQUEsMENBQTJCLEVBQUM7Z0JBQzlDLE9BQU87Z0JBQ1AsT0FBTzthQUNSLENBQUMsQ0FBQztZQUNILElBQUksS0FBSyxDQUFDLG1CQUFtQixFQUFFO2dCQUM3QixNQUFNLG1CQUFtQixHQUFHLElBQUEsNkNBQXVCLEVBQUM7b0JBQ2xELGVBQWU7b0JBQ2YsS0FBSztpQkFDTixDQUFDLENBQUM7Z0JBQ0gsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDekQsTUFBTSxhQUFhLEdBQUcsSUFBQSw4Q0FBd0IsRUFBQztvQkFDN0MsS0FBSztvQkFDTCxvQkFBb0IsRUFBRSxLQUFLLENBQUMsbUJBQW1CO29CQUMvQyxtQkFBbUI7aUJBQ3BCLENBQUMsQ0FBQztnQkFDSCxNQUFNLElBQUEsdUNBQWlCLEVBQUM7b0JBQ3RCLE9BQU87b0JBQ1AsYUFBYTtpQkFDZCxDQUFDLENBQUM7YUFDSjtZQUVELE9BQU8sZUFBZSxDQUFDO1FBQ3pCLENBQUM7UUFDRCxxQkFBcUIsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsRUFBRTtZQUNyRCxNQUFNLGVBQWUsR0FBRyxNQUFNLElBQUEsb0NBQVcsa0JBQ3ZDLE9BQU8sSUFDSixJQUFJLEVBQ1AsQ0FBQztZQUNILE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBQSwwQ0FBMkIsRUFBQztnQkFDOUMsT0FBTztnQkFDUCxPQUFPLEVBQUUsZUFBZSxDQUFDLE9BQU87YUFDakMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxLQUFLLENBQUMsbUJBQW1CLElBQUksZUFBZSxDQUFDLE1BQU0sS0FBSyxPQUFPLEVBQUU7Z0JBQ25FLE1BQU0sbUJBQW1CLEdBQUcsSUFBQSxrREFBNEIsRUFBQztvQkFDdkQsZUFBZTtvQkFDZixLQUFLO2lCQUNOLENBQUMsQ0FBQztnQkFDSCxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN6RCxNQUFNLGFBQWEsR0FBRyxJQUFBLDhDQUF3QixFQUFDO29CQUM3QyxLQUFLO29CQUNMLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxtQkFBbUI7b0JBQy9DLG1CQUFtQjtpQkFDcEIsQ0FBQyxDQUFDO2dCQUNILE1BQU0sSUFBQSx1Q0FBaUIsRUFBQztvQkFDdEIsT0FBTztvQkFDUCxhQUFhO2lCQUNkLENBQUMsQ0FBQzthQUNKO1lBRUQsT0FBTyxlQUFlLENBQUM7UUFDekIsQ0FBQztRQUNELDZCQUE2QixFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFO1lBQzdELE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxJQUFBLDRDQUFtQixrQkFDbEQsT0FBTyxJQUNKLElBQUksRUFDUCxDQUFDO1lBQ0gsT0FBTyxrQkFBa0IsQ0FBQztRQUM1QixDQUFDO0tBQ0Y7Q0FDRixDQUFDO0FBRUYsa0JBQWUsdUJBQXVCLENBQUMifQ==