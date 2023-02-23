import { Resolvers } from "../generated/graphql";
import {
  getEvacuationEvents,
  getInProgressEvacuationEvents
} from "../services/EvacuationEventService";
import {
  createEvent,
  createEventResponse,
  getEvacuationEvent,
  updateEvent
} from "../services/EvacuationEventService";
import { sendAlertEndedNotification, sendAlertNotification } from "../services/NotificationService";

const EvacuationEventResolver: Resolvers = {
  Query: {
    getEvacuationEvents: async (parent, args, context, info) => {
      const evacuationEvents = await getEvacuationEvents({
        context,
        ...args
      });
      return evacuationEvents;
    },
    getEvacuationEvent: async (parent, args, context, info) => {
      const evacuationEvent = await getEvacuationEvent({
        context,
        ...args
      });
      return evacuationEvent;
    },
    getInProgressEvacuationEvents: async (parent, args, context, info) => {
      const evacuationEvents = await getInProgressEvacuationEvents({
        context
      });
      return evacuationEvents;
    }
  },
  Mutation: {
    createEvacuationEvent: async (parent, args, context, info) => {
      const evacuationEvent = await createEvent({
        context,
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
        context,
        ...args
      });
      if (evacuationEvent.status === "ended") {
        await sendAlertEndedNotification({ db: context.db, evacuationEvent });
      }
      return evacuationEvent;
    },
    createEvacuationEventResponse: async (parent, args, context, info) => {
      const evacuationResponse = await createEventResponse({
        context,
        ...args
      });
      return evacuationResponse;
    }
  }
};

export default EvacuationEventResolver;
