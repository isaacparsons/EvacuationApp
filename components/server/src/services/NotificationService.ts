import {
  Announcement,
  EvacuationEvent,
  Group,
  Organization,
  OrganizationMember,
  OrganizationNotificationSetting,
  PrismaClient,
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

export interface NotificationDetails {
  subject: string;
  message: string;
  appLink?: string;
}

export const sendOrganizationNotifications = async (
  notificationSettings: OrganizationNotificationSetting,
  users: User[],
  notification: NotificationDetails
) => {
  if (notificationSettings.emailEnabled) {
    await emailService.sendEmail(users, notification.subject, notification.message);
  }
  if (notificationSettings.pushEnabled) {
    await pushNotificationService.sendNotifications(
      users,
      notification.message,
      notification.appLink
    );
  }
};

export const sendGroupNotifications = async (
  notificationSettings: GroupNotificationSetting,
  users: User[],
  notification: NotificationDetails
) => {
  if (notificationSettings.emailEnabled) {
    await emailService.sendEmail(users, notification.subject, notification.message);
  }
  if (notificationSettings.pushEnabled) {
    await pushNotificationService.sendNotifications(
      users,
      notification.message,
      notification.appLink
    );
  }
};

export const createAnnouncementNotification = async (data: { announcement: Announcement }) => {
  const { announcement } = data;

  return {
    subject: `Announcement - ${announcement.title}`,
    message: announcement.description || ""
  };
};
// export const sendAnnouncementNotification = async (data: {
//   announcement: Announcement;
//   users: User[];
//   notificationSetting: OrganizationNotificationSetting;
//   groupIds?: number[] | null;
// }) => {
//   const { users, notificationSetting, announcement } = data;

//   const subject = `Announcement - ${announcement.title}`;
//   // const appLink = `${process.env.APP_LINK}group/${evacuationEvent.groupId}/evacuation/${evacuationEvent.id}`;

//   await sendOrganizationNotifications(
//     notificationSetting,
//     users,
//     subject,
//     announcement.description || ""
//   );
// };

export const createAlertNotification = async (data: {
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

// export const sendAlertNotification = async (data: {
//   users: User[];
//   evacuationEvent: EvacuationEvent;
//   group: Group;
//   notificationSetting: GroupNotificationSetting;
// }) => {
//   const { group, users, evacuationEvent, notificationSetting } = data;

//   const subject = "Evacuation Alert!";
//   const appLink = `${process.env.APP_LINK}group/${evacuationEvent.groupId}/evacuation/${evacuationEvent.id}`;
//   const message = `Evacuation issued for ${group.name} \n message: ${evacuationEvent.message}`;

//   await sendGroupNotifications(notificationSetting, users, subject, message, appLink);
// };

export const createAlertEndedNotification = async (data: {
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

// export const sendAlertEndedNotification = async (data: {
//   users: User[];
//   evacuationEvent: EvacuationEvent;
//   group: Group;
//   notificationSetting: GroupNotificationSetting;
// }) => {
//   const { group, users, evacuationEvent, notificationSetting } = data;

//   const subject = "Evacuation status update: safe to return";
//   const message = `Evacuation for ${group.name} has ended, it is now safe to return`;
//   const appLink = `${process.env.APP_LINK}group/${evacuationEvent.groupId}/evacuation/${evacuationEvent.id}`;

//   await sendGroupNotifications(notificationSetting, users, subject, message, appLink);
// };

export const sendPasswordResetNotification = async (user: User) => {
  const token = tokenService.create(user);
  const resetLink = `${process.env.CLIENT_URL}/changePassword?token=${token}`;
  await emailService.sendEmail(
    [user],
    "Reset Password",
    `Visit the link below to reset your password: \n ${resetLink}`
  );
};

export const sendCompleteSignupNotifications = async (data: {
  context: Context;
  organization: Organization;
  users: User[];
}) => {
  const { organization, users, context } = data;

  await Promise.all(
    users.map(async (user) => {
      try {
        await sendCompleteSignupNotification(user, organization);
      } catch (error) {
        context.log.error(`Failed to send complete signup email to user with email: ${user.email}`);
      }
    })
  );
};

const sendCompleteSignupNotification = async (user: User, organization: Organization) => {
  const token = tokenService.create(user);
  const signupLink = `http://${process.env.CLIENT_URL}/completeSignup?token=${token}`;

  await emailService.sendEmail(
    [user],
    "Complete Signup",
    `You have been invited to the organization: ${organization.name}. Visit the link below to complete signup: \n`,
    signupLink
  );
};
