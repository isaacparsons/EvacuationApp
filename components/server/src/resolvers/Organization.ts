import { Resolvers } from "../generated/graphql";
import { EmailNotification } from "../services/NotificationService";
import { User } from "@prisma/client";
import EmailService from "../services/EmailService";
import PushNotificationService from "../services/PushNotificationService";
import OrganizationRepository from "../db/organization";
import GroupRepository from "../db/group";

import { sendNotifications } from "../services/NotificationService";
import TokenService from "../services/TokenService";
import { inviteUsersToGroups } from "../services/GroupService";
import { removeUsersFromOrganization } from "../services/OrganizationService";
import {
  createOrganizationNotifications,
  inviteUsersToOrganization
} from "../services/OrganizationService";

const tokenService = new TokenService();
const emailService = new EmailService();
const pushNotificationService = new PushNotificationService();

const OrganizationResolver: Resolvers = {
  Query: {
    getOrganizations: async (parent, args, context) => {
      const organizationRepository = new OrganizationRepository(context.db);
      const organizations = organizationRepository.getOrganizationsForUser({
        userId: context.user!.id
      });
      return organizations;
    },
    getOrganization: async (parent, args, context) => {
      const { organizationId } = args;
      const organizationRepository = new OrganizationRepository(context.db);
      const organization = await organizationRepository.getOrganization({
        organizationId
      });
      if (!organization) {
        throw new Error(`Organization does not exist with id: ${organizationId}`);
      }
      return organization;
    },
    getOrganizationForUser: async (parent, args, context) => {
      const { organizationId } = args;
      const organizationRepository = new OrganizationRepository(context.db);
      const groupRepository = new GroupRepository(context.db);
      const organization = await organizationRepository.getOrganizationForUser({
        organizationId,
        userId: context.user!.id
      });

      if (!organization) {
        throw new Error(`Organization with id: ${organizationId} does not exist`);
      }
      const groups = await groupRepository.getGroupsForUserInOrganization({
        userId: context.user!.id,
        organizationId
      });

      return { ...organization, groups };
    },
    getOrganizationMembers: async (parent, args, context) => {
      const { organizationId, cursor } = args;
      const organizationRepository = new OrganizationRepository(context.db);
      const members = await organizationRepository.getOrganizationMembers({
        organizationId,
        cursor
      });
      return members;
    },
    getAnnouncements: async (parent, args, context) => {
      const { organizationId, cursor } = args;
      const organizationRepository = new OrganizationRepository(context.db);
      const announcements = organizationRepository.getAnnouncements({
        organizationId,
        cursor
      });
      return announcements;
    }
  },
  Mutation: {
    createOrganization: async (parent, args, context) => {
      const { name, organizationNotificationSetting } = args;
      const organizationRepository = new OrganizationRepository(context.db);
      const organization = await organizationRepository.createOrganization({
        name,
        organizationNotificationSetting,
        userId: context.user!.id
      });
      return organization;
    },
    deleteOrganization: async (parent, args, context) => {
      const { organizationId } = args;
      const organizationRepository = new OrganizationRepository(context.db);
      const organization = await organizationRepository.deleteOrganization({
        organizationId
      });
      return organization;
    },
    updateOrganizationNotificationOptions: async (parent, args, context) => {
      const { organizationId, organizationNotificationSetting } = args;
      const organizationRepository = new OrganizationRepository(context.db);
      const organization = await organizationRepository.updateOrganizationNotificationOptions({
        organizationId,
        organizationNotificationSetting
      });
      return organization;
    },
    inviteToOrganization: async (parent, args, context) => {
      const { users, organizationId, groupIds } = args;

      const organizationRepository = new OrganizationRepository(context.db);
      const groupRepository = new GroupRepository(context.db);

      const { succeeded, failed } = await inviteUsersToOrganization({
        organizationRepository,
        users,
        organizationId,
        context
      });

      const succeededUsers = succeeded.map((member) => member.user);
      if (groupIds && groupIds.length > 0) {
        const userIds = succeededUsers.map((user) => user.id);
        await inviteUsersToGroups({
          groupRepository,
          organizationId,
          groupIds,
          userIds,
          context
        });
      }
      const organization = await organizationRepository.getOrganizationById({ organizationId });
      if (!organization) {
        throw new Error(`Organization does not exist with id: ${organizationId}`);
      }
      const notSignedUpUsers = succeededUsers.filter((user) => !user.accountCreated);
      const signedUpUsers = succeededUsers.filter((user) => user.accountCreated);

      const completeSignupNotifications = notSignedUpUsers.map((user) => {
        const token = tokenService.create(user);
        return new EmailNotification(
          emailService,
          [user.email],
          `You have been invited to the organization: ${organization.name}. Visit the link below to complete signup: \n`,
          "Complete Signup",
          `http://${process.env.CLIENT_URL}/completeSignup?token=${token}`
        );
      });

      const invitedToOrgNotifications = signedUpUsers.map((user) => {
        const emailNotification = new EmailNotification(
          emailService,
          [user.email],
          `You have been invited to the organization: ${organization.name}. Open the app to respond to invitation: \n`,
          `Invitation to ${organization.name}`
        );
        return emailNotification;
      });

      const notifications = [...completeSignupNotifications, ...invitedToOrgNotifications];

      await sendNotifications({
        context,
        notifications
      });
      if (failed.length > 0) {
        throw new Error("failed to invite 1 or more users");
      }
      return succeeded;
    },
    updateOrgInvite: async (parent, args, context) => {
      const { organizationId, status } = args;
      const organizationRepository = new OrganizationRepository(context.db);
      const organizationMember = await organizationRepository.updateOrgInvite({
        userId: context.user!.id,
        status,
        organizationId
      });
      if (!organizationMember) {
        throw new Error("Not a valid invitation response");
      }
      return organizationMember;
    },
    removeFromOrganization: async (parent, args, context) => {
      const { userIds, organizationId } = args;
      const organizationRepository = new OrganizationRepository(context.db);
      const { succeeded, failed } = await removeUsersFromOrganization({
        organizationRepository,
        userIds,
        organizationId,
        context
      });
      if (failed.length > 0) {
        throw new Error("Failed to remove 1 or more members");
      }
      return succeeded;
    },
    createOrganizationAnnouncement: async (parent, args, context) => {
      const { title, description, organizationId, groupIds } = args;
      const organizationRepository = new OrganizationRepository(context.db);
      const groupRepository = new GroupRepository(context.db);
      const announcement = await organizationRepository.createOrganizationAnnouncement({
        organizationId,
        title,
        description,
        userId: context.user!.id
      });
      const organization = await organizationRepository.getOrgWithAcceptedMembers({
        organizationId
      });
      if (!organization) {
        throw new Error(`No organization exists with id: ${organizationId}`);
      }
      let users: User[] = organization.members.map((member) => member.user);
      const notificationDetails = {
        subject: `Announcement - ${announcement.title}`,
        message: announcement.description || ""
      };

      if (groupIds && groupIds.length > 0) {
        users = await groupRepository.getAcceptedUsersByGroupIds({
          groupIds
        });
      }
      if (organization.notificationSetting) {
        const notifications = createOrganizationNotifications({
          emailService,
          pushNotificationService,
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
      const { announcementId } = args;
      const organizationRepository = new OrganizationRepository(context.db);
      const annnouncement = await organizationRepository.deleteOrganizationAnnouncement({
        announcementId
      });
      return annnouncement;
    }
  }
};

export default OrganizationResolver;
