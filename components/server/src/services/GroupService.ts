import { User, GroupNotificationSetting, GroupMember } from "@prisma/client";

import EmailService from "./EmailService";
import PushNotificationService from "./PushNotificationService";
import { INotification, NotificationDetails } from "../services/NotificationService";
import { EmailNotification, PushNotification } from "./NotificationService";
import GroupRepository from "../db/group";
import { Context } from "../context";
import { AddGroupUser } from "../generated/graphql";

export const createGroupNotifications = (data: {
  emailService: EmailService;
  pushNotificationService: PushNotificationService;
  users: User[];
  notificationSettings: GroupNotificationSetting;
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

export const addUsersToGroup = async (data: {
  groupRepository: GroupRepository;
  users: AddGroupUser[];
  groupId: number;
  organizationId: number;
  context: Context;
}) => {
  const { groupRepository, users, groupId, organizationId, context } = data;
  const succeeded: GroupMember[] = [];
  const failed: number[] = [];
  await Promise.all(
    users.map(async (user) => {
      try {
        const groupMember = await groupRepository.createGroupMember({
          userId: user.userId,
          organizationId: organizationId,
          groupId,
          admin: user.admin
        });
        succeeded.push(groupMember);
        return groupMember;
      } catch (error) {
        failed.push(user.userId);
        context.log.error(`Unable to add user: ${user.userId} to group with id: ${groupId}`);
        throw error;
      }
    })
  );
  return { succeeded, failed };
};

export const inviteUsersToGroups = async (data: {
  groupRepository: GroupRepository;
  organizationId: number;
  groupIds: number[];
  userIds: number[];
  context: Context;
}) => {
  const { groupRepository, organizationId, groupIds, userIds, context } = data;
  await Promise.all(
    groupIds.map(async (groupId) => {
      await Promise.all(
        userIds.map(async (userId) => {
          try {
            await groupRepository.createGroupMember({
              userId,
              organizationId,
              groupId,
              admin: false
            });
          } catch (error) {
            context.log.error(`Unable to add user: ${userId} to group with id: ${groupId}`, error);
          }
        })
      );
    })
  );
};

export const removeUsersFromGroup = async (data: {
  groupRepository: GroupRepository;
  groupId: number;
  userIds: number[];
  context: Context;
}) => {
  const { userIds, groupRepository, groupId, context } = data;
  const succeeded: GroupMember[] = [];
  const failed: number[] = [];
  await Promise.all(
    userIds.map(async (userId) => {
      try {
        const member = await groupRepository.removeMember({
          userId,
          groupId
        });
        succeeded.push(member);
      } catch (error) {
        context.log.error(
          `Failed to remove member with userId: ${userId} from group: ${groupId}`,
          error
        );
        failed.push(userId);
      }
    })
  );
  return { succeeded, failed };
};
