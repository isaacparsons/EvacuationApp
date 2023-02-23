import {
  sendAnnouncementNotification,
  sendCompleteSignupNotifications
} from "../services/NotificationService";
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
import { addUsersToGroups } from "../services/GroupService";
import { RequestError } from "../util/errors";

const OrganizationResolver: Resolvers = {
  Query: {
    getOrganizations: async (parent, args, context, info) => {
      const organizations = await getOrganizationsForUser({
        context
      });
      return organizations;
    },
    getOrganization: async (parent, args, context, info) => {
      return getOrganization({
        context,
        ...args
      });
    },
    getOrganizationForUser: async (parent, args, context, info) => {
      return getOrganizationForUser({
        context,
        ...args
      });
    },
    getOrganizationMembers: async (parent, args, context, info) => {
      return getOrganizationMembers({
        context,
        ...args
      });
    },
    getAnnouncements: async (parent, args, context, info) => {
      return getAnnouncements({
        context,
        ...args
      });
    }
  },
  Mutation: {
    createOrganization: async (parent, args, context, info) => {
      const organization = await createOrganization({
        context,
        ...args
      });
      return organization;
    },
    deleteOrganization: async (parent, args, context, info) => {
      const organization = await deleteOrganization({
        context,
        ...args
      });
      return organization;
    },
    updateOrganizationNotificationOptions: async (parent, args, context, info) => {
      const organization = await updateOrganizationNotificationOptions({
        context,
        ...args
      });
      return organization;
    },
    inviteToOrganization: async (parent, args, context, info) => {
      const { succeeded, failed } = await inviteToOrganization({
        context,
        ...args
      });
      const userIds = succeeded.map((member) => member.userId);
      if (args.groupIds && args.groupIds.length > 0) {
        await addUsersToGroups({
          context,
          organizationId: args.organizationId,
          userIds,
          groupIds: args.groupIds
        });
      }
      const membersToEmail = succeeded.filter((member) => !member.user.accountCreated);
      await sendCompleteSignupNotifications({
        context,
        organizationId: args.organizationId,
        members: membersToEmail
      });
      if (failed.length > 0) {
        throw new RequestError("failed to invite 1 or more users");
      }
      return succeeded;
    },
    updateOrgInvite: async (parent, args, context, info) => {
      const organizationMember = await updateOrgInvite({
        context,
        ...args
      });
      return organizationMember;
    },
    removeFromOrganization: async (parent, args, context, info) => {
      const { succeeded, failed } = await removeFromOrganization({
        context,
        ...args
      });
      if (failed.length > 0) {
        throw new RequestError("Failed to remove 1 or more members");
      }
      return succeeded;
    },
    createOrganizationAnnouncement: async (parent, args, context, info) => {
      const announcement = await createOrganizationAnnouncement({
        context,
        ...args
      });
      await sendAnnouncementNotification({
        announcement,
        groupIds: args.groupIds,
        db: context.db
      });
      return announcement;
    },
    deleteOrganizationAnnouncement: async (parent, args, context, info) => {
      const organization = await deleteOrganizationAnnouncement({
        context,
        ...args
      });
      return organization;
    }
  }
};

export default OrganizationResolver;
