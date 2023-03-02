import { Context } from "../context";

export const getEvacuationEvents = async (data: {
  context: Context;
  groupId: number;
  cursor?: number | null;
}) => {
  const { groupId, context, cursor } = data;
  const evacuationEvents = await context.db.evacuationEvent.findMany({
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
    cursor: evacuationEvents.length > 0 ? evacuationEvents[evacuationEvents.length - 1].id : cursor
  };
};

export const getEvacuationEvent = async (data: { context: Context; evacuationId: number }) => {
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

export const getInProgressEvacuationEvents = async (data: { context: Context }) => {
  const { context } = data;
  const evacuationEvents = await context.db.groupMember.findMany({
    where: {
      userId: context.user!.id
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

export const createEvent = async (data: { context: Context; groupId: number; msg: string }) => {
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
      createdBy: context.user!.id,
      status: "in-progress",
      groupId
    }
  });
  // this.sendNotifications(evacuationEvent);
  return evacuationEvent;
};

export const updateEvent = async (event: {
  context: Context;
  evacuationId: number;
  status: string;
}) => {
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

export const createEventResponse = async (data: {
  context: Context;
  evacuationId: number;
  response: string;
}) => {
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
      userId: context.user!.id,
      time: new Date().toISOString(),
      evacuationId
    }
  });
  return evacuationResponse;
};
