import {
  createOrganization,
  createOrganizationAnnouncement,
  deleteOrganization,
  deleteOrganizationAnnouncement,
  getAnnouncements,
  getOrganization,
  getOrganizationForUser,
  getOrganizationMembers,
  getOrganizationsForUser,
  inviteToOrganization,
  removeFromOrganization,
  updateOrganizationNotificationOptions,
  updateOrgInvite
} from "../services/OrganizationService";

import { Resolvers } from "../generated/graphql";
import { addUsersToGroups, getAcceptedUsersByGroupIds } from "../services/GroupService";
import { RequestError } from "../util/errors";
import { createAnnouncementNotification, NotificationType } from "../services/NotificationService";
import { getOrgWithAcceptedMembers } from "../services/OrganizationService";
import { User } from "@prisma/client";
import { getOrganizationById } from "../services/OrganizationService";
import {
  createCompleteSignupNotification,
  createInvitedToOrgNotification
} from "../services/NotificationService";
import {
  sendNotifications,
  createOrganizationNotifications
} from "../services/NotificationService";

const OrganizationResolver: Resolvers = {
  Query: {
    getOrganizations: async (parent, args, context) => {
      const organizations = await getOrganizationsForUser({
        context
      });
      return organizations;
    },
    getOrganization: async (parent, args, context) => {
      return getOrganization({
        context,
        ...args
      });
    },
    getOrganizationForUser: async (parent, args, context) => {
      return getOrganizationForUser({
        context,
        ...args
      });
    },
    getOrganizationMembers: async (parent, args, context) => {
      return getOrganizationMembers({
        context,
        ...args
      });
    },
    getAnnouncements: async (parent, args, context) => {
      return getAnnouncements({
        context,
        ...args
      });
    }
  },
  Mutation: {
    createOrganization: async (parent, args, context) => {
      const organization = await createOrganization({
        context,
        ...args
      });
      return organization;
    },
    deleteOrganization: async (parent, args, context) => {
      const organization = await deleteOrganization({
        context,
        ...args
      });
      return organization;
    },
    updateOrganizationNotificationOptions: async (parent, args, context) => {
      const organization = await updateOrganizationNotificationOptions({
        context,
        ...args
      });
      return organization;
    },
    inviteToOrganization: async (parent, args, context) => {
      const { groupIds, organizationId } = args;
      const { succeeded, failed } = await inviteToOrganization({
        context,
        ...args
      });
      const users = succeeded.map((member) => member.user);
      if (groupIds && groupIds.length > 0) {
        const userIds = users.map((user) => user.id);
        await addUsersToGroups({
          context,
          organizationId: organizationId,
          userIds,
          groupIds: groupIds
        });
      }
      const organization = await getOrganizationById({ context, organizationId });
      const notSignedUpUsers = users.filter((user) => !user.accountCreated);
      const signedUpUsers = users.filter((user) => user.accountCreated);

      const completeSignupNotifications = notSignedUpUsers.map((user) => {
        const notificationDetails = createCompleteSignupNotification({
          user,
          organization
        });
        return {
          type: NotificationType.EMAIL,
          users: [user],
          content: notificationDetails
        };
      });

      const invitedToOrgNotifications = signedUpUsers.map((user) => {
        const notificationDetails = createInvitedToOrgNotification({
          organization
        });
        return {
          type: NotificationType.EMAIL,
          users: [user],
          content: notificationDetails
        };
      });

      const notifications = [...completeSignupNotifications, ...invitedToOrgNotifications];

      await sendNotifications({
        context,
        notifications
      });
      if (failed.length > 0) {
        throw new RequestError("failed to invite 1 or more users");
      }
      return succeeded;
    },
    updateOrgInvite: async (parent, args, context) => {
      const organizationMember = await updateOrgInvite({
        context,
        ...args
      });
      return organizationMember;
    },
    removeFromOrganization: async (parent, args, context) => {
      const { succeeded, failed } = await removeFromOrganization({
        context,
        ...args
      });
      if (failed.length > 0) {
        throw new RequestError("Failed to remove 1 or more members");
      }
      return succeeded;
    },
    createOrganizationAnnouncement: async (parent, args, context) => {
      const { groupIds } = args;
      const announcement = await createOrganizationAnnouncement({
        context,
        ...args
      });
      const organization = await getOrgWithAcceptedMembers({
        context,
        organizationId: announcement.organizationId
      });
      let users: User[] = organization.members.map((member) => member.user);
      const notificationDetails = createAnnouncementNotification({ announcement });
      if (groupIds && groupIds.length > 0) {
        users = await getAcceptedUsersByGroupIds({ context, groupIds });
      }
      if (organization.notificationSetting) {
        const notifications = createOrganizationNotifications({
          users,
          notificationSettings: organization.notificationSetting,
          notificationDetails
        });
        await sendNotifications({
          context,
          notifications
        });
      }
      return announcement;
    },
    deleteOrganizationAnnouncement: async (parent, args, context) => {
      const organization = await deleteOrganizationAnnouncement({
        context,
        ...args
      });
      return organization;
    }
  }
};

export default OrganizationResolver;
