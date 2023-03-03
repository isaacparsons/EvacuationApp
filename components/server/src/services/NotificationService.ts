import {
  Announcement,
  EvacuationEvent,
  Group,
  Organization,
  OrganizationNotificationSetting,
  User,
  GroupNotificationSetting
} from "@prisma/client";

import { Context } from "../context";
import EmailService from "./EmailService";
import PushNotificationService from "./PushNotificationService";
import TokenService from "./TokenService";

const emailService = new EmailService();
const pushNotificationService = new PushNotificationService();
const tokenService = new TokenService();

export enum NotificationType {
  EMAIL = "email",
  PUSH = "push"
}

export interface Notification {
  type: NotificationType;
  users: User[];
  content: NotificationDetails;
}

export interface NotificationDetails {
  subject: string;
  message: string;
  appLink?: string;
  signupLink?: string;
}

export const sendNotifications = async (data: {
  context: Context;
  notifications: Notification[];
}) => {
  const { context, notifications } = data;
  await Promise.all(
    notifications.map(async (notification) => {
      try {
        if (notification.type === "email") {
          await emailService.sendEmail(
            notification.users,
            notification.content.subject,
            notification.content.message,
            notification.content.signupLink
          );
        }
        if (notification.type === "push") {
          await pushNotificationService.sendNotifications(
            notification.users,
            notification.content.message,
            notification.content.appLink
          );
        }
      } catch (error) {
        context.log.error({ notification }, `Failed to send notification`);
      }
    })
  );
};

export const createOrganizationNotifications = (data: {
  users: User[];
  notificationSettings: OrganizationNotificationSetting;
  notificationDetails: NotificationDetails;
}) => {
  const { users, notificationSettings, notificationDetails } = data;
  const notifications: Notification[] = [];
  if (notificationSettings.emailEnabled) {
    notifications.push({
      users,
      type: NotificationType.EMAIL,
      content: notificationDetails
    });
  }
  if (notificationSettings.pushEnabled) {
    notifications.push({
      users,
      type: NotificationType.PUSH,
      content: notificationDetails
    });
  }
  return notifications;
};

export const createGroupNotifications = (data: {
  users: User[];
  notificationSettings: GroupNotificationSetting;
  notificationDetails: NotificationDetails;
}) => {
  const { users, notificationSettings, notificationDetails } = data;
  const notifications: Notification[] = [];
  if (notificationSettings.emailEnabled) {
    notifications.push({
      users,
      type: NotificationType.EMAIL,
      content: notificationDetails
    });
  }
  if (notificationSettings.pushEnabled) {
    notifications.push({
      users,
      type: NotificationType.PUSH,
      content: notificationDetails
    });
  }
  return notifications;
};

export const createAnnouncementNotification = (data: { announcement: Announcement }) => {
  const { announcement } = data;

  return {
    subject: `Announcement - ${announcement.title}`,
    message: announcement.description || ""
  };
};

export const createAlertNotification = (data: {
  evacuationEvent: EvacuationEvent;
  group: Group;
}) => {
  const { group, evacuationEvent } = data;

  return {
    subject: "Evacuation Alert!",
    message: `Evacuation issued for ${group.name} \n message: ${evacuationEvent.message}`,
    appLink: `${process.env.APP_LINK}group/${evacuationEvent.groupId}/evacuation/${evacuationEvent.id}`
  };
};

export const createAlertEndedNotification = (data: {
  evacuationEvent: EvacuationEvent;
  group: Group;
}) => {
  const { group, evacuationEvent } = data;

  return {
    subject: "Evacuation status update: safe to return",
    message: `Evacuation for ${group.name} has ended, it is now safe to return`,
    appLink: `${process.env.APP_LINK}group/${evacuationEvent.groupId}/evacuation/${evacuationEvent.id}`
  };
};

export const createPasswordResetNotification = (data: { user: User }) => {
  const { user } = data;
  const token = tokenService.create(user);
  const resetLink = `${process.env.CLIENT_URL}/changePassword?token=${token}`;
  return {
    subject: "Reset Password",
    message: `Visit the link below to reset your password: \n ${resetLink}`
  };
};

export const createCompleteSignupNotification = (data: {
  user: User;
  organization: Organization;
}) => {
  const { user, organization } = data;
  const token = tokenService.create(user);
  const signupLink = `http://${process.env.CLIENT_URL}/completeSignup?token=${token}`;

  return {
    subject: "Complete Signup",
    message: `You have been invited to the organization: ${organization.name}. Visit the link below to complete signup: \n`,
    signupLink
  };
};

export const createInvitedToOrgNotification = (data: { organization: Organization }) => {
  const { organization } = data;

  return {
    subject: `Invitation to ${organization.name}`,
    message: `You have been invited to the organization: ${organization.name}. Open the app to respond to invitation: \n`
  };
};
