import { Resolvers } from "../generated/graphql";
import { NotificationDetails } from "../services/NotificationService";
import EmailService from "../services/EmailService";
import { sendNotifications } from "../services/NotificationService";
import PushNotificationService from "../services/PushNotificationService";
import EvacuationEventRepository from "../db/evacuationEvents";
import GroupRepository from "../db/group";
import { createGroupNotifications } from "../services/GroupService";

const emailService = new EmailService();
const pushNotificationService = new PushNotificationService();

const EvacuationEventResolver: Resolvers = {
  Query: {
    getEvacuationEvents: async (parent, args, context) => {
      const { groupId, cursor } = args;
      const evacuationEventRepository = new EvacuationEventRepository(context.db);
      const evacuationEvents = await evacuationEventRepository.getEvacuationEvents({
        groupId,
        cursor
      });
      return evacuationEvents;
    },
    getEvacuationEvent: async (parent, args, context) => {
      const { evacuationId } = args;
      const evacuationEventRepository = new EvacuationEventRepository(context.db);
      const evacuationEvent = await evacuationEventRepository.getEvacuationEvent({
        evacuationId
      });
      if (!evacuationEvent) {
        throw new Error(`Evacuation event with id: ${evacuationId} does not exist`);
      }
      return evacuationEvent;
    },
    getInProgressEvacuationEvents: async (parent, args, context) => {
      const evacuationEventRepository = new EvacuationEventRepository(context.db);
      const evacuationEvents = await evacuationEventRepository.getInProgressEvacuationEvents({
        userId: context.user!.id
      });
      return evacuationEvents;
    }
  },
  Mutation: {
    createEvacuationEvent: async (parent, args, context) => {
      const evacuationEventRepository = new EvacuationEventRepository(context.db);
      const groupRepository = new GroupRepository(context.db);
      const { groupId, msg } = args;
      const existingEvacuationEvent =
        await evacuationEventRepository.getInProgressEvacuationEventByGroupId({
          groupId
        });
      if (existingEvacuationEvent) {
        throw new Error("An evacuation event is still in progress");
      }
      const evacuationEvent = await evacuationEventRepository.createEvent({
        groupId,
        msg,
        userId: context.user!.id
      });
      const group = await groupRepository.getGroupWithAcceptedMembers({
        groupId
      });

      if (!group) {
        throw new Error(`No group exists with id: ${groupId}`);
      }

      if (group.notificationSetting) {
        const users = group.members.map((member) => member.user);
        const notificationDetails: NotificationDetails = {
          subject: "Evacuation Alert!",
          message: `Evacuation issued for ${group.name} \n message: ${evacuationEvent.message}`,
          appLink: `${process.env.APP_LINK}group/${evacuationEvent.groupId}/evacuation/${evacuationEvent.id}`
        };
        const notifications = createGroupNotifications({
          emailService,
          pushNotificationService,
          users,
          notificationDetails,
          notificationSettings: group.notificationSetting
        });
        await sendNotifications({ context, notifications });
      }

      return evacuationEvent;
    },
    updateEvacuationEvent: async (parent, args, context) => {
      const { evacuationId, status } = args;
      const evacuationEventRepository = new EvacuationEventRepository(context.db);
      const groupRepository = new GroupRepository(context.db);
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
        const notificationDetails: NotificationDetails = {
          subject: "Evacuation status update: safe to return",
          message: `Evacuation for ${group.name} has ended, it is now safe to return`,
          appLink: `${process.env.APP_LINK}group/${evacuationEvent.groupId}/evacuation/${evacuationEvent.id}`
        };
        const notifications = createGroupNotifications({
          emailService,
          pushNotificationService,
          users,
          notificationDetails,
          notificationSettings: group.notificationSetting
        });
        await sendNotifications({ context, notifications });
      }
      return evacuationEvent;
    },
    createEvacuationEventResponse: async (parent, args, context) => {
      const { evacuationId, response } = args;
      const evacuationEventRepository = new EvacuationEventRepository(context.db);
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
        userId: context.user!.id,
        response
      });
      return evacuationResponse;
    }
  }
};

export default EvacuationEventResolver;
