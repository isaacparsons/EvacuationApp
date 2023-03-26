import { User, OrganizationNotificationSetting, OrganizationMember } from "@prisma/client";
import EmailService from "./EmailService";
import PushNotificationService from "./PushNotificationService";
import { INotification, NotificationDetails } from "../services/NotificationService";
import { EmailNotification, PushNotification } from "./NotificationService";
import OrganizationRepository from "../db/organization";
import { InvitedOrganizationUser } from "../generated/graphql";
import { Context } from "../context";
import doesAlreadyExistError from "../util/doesAlreadyExistError";

export const createOrganizationNotifications = (data: {
  emailService: EmailService;
  pushNotificationService: PushNotificationService;
  users: User[];
  notificationSettings: OrganizationNotificationSetting;
  notificationDetails: NotificationDetails;
}) => {
  const {
    emailService,
    users,
    notificationSettings,
    notificationDetails,
    pushNotificationService
  } = data;
  const notifications: INotification[] = [];
  if (notificationSettings?.emailEnabled) {
    const userEmails = users.map((user) => user.email);
    const emailNotification = new EmailNotification(
      emailService,
      userEmails,
      notificationDetails.message,
      notificationDetails.subject
    );
    notifications.push(emailNotification);
  }
  if (notificationSettings?.pushEnabled) {
    const userIds = users.map((user) => user.id.toString());
    const pushNotification = new PushNotification(
      pushNotificationService,
      userIds,
      notificationDetails.message,
      notificationDetails.appLink
    );
    notifications.push(pushNotification);
  }
  return notifications;
};

export const inviteUsersToOrganization = async (data: {
  organizationRepository: OrganizationRepository;
  users: InvitedOrganizationUser[];
  organizationId: number;
  context: Context;
}) => {
  const { organizationRepository, users, organizationId, context } = data;
  const succeeded: Array<OrganizationMember & { user: User }> = [];
  const failed: string[] = [];

  await Promise.all(
    users.map(async (user) => {
      try {
        const member = await organizationRepository.createOrganizationMember({
          organizationId,
          admin: user.admin,
          email: user.email
        });

        succeeded.push(member);
      } catch (error) {
        if (!doesAlreadyExistError(error)) {
          context.log.error(
            `Failed to add member with email: ${user.email} to organization: ${organizationId}`,
            error
          );
          failed.push(user.email);
        }
      }
    })
  );
  return { succeeded, failed };
};

export const removeUsersFromOrganization = async (data: {
  organizationRepository: OrganizationRepository;
  userIds: number[];
  organizationId: number;
  context: Context;
}) => {
  const { organizationRepository, userIds, organizationId, context } = data;
  const succeeded: Array<OrganizationMember & { user: User }> = [];
  const failed: number[] = [];
  await Promise.all(
    userIds.map(async (userId) => {
      try {
        const member = await organizationRepository.removeFromOrganization({
          organizationId,
          userId
        });
        succeeded.push(member);
      } catch (error) {
        context.log.error(
          `Failed to remove member with userId: ${userId} from organization: ${organizationId}`,
          error
        );
        failed.push(userId);
      }
    })
  );
  return { succeeded, failed };
};
