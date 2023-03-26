"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EmailService_1 = __importDefault(require("../services/EmailService"));
const NotificationService_1 = require("../services/NotificationService");
const PushNotificationService_1 = __importDefault(require("../services/PushNotificationService"));
const evacuationEvents_1 = __importDefault(require("../db/evacuationEvents"));
const group_1 = __importDefault(require("../db/group"));
const GroupService_1 = require("../services/GroupService");
const emailService = new EmailService_1.default();
const pushNotificationService = new PushNotificationService_1.default();
const EvacuationEventResolver = {
    Query: {
        getEvacuationEvents: async (parent, args, context) => {
            const { groupId, cursor } = args;
            const evacuationEventRepository = new evacuationEvents_1.default(context.db);
            const evacuationEvents = await evacuationEventRepository.getEvacuationEvents({
                groupId,
                cursor
            });
            return evacuationEvents;
        },
        getEvacuationEvent: async (parent, args, context) => {
            const { evacuationId } = args;
            const evacuationEventRepository = new evacuationEvents_1.default(context.db);
            const evacuationEvent = await evacuationEventRepository.getEvacuationEvent({
                evacuationId
            });
            if (!evacuationEvent) {
                throw new Error(`Evacuation event with id: ${evacuationId} does not exist`);
            }
            return evacuationEvent;
        },
        getInProgressEvacuationEvents: async (parent, args, context) => {
            const evacuationEventRepository = new evacuationEvents_1.default(context.db);
            const evacuationEvents = await evacuationEventRepository.getInProgressEvacuationEvents({
                userId: context.user.id
            });
            return evacuationEvents;
        }
    },
    Mutation: {
        createEvacuationEvent: async (parent, args, context) => {
            const evacuationEventRepository = new evacuationEvents_1.default(context.db);
            const groupRepository = new group_1.default(context.db);
            const { groupId, msg } = args;
            const existingEvacuationEvent = await evacuationEventRepository.getInProgressEvacuationEventByGroupId({
                groupId
            });
            if (existingEvacuationEvent) {
                throw new Error("An evacuation event is still in progress");
            }
            const evacuationEvent = await evacuationEventRepository.createEvent({
                groupId,
                msg,
                userId: context.user.id
            });
            const group = await groupRepository.getGroupWithAcceptedMembers({
                groupId
            });
            if (!group) {
                throw new Error(`No group exists with id: ${groupId}`);
            }
            if (group.notificationSetting) {
                const users = group.members.map((member) => member.user);
                const notificationDetails = {
                    subject: "Evacuation Alert!",
                    message: `Evacuation issued for ${group.name} \n message: ${evacuationEvent.message}`,
                    appLink: `${process.env.APP_LINK}group/${evacuationEvent.groupId}/evacuation/${evacuationEvent.id}`
                };
                const notifications = (0, GroupService_1.createGroupNotifications)({
                    emailService,
                    pushNotificationService,
                    users,
                    notificationDetails,
                    notificationSettings: group.notificationSetting
                });
                await (0, NotificationService_1.sendNotifications)({ context, notifications });
            }
            return evacuationEvent;
        },
        updateEvacuationEvent: async (parent, args, context) => {
            const { evacuationId, status } = args;
            const evacuationEventRepository = new evacuationEvents_1.default(context.db);
            const groupRepository = new group_1.default(context.db);
            const existingEvacuationEvent = await evacuationEventRepository.getEvacuationEventById({
                evacuationId
            });
            if (!existingEvacuationEvent) {
                throw new Error("Event does not exist");
            }
            if (existingEvacuationEvent.status === "ended") {
                throw new Error("Event has already ended");
            }
            const evacuationEvent = await evacuationEventRepository.updateEvent({
                evacuationId,
                status
            });
            const group = await groupRepository.getGroupWithAcceptedMembers({
                groupId: evacuationEvent.groupId
            });
            if (!group) {
                throw new Error(`No group exists with id: ${evacuationEvent.groupId}`);
            }
            if (group.notificationSetting && evacuationEvent.status === "ended") {
                const users = group.members.map((member) => member.user);
                const notificationDetails = {
                    subject: "Evacuation status update: safe to return",
                    message: `Evacuation for ${group.name} has ended, it is now safe to return`,
                    appLink: `${process.env.APP_LINK}group/${evacuationEvent.groupId}/evacuation/${evacuationEvent.id}`
                };
                const notifications = (0, GroupService_1.createGroupNotifications)({
                    emailService,
                    pushNotificationService,
                    users,
                    notificationDetails,
                    notificationSettings: group.notificationSetting
                });
                await (0, NotificationService_1.sendNotifications)({ context, notifications });
            }
            return evacuationEvent;
        },
        createEvacuationEventResponse: async (parent, args, context) => {
            const { evacuationId, response } = args;
            const evacuationEventRepository = new evacuationEvents_1.default(context.db);
            const existingEvacuationEvent = await evacuationEventRepository.getEvacuationEventById({
                evacuationId
            });
            if (!existingEvacuationEvent) {
                throw new Error("Event does not exist");
            }
            if (existingEvacuationEvent.status === "ended") {
                throw new Error("Event has already ended");
            }
            const evacuationResponse = await evacuationEventRepository.createEventResponse({
                evacuationId,
                userId: context.user.id,
                response
            });
            return evacuationResponse;
        }
    }
};
exports.default = EvacuationEventResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXZhY3VhdGlvbkV2ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Jlc29sdmVycy9FdmFjdWF0aW9uRXZlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFQSw0RUFBb0Q7QUFDcEQseUVBQW9FO0FBQ3BFLGtHQUEwRTtBQUMxRSw4RUFBK0Q7QUFDL0Qsd0RBQTBDO0FBQzFDLDJEQUFvRTtBQUVwRSxNQUFNLFlBQVksR0FBRyxJQUFJLHNCQUFZLEVBQUUsQ0FBQztBQUN4QyxNQUFNLHVCQUF1QixHQUFHLElBQUksaUNBQXVCLEVBQUUsQ0FBQztBQUU5RCxNQUFNLHVCQUF1QixHQUFjO0lBQ3pDLEtBQUssRUFBRTtRQUNMLG1CQUFtQixFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFO1lBQ25ELE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDO1lBQ2pDLE1BQU0seUJBQXlCLEdBQUcsSUFBSSwwQkFBeUIsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDNUUsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLHlCQUF5QixDQUFDLG1CQUFtQixDQUFDO2dCQUMzRSxPQUFPO2dCQUNQLE1BQU07YUFDUCxDQUFDLENBQUM7WUFDSCxPQUFPLGdCQUFnQixDQUFDO1FBQzFCLENBQUM7UUFDRCxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsRUFBRTtZQUNsRCxNQUFNLEVBQUUsWUFBWSxFQUFFLEdBQUcsSUFBSSxDQUFDO1lBQzlCLE1BQU0seUJBQXlCLEdBQUcsSUFBSSwwQkFBeUIsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDNUUsTUFBTSxlQUFlLEdBQUcsTUFBTSx5QkFBeUIsQ0FBQyxrQkFBa0IsQ0FBQztnQkFDekUsWUFBWTthQUNiLENBQUMsQ0FBQztZQUNILElBQUksQ0FB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