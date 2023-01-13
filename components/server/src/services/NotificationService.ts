import {
  Announcement,
  EvacuationEvent,
  Organization,
  OrganizationMember,
  PrismaClient,
  User
} from "@prisma/client";
import TokenService from "../../dist/services/TokenService";
import EmailService from "./EmailService";
import PushNotificationService from "./PushNotificationService";

interface SendAlertNotifications {
  db: PrismaClient;
  evacuationEvent: EvacuationEvent;
}

interface SendAnnouncementNotification {
  db: PrismaClient;
  announcement: Announcement;
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

export const sendAnnouncementNotification = async (
  data: SendAnnouncementNotification
) => {
  const { db, announcement } = data;
  const organization = await getOrganization(db, announcement.organizationId);
  const users = organization?.members.map((member) => member.user);

  if (!users || users.length === 0 || !organization) {
    return;
  }
  const subject = `Announcement - ${announcement.title}`;
  // const appLink = `${process.env.APP_LINK}group/${evacuationEvent.groupId}/evacuation/${evacuationEvent.id}`;

  if (organization?.notificationSetting?.emailEnabled) {
    await emailService.sendEmail(
      users,
      subject,
      announcement.description || ""
    );
  }
  if (organization?.notificationSetting?.pushEnabled) {
    await pushNotificationService.sendNotifications(
      users,
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

  if (group?.notificationSetting?.emailEnabled) {
    await emailService.sendEmail(users, subject, message, appLink);
  }
  if (group?.notificationSetting?.pushEnabled) {
    await pushNotificationService.sendNotifications(users, message, appLink);
  }
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

  const subject = "Evacuation status update: safe to return";
  const message = `Evacuation for ${group.name} has ended, it is now safe to return`;
  const appLink = `${process.env.APP_LINK}group/${evacuationEvent.groupId}/evacuation/${evacuationEvent.id}`;

  if (group?.notificationSetting?.emailEnabled) {
    await emailService.sendEmail(users, subject, message);
  }
  if (group?.notificationSetting?.pushEnabled) {
    await pushNotificationService.sendNotifications(users, message, appLink);
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

  console.log(signupLink);
  await emailService.sendEmail(
    [user],
    "Complete Signup",
    `You have been invited to the organization: ${organization.name}. Visit the link below to complete signup: \n ${signupLink}`
  );
};
