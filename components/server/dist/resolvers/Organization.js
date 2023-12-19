"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EmailService_1 = __importDefault(require("../services/EmailService"));
const PushNotificationService_1 = __importDefault(require("../services/PushNotificationService"));
const organization_1 = __importDefault(require("../db/organization"));
const group_1 = __importDefault(require("../db/group"));
const NotificationService_1 = require("../services/NotificationService");
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
            // const completeSignupNotifications = notSignedUpUsers.map((user) => {
            //   const token = tokenService.create(user);
            //   return new EmailNotification(
            //     emailService,
            //     [user.email],
            //     `You have been invited to the organization: ${organization.name}. Visit the link below to complete signup: \n`,
            //     "Complete Signup",
            //     `${process.env.CLIENT_URL}/completeSignup?token=${token}`
            //   );
            // });
            // const invitedToOrgNotifications = signedUpUsers.map((user) => {
            //   const emailNotification = new EmailNotification(
            //     emailService,
            //     [user.email],
            //     `You have been invited to the organization: ${organization.name}. Open the app to respond to invitation: \n`,
            //     `Invitation to ${organization.name}`
            //   );
            //   return emailNotification;
            // });
            // const notifications = [...completeSignupNotifications, ...invitedToOrgNotifications];
            // await sendNotifications({
            //   context,
            //   notifications
            // });
            // if (failed.length > 0) {
            //   throw new Error("failed to invite 1 or more users");
            // }
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
                message: announcement.description || "",
                appLink: `${process.env.APP_LINK}organization/${organizationId}/announcements`
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
                await (0, NotificationService_1.sendNotifications)({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3JnYW5pemF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Jlc29sdmVycy9Pcmdhbml6YXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFHQSw0RUFBb0Q7QUFDcEQsa0dBQTBFO0FBQzFFLHNFQUF3RDtBQUN4RCx3REFBMEM7QUFFMUMseUVBQW9FO0FBQ3BFLDRFQUFvRDtBQUNwRCwyREFBK0Q7QUFDL0QseUVBQThFO0FBQzlFLHlFQUd5QztBQUV6QyxNQUFNLFlBQVksR0FBRyxJQUFJLHNCQUFZLEVBQUUsQ0FBQztBQUN4QyxNQUFNLFlBQVksR0FBRyxJQUFJLHNCQUFZLEVBQUUsQ0FBQztBQUN4QyxNQUFNLHVCQUF1QixHQUFHLElBQUksaUNBQXVCLEVBQUUsQ0FBQztBQUU5RCxNQUFNLG9CQUFvQixHQUFjO0lBQ3RDLEtBQUssRUFBRTtRQUNMLGdCQUFnQixFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFO1lBQ2hELE1BQU0sc0JBQXNCLEdBQUcsSUFBSSxzQkFBc0IsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDdEUsTUFBTSxhQUFhLEdBQUcsc0JBQXNCLENBQUMsdUJBQXVCLENBQUM7Z0JBQ25FLE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSyxDQUFDLEVBQUU7YUFDekIsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxhQUFhLENBQUM7UUFDdkIsQ0FBQztRQUNELGVBQWUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsRUFBRTtZQUMvQyxNQUFNLEVBQUUsY0FBYyxFQUFFLEdBQUcsSUFBSSxDQUFDO1lBQ2hDLE1BQU0sc0JBQXNCLEdBQUcsSUFBSSxzQkFBc0IsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDdEUsTUFBTSxZQUFZLEdBQUcsTUFBTSxzQkFBc0IsQ0FBQyxlQUFlLENBQUM7Z0JBQ2hFLGNB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