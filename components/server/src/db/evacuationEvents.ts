import { PrismaClient } from "@prisma/client";

export default class EvacuationEventRepository {
  db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  getEvacuationEvents = async (data: { groupId: number; cursor?: number | null }) => {
    const { groupId, cursor } = data;
    const evacuationEvents = await this.db.evacuationEvent.findMany({
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
        evacuationEvents.length > 0 ? evacuationEvents[evacuationEvents.length - 1].id : cursor
    };
  };

  getEvacuationEvent = async (data: { evacuationId: number }) => {
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

  getEvacuationEventById = async (event: { evacuationId: number }) => {
    const { evacuationId } = event;

    const evacuationEvent = await this.db.evacuationEvent.findFirst({
      where: {
        id: evacuationId
      }
    });

    return evacuationEvent;
  };

  getInProgressEvacuationEventByGroupId = async (data: { groupId: number }) => {
    const { groupId } = data;
    const evacuationEvent = await this.db.evacuationEvent.findFirst({
      where: {
        groupId,
        status: "in-progress"
      }
    });
    return evacuationEvent;
  };

  getInProgressEvacuationEvents = async (data: { userId: number }) => {
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
    const result = evacuationEvents.reduce(
      (res, curr) => [...res, ...curr.group.evacuationEvents],
      []
    );
    return result;
  };

  createEvent = async (data: { groupId: number; msg: string; userId: number }) => {
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

  updateEvent = async (event: { evacuationId: number; status: string }) => {
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

  createEventResponse = async (data: {
    evacuationId: number;
    userId: number;
    response: string;
  }) => {
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
}
