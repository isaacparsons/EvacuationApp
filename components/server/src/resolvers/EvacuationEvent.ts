import {
  getInProgressEvacuationEvents,
  getEvacuationEvents
} from "../services/EvacuationEventService";
import {
  createEvent,
  createEventResponse,
  getEvacuationEvent,
  updateEvent
} from "../services/EvacuationEventService";
import {
  sendAlertEndedNotification,
  sendAlertNotification
} from "../services/NotificationService";

// const evacuationEventService = new EvacuationEventService();

const EvacuationEventResolver = {
  Query: {
    getEvacuationEvents: async (parent, args, context, info) => {
      const evacuationEvents = await getEvacuationEvents({
        db: context.db,
        ...args
      });
      return evacuationEvents;
    },
    getEvacuationEvent: async (parent, args, context, info) => {
      const evacuationEvent = await getEvacuationEvent({
        db: context.db,
        ...args
      });
      return evacuationEvent;
    },
    getInProgressEvacuationEvents: async (parent, args, context, info) => {
      const evacuationEvents = await getInProgressEvacuationEvents({
        db: context.db,
        userId: context.user.id
      });
      return evacuationEvents;
    }
  },
  Mutation: {
    createEvacuationEvent: async (parent, args, context, info) => {
      const evacuationEvent = await createEvent({
        db: context.db,
        userId: context.user.id,
        ...args
      });
      await sendAlertNotification({
        db: context.db,
        evacuationEvent
      });

      return evacuationEvent;
    },
    updateEvacuationEvent: async (parent, args, context, info) => {
      const evacuationEvent = await updateEvent({
        db: context.db,
        ...args
      });
      if (evacuationEvent.status === "ended") {
        await sendAlertEndedNotification({ db: context.db, evacuationEvent });
      }
      return evacuationEvent;
    },
    createEvacuationEventResponse: async (parent, args, context, info) => {
      const evacuationResponse = await createEventResponse({
        db: context.db,
        ...args,
        userId: context.user.id
      });
      return evacuationResponse;
    }
  }
};

export default EvacuationEventResolver;
