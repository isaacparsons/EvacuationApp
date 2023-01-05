"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEventResponse = exports.updateEvent = exports.createEvent = exports.getInProgressEvacuationEvents = exports.getEvacuationEvent = void 0;
const getEvacuationEvent = async (data) => {
    const { db, evacuationId } = data;
    const evacuationEvents = await db.evacuationEvent.findUnique({
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
exports.getEvacuationEvent = getEvacuationEvent;
const getInProgressEvacuationEvents = async (data) => {
    const { db, userId } = data;
    const evacuationEvents = await db.groupMember.findMany({
        where: {
            userId
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
    const { userId, groupId, msg, db } = data;
    const existingEvacuationEvent = await db.evacuationEvent.findFirst({
        where: {
            groupId,
            status: "in-progress"
        }
    });
    if (existingEvacuationEvent) {
        throw new Error("An evacuation event is still in progress");
    }
    const evacuationEvent = await db.evacuationEvent.create({
        data: {
            startTime: new Date().toISOString(),
            message: msg,
            type: "evacuation",
            createdBy: userId,
            status: "in-progress",
            groupId
        }
    });
    // this.sendNotifications(evacuationEvent);
    return evacuationEvent;
};
exports.createEvent = createEvent;
const updateEvent = async (event) => {
    const { db, evacuationId, status } = event;
    const existingEvacuationEvent = await db.evacuationEvent.findFirst({
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
    const evacuationEvent = await db.evacuationEvent.update({
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
    const { db, evacuationId, response, userId } = data;
    const evacuationEvent = await db.evacuationEvent.findFirst({
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
    const evacuationResponse = await db.evacuationResponse.create({
        data: {
            response,
            userId,
            time: new Date().toISOString(),
            evacuationId
        }
    });
    return evacuationResponse;
};
exports.createEventResponse = createEventResponse;
// class EvacuationEventService {
//   public emailQueueService: EmailQueueService;
//   public pushNotificationsQueueService: PushNotificationQueueService;
//   public evacuationEvent: PrismaClient["evacuationEvent"];
//   public evacuationResponse: PrismaClient["evacuationResponse"];
//   public groupMember: PrismaClient["groupMember"];
//   public groupNotificationSetting: PrismaClient["groupNotificationSetting"];
//   constructor() {
//     this.emailQueueService = new EmailQueueService();
//     this.pushNotificationsQueueService = new PushNotificationQueueService();
//     this.evacuationEvent = new PrismaClient().evacuationEvent;
//     this.evacuationResponse = new PrismaClient().evacuationResponse;
//     this.groupMember = new PrismaClient().groupMember;
//     this.groupNotificationSetting = new PrismaClient().groupNotificationSetting;
//   }
//   public async getEvacuationEvents() {
//     const evacuationEvents = await this.evacuationEvent.findMany({
//       where: {
//         groupId
//       },
//       include: {
//         responses: {
//           include: {
//             user: true
//           }
//         }
//       }
//     });
//     return evacuationEvents;
//   }
//   public async createEvent(event: CreateEvent) {
//     const { userId, groupId, msg } = event;
//     const existingEvacuationEvent = await this.evacuationEvent.findFirst({
//       where: {
//         groupId,
//         status: "in-progress"
//       }
//     });
//     if (existingEvacuationEvent) {
//       throw new Error("An evacuation event is still in progress");
//     }
//     const evacuationEvent = await this.evacuationEvent.create({
//       data: {
//         startTime: new Date().toISOString(),
//         message: msg,
//         type: "evacuation",
//         createdBy: userId,
//         status: "in-progress",
//         groupId
//       }
//     });
//     this.sendNotifications(evacuationEvent);
//     return evacuationEvent;
//   }
//   public async updateEvent(event: UpdateEvent) {
//     const { evacuationEventId, status } = event;
//     const existingEvacuationEvent = await this.evacuationEvent.findFirst({
//       where: {
//         id: evacuationEventId
//       },
//       include: {
//         group: true
//       }
//     });
//     if (!existingEvacuationEvent) {
//       throw new Error("Event does not exist");
//     }
//     if (existingEvacuationEvent.status === "ended") {
//       throw new Error("Event has already ended");
//     }
//     const evacuationEvent = await this.evacuationEvent.update({
//       where: { id: evacuationEventId },
//       data: {
//         status,
//         endTime: new Date().toISOString()
//       }
//     });
//     return evacuationEvent;
//   }
//   public async createEventResponse(data: CreateEvacuationResponse) {
//     const { evacuationEventId, response, userId } = data;
//     const evacuationEvent = await this.evacuationEvent.findFirst({
//       where: {
//         id: evacuationEventId
//       },
//       include: {
//         group: true
//       }
//     });
//     if (!evacuationEvent) {
//       throw new Error("Evacuation Event does not exist");
//     }
//     if (evacuationEvent.status !== "in-progress") {
//       throw new Error("Evacuation Event is no longer in progress");
//     }
//     const evacuationResponse = await this.evacuationResponse.create({
//       data: {
//         response,
//         userId,
//         time: new Date().toISOString(),
//         evacuationId: evacuationEventId
//       }
//     });
//     return evacuationResponse;
//   }
//   public sendNotifications = async (evacuationEvent: EvacuationEvent) => {
//     const members = await this.groupMember.findMany({
//       where: {
//         groupId: evacuationEvent.groupId
//       },
//       include: {
//         user: true
//       }
//     });
//     const users = members.map((member) => member.user);
//     const groupNotificationSetting =
//       await this.groupNotificationSetting.findUnique({
//         where: {
//           groupId: evacuationEvent.groupId
//         }
//       });
//     if (groupNotificationSetting?.emailEnabled) {
//       await this.emailQueueService.sendAlertNotifications(users);
//     }
//     if (groupNotificationSetting?.pushEnabled) {
//       await this.pushNotificationsQueueService.sendNotifications(users);
//     }
//   };
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXZhY3VhdGlvbkV2ZW50U2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9FdmFjdWF0aW9uRXZlbnRTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQWtDTyxNQUFNLGtCQUFrQixHQUFHLEtBQUssRUFBRSxJQUF3QixFQUFFLEVBQUU7SUFDbkUsTUFBTSxFQUFFLEVBQUUsRUFBRSxZQUFZLEVBQUUsR0FBRyxJQUFJLENBQUM7SUFDbEMsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLEVBQUUsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDO1FBQzNELEtBQUssRUFBRTtZQUNMLEVBQUUsRUFBRSxZQUFZO1NBQ2pCO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsU0FBUyxFQUFFO2dCQUNULE9BQU8sRUFBRTtvQkFDUCxJQUFJLEVBQUUsSUFBSTtpQkFDWDthQUNGO1NBQ0Y7S0FDRixDQUFDLENBQUM7SUFDSCxPQUFPLGdCQUFnQixDQUFDO0FBQzFCLENBQUMsQ0FBQztBQWZXLFFBQUEsa0JBQWtCLHNCQWU3QjtBQUVLLE1BQU0sNkJBQTZCLEdBQUcsS0FBSyxFQUNoRCxJQUFtQyxFQUNuQyxFQUFFO0lBQ0YsTUFBTSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7SUFDNUIsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLEVBQUUsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDO1FBQ3JELEtBQUssRUFBRTtZQUNMLE1BQU07U0FDUDtRQUNELE9BQU8sRUFBRTtZQUNQLEtBQUssRUFBRTtnQkFDTCxPQUFPLEVBQUU7b0JBQ1AsZ0JBQWdCLEVBQUU7d0JBQ2hCLEtBQUssRUFBRTs0QkFDTCxNQUFNLEVBQUUsYUFBYTt5QkFDdEI7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxDQUNwQyxDQUFDLEdBQUcsRUFB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