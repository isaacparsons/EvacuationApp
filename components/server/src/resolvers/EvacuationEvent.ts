import { Resolvers } from "../generated/graphql";
import { getGroupWithAcceptedMembers } from "../services/GroupService";
import { createAlertEndedNotification } from "../services/NotificationService";
import {
  createGroupNotifications,
  createAlertNotification,
  sendNotifications
} from "../services/NotificationService";
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

const EvacuationEventResolver: Resolvers = {
  Query: {
    getEvacuationEvents: async (parent, args, context) => {
      const evacuationEvents = await getEvacuationEvents({
        context,
        ...args
      });
      return evacuationEvents;
    },
    getEvacuationEvent: async (parent, args, context) => {
      const evacuationEvent = await getEvacuationEvent({
        context,
        ...args
      });
      return evacuationEvent;
    },
    getInProgressEvacuationEvents: async (parent, args, context) => {
      const evacuationEvents = await getInProgressEvacuationEvents({
        context
      });
      return evacuationEvents;
    }
  },
  Mutation: {
    createEvacuationEvent: async (parent, args, context) => {
      const { groupId } = args;
      const evacuationEvent = await createEvent({
        context,
        ...args
      });
      const group = await getGroupWithAcceptedMembers({
        context,
        groupId
      });
      if (group.notificationSetting) {
        const notificationDetails = createAlertNotification({
          evacuationEvent,
          group
        });
        const users = group.members.map((member) => member.user);
        const notifications = createGroupNotifications({
          users,
          notificationSettings: group.notificationSetting,
          notificationDetails
        });
        await sendNotifications({
          context,
          notifications
        });
      }

      return evacuationEvent;
    },
    updateEvacuationEvent: async (parent, args, context) => {
      const evacuationEvent = await updateEvent({
        context,
        ...args
      });
      const group = await getGroupWithAcceptedMembers({
        context,
        groupId: evacuationEvent.groupId
      });
      if (group.notificationSetting && evacuationEvent.status === "ended") {
        const notificationDetails = createAlertEndedNotification({
          evacuationEvent,
          group
        });
        const users = group.members.map((member) => member.user);
        const notifications = createGroupNotifications({
          users,
          notificationSettings: group.notificationSetting,
          notificationDetails
        });
        await sendNotifications({
          context,
          notifications
        });
      }

      return evacuationEvent;
    },
    createEvacuationEventResponse: async (parent, args, context) => {
      const evacuationResponse = await createEventResponse({
        context,
        ...args
      });
      return evacuationResponse;
    }
  }
};

export default EvacuationEventResolver;
