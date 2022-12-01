import {
  EvacuationEvent,
  Organization,
  OrganizationMember,
  PrismaClient,
  User
} from "@prisma/client";
import TokenService from "../../dist/services/TokenService";
import { GroupMember } from "../types";
import EmailService from "./EmailService";
import PushNotificationService from "./PushNotificationService";

interface SendAlertNotifications {
  db: PrismaClient;
  evacuationEvent: EvacuationEvent;
}

interface SendCompleteSignupNotifications {
  db: PrismaClient;
  members: Array<
    OrganizationMember & {
      user: User;
      organization: Organization;
    }
  >;
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

const sendGroupNotification = async (
  group: any,
  users: User[],
  subject: string,
  message: string
) => {
  if (group?.notificationSetting?.emailEnabled) {
    await emailService.sendEmail(users, subject, message);
  }
  if (group?.notificationSetting?.pushEnabled) {
    await pushNotificationService.sendNotifications(users, message);
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
  const appLink = `${process.env.APP_LINK}/group/${evacuationEvent.groupId}/evacuation/${evacuationEvent.id}`;
  const message = `Evacuation issued for ${group.name} please visit ${appLink} for more information`;

  await sendGroupNotification(group, users, subject, message);
};

export const sendAlertEndedNotification = async (
  data: SendAlertNotifications
) => {
  const { db, evacuationEvent } = data;

  const group = await getGroup(db, evacuationEvent.groupId);
  const users = group?.members.map((member) => member.user);

  if (!users || users.length === 0 || !group) {
    return;
  }

  const subject = "Evacuation status pdate: safe to return";
  const message = `Evacuation for ${group.name} has ended, it is now safe to return`;

  await sendGroupNotification(group, users, subject, message);
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

export const sendCompleteSignupNotifications = async (
  data: SendCompleteSignupNotifications
) => {
  const { db, members } = data;
  const membersToEmail = members.filter(
    (member) => !member.user.accountCreated
  );
  await Promise.all(
    membersToEmail.map(async (member) => {
      await sendCompleteSignupNotification(member.user, member.organization);
    })
  );
};

const sendCompleteSignupNotification = async (
  user: User,
  organization: Organization
) => {
  const token = tokenService.create(user);
  const signupLink = `${process.env.CLIENT_URL}/completeSignup?token=${token}`;
  await emailService.sendEmail(
    [user],
    "Complete Signup",
    `You have been invited to the organization: ${organization.name}. Visit the link below to complete signup: \n ${signupLink}`
  );
};

export const sendOrgAnnouncementNotification = () => {};
