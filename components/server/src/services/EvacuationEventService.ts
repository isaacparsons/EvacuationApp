import { EvacuationEvent, PrismaClient } from "@prisma/client";
// import EmailQueueService from "./EmailQueueService";
// import PushNotificationQueueService from "./PushNotificationQueueService";

interface GetEvacuationEvent {
  db: PrismaClient;
  evacuationId: number;
}

interface GetEvacuationEventsInput {
  db: PrismaClient;
  groupId: number;
  cursor?: number;
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

export const getEvacuationEvents = async (data: GetEvacuationEventsInput) => {
  const { groupId, db, cursor } = data;
  const evacuationEvents = await db.evacuationEvent.findMany({
    ...(cursor && { skip: 1 }),
    ...(cursor && {
      cursor: {
        id: cursor
      }
    }),
    take: 5,
    orderBy: {
      id: "asc"
    },
    where: {
      groupId
    }
  });

  return {
    data: evacuationEvents,
    cursor:
      evacuationEvents.length > 0
        ? evacuationEvents[evacuationEvents.length - 1].id
        : cursor
  };
};

export const getEvacuationEvent = async (data: GetEvacuationEvent) => {
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

export const getInProgressEvacuationEvents = async (
  data: GetInProgressEvacuationEvents
) => {
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
  const result = evacuationEvents.reduce(
    (res, curr) => [...res, ...curr.group.evacuationEvents],
    []
  );
  return result;
};

export const createEvent = async (data: CreateEvent) => {
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

export const updateEvent = async (event: UpdateEvent) => {
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

export const createEventResponse = async (data: CreateEvacuationResponse) => {
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
