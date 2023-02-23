import {
  Announcement,
  EvacuationEvent,
  Organization,
  OrganizationMember,
  OrganizationNotificationSetting,
  PrismaClient,
  User
} from "@prisma/client";

import { GroupNotificationSetting } from "../generated/graphql";
import { Context } from "../server";
import EmailService from "./EmailService";
import PushNotificationService from "./PushNotificationService";
import TokenService from "./TokenService";

interface SendAlertNotifications {
  db: PrismaClient;
  evacuationEvent: EvacuationEvent;
}

const emailService = new EmailService();
const pushNotificationService = new PushNotificationService();
const tokenService = new TokenService();

const getGroup = async (db: PrismaClient, groupId: number) => {
  return db.group.findUnique({
    where: {
      id: groupId
    },
    include: {
      notificationSetting: true,
      members: {
        include: {
          user: true
        }
      }
    }
  });
};

const getOrganization = async (db: PrismaClient, organizationId: number) => {
  return db.organization.findUnique({
    where: {
      id: organizationId
    },
    include: {
      notificationSetting: true,
      members: {
        where: {
          status: "accepted"
        },
        include: {
          user: true
        }
      }
    }
  });
};

const getGroupMembersByGroupIds = async (db: PrismaClient, groupIds: number[]) => {
  const groups = await Promise.all(
    groupIds.map(async (groupId) => {
      return db.group.findUnique({
        where: {
          id: groupId
        },
        include: {
          members: {
            include: {
              user: true
            }
          }
        }
      });
    })
  );
  const users = groups.reduce((prev, group) => {
    const groupUsers = group?.members.map((member) => member.user) ?? [];
    return [...prev, ...groupUsers];
  }, []);
  return users;
};

const sendOrganizationNotifications = async (
  notificationSettings: OrganizationNotificationSetting,
  users: User[],
  subject: string,
  message: string,
  appLink?: string
) => {
  if (notificationSettings.emailEnabled) {
    await emailService.sendEmail(users, subject, message);
  }
  if (notificationSettings.pushEnabled) {
    await pushNotificationService.sendNotifications(users, message, appLink);
  }
};

const sendGroupNotifications = async (
  notificationSettings: GroupNotificationSetting,
  users: User[],
  subject: string,
  message: string,
  appLink?: string
) => {
  if (notificationSettings.emailEnabled) {
    await emailService.sendEmail(users, subject, message);
  }
  if (notificationSettings.pushEnabled) {
    await pushNotificationService.sendNotifications(users, message, appLink);
  }
};

export const sendAnnouncementNotification = async (data: {
  db: PrismaClient;
  announcement: Announcement;
  groupIds?: number[] | null;
}) => {
  const { db, announcement, groupIds } = data;
  const organization = await getOrganization(db, announcement.organizationId);
  let users: User[] = [];
  if (groupIds) {
    users = await getGroupMembersByGroupIds(db, groupIds);
  } else {
    users = organization?.members.map((member) => member.user) ?? [];
  }

  if (!users || users.length === 0 || !organization) {
    return;
  }
  const subject = `Announcement - ${announcement.title}`;
  // const appLink = `${process.env.APP_LINK}group/${evacuationEvent.groupId}/evacuation/${evacuationEvent.id}`;

  if (organization?.notificationSetting) {
    await sendOrganizationNotifications(
      organization?.notificationSetting,
      users,
      subject,
      announcement.description || ""
    );
  }
};

export const sendAlertNotification = async (data: SendAlertNotifications) => {
  const { db, evacuationEvent } = data;

  const group = await getGroup(db, evacuationEvent.groupId);
  const users = group?.members.map((member) => member.user);

  if (!users || users.length === 0 || !group) {
    return;
  }
  const subject = "Evacuation Alert!";
  const appLink = `${process.env.APP_LINK}group/${evacuationEvent.groupId}/evacuation/${evacuationEvent.id}`;
  const message = `Evacuation issued for ${group.name} \n message: ${evacuationEvent.message}`;

  if (group?.notificationSetting) {
    await sendGroupNotifications(group?.notificationSetting, users, subject, message, appLink);
  }
};

export const sendAlertEndedNotification = async (data: SendAlertNotifications) => {
  const { db, evacuationEvent } = data;

  const group = await getGroup(db, evacuationEvent.groupId);
  const users = group?.members.map((member) => member.user);

  if (!users || users.length === 0 || !group) {
    return;
  }

  const subject = "Evacuation status update: safe to return";
  const message = `Evacuation for ${group.name} has ended, it is now safe to return`;
  const appLink = `${process.env.APP_LINK}group/${evacuationEvent.groupId}/evacuation/${evacuationEvent.id}`;

  if (group?.notificationSetting) {
    await sendGroupNotifications(group?.notificationSetting, users, subject, message, appLink);
  }
};

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
  organizationId: number;
  members: Array<OrganizationMember & {
    user: User;
  }>;
}) => {
  const { members, organizationId, context } = data;

  const organization = await context.db.organization.findUnique({
    where: {
      id: organizationId
    }
  });

  if (!organization) {
    throw new Error(`Organization with id: ${organizationId} does not exist`);
  }

  await Promise.all(
    members.map(async (member) => {
      try {
        await sendCompleteSignupNotification(member.user, organization);
      } catch (error) {
        context.log.error(
          `Failed to send complete signup email to user with email: ${member.user.email}`
        );
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
