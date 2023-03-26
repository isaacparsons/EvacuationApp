import { User } from "@prisma/client";

import { Context } from "../context";
import EmailService from "./EmailService";
import PushNotificationService from "./PushNotificationService";

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
  emailLink?: string;
}

export const sendNotifications = async (data: {
  context: Context;
  notifications: INotification[];
}) => {
  const { context, notifications } = data;
  await Promise.all(
    notifications.map(async (notification) => {
      try {
        return notification.send();
      } catch (error) {
        context.log.error(`Failed to send notification`);
      }
    })
  );
};

export interface INotification {
  send: () => Promise<void>;
}

export class EmailNotification implements INotification {
  emailService: EmailService;
  userEmails: string[];
  message: string;
  subject: string;
  emailLink?: string;

  constructor(
    emailService: EmailService,
    userEmails: string[],
    message: string,
    subject: string,
    emailLink?: string
  ) {
    this.emailService = emailService;
    this.userEmails = userEmails;
    this.subject = subject;
    this.message = message;
    this.emailLink = emailLink;
  }

  send() {
    return this.emailService.sendEmail(this.userEmails, this.subject, this.message, this.emailLink);
  }
}

export class PushNotification implements INotification {
  pushNotificationService: PushNotificationService;
  userIds: string[];
  message: string;
  app_url?: string;

  constructor(
    pushNotificationService: PushNotificationService,
    userIds: string[],
    message: string,
    app_url?: string
  ) {
    this.pushNotificationService = pushNotificationService;
    this.userIds = userIds;
    this.message = message;
    this.app_url = app_url;
  }

  send() {
    return this.pushNotificationService.sendNotifications(this.userIds, this.message, this.app_url);
  }
}
