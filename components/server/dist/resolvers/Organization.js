"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NotificationService_1 = require("../services/NotificationService");
const EmailService_1 = __importDefault(require("../services/EmailService"));
const PushNotificationService_1 = __importDefault(require("../services/PushNotificationService"));
const organization_1 = __importDefault(require("../db/organization"));
const group_1 = __importDefault(require("../db/group"));
const NotificationService_2 = require("../services/NotificationService");
const TokenService_1 = __importDefault(require("../services/TokenService"));
const GroupService_1 = require("../services/GroupService");
const OrganizationService_1 = require("../services/OrganizationService");
const OrganizationService_2 = require("../services/OrganizationService");
const tokenService = new TokenService_1.default();
const emailService = new EmailService_1.default();
const pushNotificationService = new PushNotificationService_1.default();
const OrganizationResolver = {
    Query: {
        getOrganizations: async (parent, args, context) => {
            const organizationRepository = new organization_1.default(context.db);
            const organizations = organizationRepository.getOrganizationsForUser({
                userId: context.user.id
            });
            return organizations;
        },
        getOrganization: async (parent, args, context) => {
            const { organizationId } = args;
            const organizationRepository = new organization_1.default(context.db);
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
            const organizationRepository = new organization_1.default(context.db);
            const groupRepository = new group_1.default(context.db);
            const organization = await organizationRepository.getOrganizationForUser({
                organizationId,
                userId: context.user.id
            });
            if (!organization) {
                throw new Error(`Organization with id: ${organizationId} does not exist`);
            }
            const groups = await groupRepository.getGroupsForUserInOrganization({
                userId: context.user.id,
                organizationId
            });
            return Object.assign(Object.assign({}, organization), { groups });
        },
        getOrganizationMembers: async (parent, args, context) => {
            const { organizationId, cursor } = args;
            const organizationRepository = new organization_1.default(context.db);
            const members = await organizationRepository.getOrganizationMembers({
                organizationId,
                cursor
            });
            return members;
        },
        getAnnouncements: async (parent, args, context) => {
            const { organizationId, cursor } = args;
            const organizationRepository = new organization_1.default(context.db);
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
            const organizationRepository = new organization_1.default(context.db);
            const organization = await organizationRepository.createOrganization({
                name,
                organizationNotificationSetting,
                userId: context.user.id
            });
            return organization;
        },
        deleteOrganization: async (parent, args, context) => {
            const { organizationId } = args;
            const organizationRepository = new organization_1.default(context.db);
            const organization = await organizationRepository.deleteOrganization({
                organizationId
            });
            return organization;
        },
        updateOrganizationNotificationOptions: async (parent, args, context) => {
            const { organizationId, organizationNotificationSetting } = args;
            const organizationRepository = new organization_1.default(context.db);
            const organization = await organizationRepository.updateOrganizationNotificationOptions({
                organizationId,
                organizationNotificationSetting
            });
            return organization;
        },
        inviteToOrganization: async (parent, args, context) => {
            const { users, organizationId, groupIds } = args;
            const organizationRepository = new organization_1.default(context.db);
            const groupRepository = new group_1.default(context.db);
            const { succeeded, failed } = await (0, OrganizationService_2.inviteUsersToOrganization)({
                organizationRepository,
                users,
                organizationId,
                context
            });
            const succeededUsers = succeeded.map((member) => member.user);
            if (groupIds && groupIds.length > 0) {
                const userIds = succeededUsers.map((user) => user.id);
                await (0, GroupService_1.inviteUsersToGroups)({
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
                return new NotificationService_1.EmailNotification(emailService, [user.email], `You have been invited to the organization: ${organization.name}. Visit the link below to complete signup: \n`, "Complete Signup", `${process.env.CLIENT_URL}/completeSignup?token=${token}`);
            });
            const invitedToOrgNotifications = signedUpUsers.map((user) => {
                const emailNotification = new NotificationService_1.EmailNotification(emailService, [user.email], `You have been invited to the organization: ${organization.name}. Open the app to respond to invitation: \n`, `Invitation to ${organization.name}`);
                return emailNotification;
            });
            const notifications = [...completeSignupNotifications, ...invitedToOrgNotifications];
            await (0, NotificationService_2.sendNotifications)({
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
            const organizationRepository = new organization_1.default(context.db);
            const organizationMember = await organizationRepository.updateOrgInvite({
                userId: context.user.id,
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
            const organizationRepository = new organization_1.default(context.db);
            const { succeeded, failed } = await (0, OrganizationService_1.removeUsersFromOrganization)({
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
            const organizationRepository = new organization_1.default(context.db);
            const groupRepository = new group_1.default(context.db);
            const announcement = await organizationRepository.createOrganizationAnnouncement({
                organizationId,
                title,
                description,
                userId: context.user.id
            });
            const organization = await organizationRepository.getOrgWithAcceptedMembers({
                organizationId
            });
            if (!organization) {
                throw new Error(`No organization exists with id: ${organizationId}`);
            }
            let users = organization.members.map((member) => member.user);
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
                const notifications = (0, OrganizationService_2.createOrganizationNotifications)({
                    emailService,
                    pushNotificationService,
                    users,
                    notificationSettings: organization.notificationSetting,
                    notificationDetails
                });
                await (0, NotificationService_2.sendNotifications)({
                    context,
                    notifications
                });
            }
            return announcement;
        },
        deleteOrganizationAnnouncement: async (parent, args, context) => {
            const { announcementId } = args;
            const organizationRepository = new organization_1.default(context.db);
            const annnouncement = await organizationRepository.deleteOrganizationAnnouncement({
                announcementId
            });
            return annnouncement;
        }
    }
};
exports.default = OrganizationResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3JnYW5pemF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Jlc29sdmVycy9Pcmdhbml6YXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSx5RUFBb0U7QUFFcEUsNEVBQW9EO0FBQ3BELGtHQUEwRTtBQUMxRSxzRUFBd0Q7QUFDeEQsd0RBQTBDO0FBRTFDLHlFQUFvRTtBQUNwRSw0RUFBb0Q7QUFDcEQsMkRBQStEO0FBQy9ELHlFQUE4RTtBQUM5RSx5RUFHeUM7QUFFekMsTUFBTSxZQUFZLEdBQUcsSUFBSSxzQkFBWSxFQUFFLENBQUM7QUFDeEMsTUFBTSxZQUFZLEdBQUcsSUFBSSxzQkFBWSxFQUFFLENBQUM7QUFDeEMsTUFBTSx1QkFBdUIsR0FBRyxJQUFJLGlDQUF1QixFQUFFLENBQUM7QUFFOUQsTUFBTSxvQkFBb0IsR0FBYztJQUN0QyxLQUFLLEVBQUU7UUFDTCxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsRUFBRTtZQUNoRCxNQUFNLHNCQUFzQixHQUFHLElBQUksc0JBQXNCLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3RFLE1BQU0sYUFBYSxHQUFHLHNCQUFzQixDQUFDLHVCQUF1QixDQUFDO2dCQUNuRSxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUssQ0FBQyxFQUFFO2FBQ3pCLENBQUMsQ0FBQztZQUNILE9BQU8sYUFBYSxDQUFDO1FBQ3ZCLENBQUM7UUFDRCxlQUFlLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUU7WUFDL0MsTUFBTSxFQUFFLGNBQWMsRUFBRSxHQUFHLElBQUksQ0FBQztZQUNoQyxNQUFNLHNCQUFzQixHQUFHLElBQUksc0JBQXNCLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3RFLE1BQU0sWUFBWSxHQUFHLE1BQU0sc0JBQXNCLENBQUMsZUFBZSxD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