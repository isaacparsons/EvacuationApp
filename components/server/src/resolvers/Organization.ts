import EmailService from "../services/EmailService";
import { sendCompleteSignupNotifications } from "../services/NotificationService";
import {
  createOrganization,
  createOrganizationAnnouncement,
  deleteOrganization,
  deleteOrganizationAnnouncement,
  getOrganization,
  getOrganizationsForUser,
  inviteToOrganization,
  removeFromOrganization,
  updateOrgInvite
} from "../services/OrganizationService";
import { getOrganizationForUser } from "../services/OrganizationService";
import { Context } from "../types";

const emailService = new EmailService();

const OrganizationResolver = {
  Query: {
    getOrganizations: async (parent, args, context: Context, info) => {
      const organizations = await getOrganizationsForUser({
        db: context.db,
        userId: context.user.id
      });
      return organizations;
    },
    getOrganization: async (parent, args, context: Context, info) => {
      return getOrganization({
        db: context.db,
        organizationId: args.organizationId
      });
    },
    getOrganizationForUser: async (parent, args, context: Context, info) => {
      return getOrganizationForUser({
        db: context.db,
        organizationId: args.organizationId,
        userId: context.user.id
      });
    }
  },
  Mutation: {
    createOrganization: async (
      parent,
      args,
      context: Context,
      info
    ): Promise<any> => {
      const organization = await createOrganization({
        db: context.db,
        ...args,
        userId: context.user.id
      });
      return organization;
    },
    deleteOrganization: async (
      parent,
      args,
      context: Context,
      info
    ): Promise<any> => {
      const organization = await deleteOrganization({
        db: context.db,
        ...args
      });
      return organization;
    },
    inviteToOrganization: async (
      parent,
      args,
      context: Context,
      info
    ): Promise<any> => {
      const members = await inviteToOrganization({
        db: context.db,
        ...args
      });
      await sendCompleteSignupNotifications({ db: context.db, members });
      return members;
    },
    updateOrgInvite: async (
      parent,
      args,
      context: Context,
      info
    ): Promise<any> => {
      const organization = await updateOrgInvite({
        db: context.db,
        ...args,
        userId: context.user.id
      });
      return organization;
    },
    removeFromOrganization: async (
      parent,
      args,
      context,
      info
    ): Promise<any> => {
      const organization = await removeFromOrganization({
        db: context.db,
        ...args
      });
      return organization;
    },
    createOrganizationAnnouncement: async (
      parent,
      args,
      context: Context,
      info
    ): Promise<any> => {
      const organization = await createOrganizationAnnouncement({
        db: context.db,
        userId: context.user.id,
        ...args
      });
      return organization;
    },
    deleteOrganizationAnnouncement: async (
      parent,
      args,
      context: Context,
      info
    ): Promise<any> => {
      const organization = await deleteOrganizationAnnouncement({
        db: context.db,
        userId: context.user.id,
        ...args
      });
      return organization;
    }
  }
};

export default OrganizationResolver;
