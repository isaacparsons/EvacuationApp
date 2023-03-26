import { User, GroupNotificationSetting, GroupMember } from "@prisma/client";
import EmailService from "./EmailService";
import PushNotificationService from "./PushNotificationService";
import { INotification, NotificationDetails } from "../services/NotificationService";
import GroupRepository from "../db/group";
import { Context } from "../context";
import { AddGroupUser } from "../generated/graphql";
export declare const createGroupNotifications: (data: {
    emailService: EmailService;
    pushNotificationService: PushNotificationService;
    users: User[];
    notificationSettings: GroupNotificationSetting;
    notificationDetails: NotificationDetails;
}) => INotification[];
export declare const addUsersToGroup: (data: {
    groupRepository: GroupRepository;
    users: AddGroupUser[];
    groupId: number;
    organizationId: number;
    context: Context;
}) => Promise<{
    succeeded: GroupMember[];
    failed: number[];
}>;
export declare const inviteUsersToGroups: (data: {
    groupRepository: GroupRepository;
    organizationId: number;
    groupIds: number[];
    userIds: number[];
    context: Context;
}) => Promise<void>;
export declare const removeUsersFromGroup: (data: {
    groupRepository: GroupRepository;
    groupId: number;
    userIds: number[];
    context: Context;
}) => Promise<{
    succeeded: GroupMember[];
    failed: number[];
}>;
