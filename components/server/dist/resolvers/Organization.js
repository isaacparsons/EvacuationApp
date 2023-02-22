"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NotificationService_1 = require("../services/NotificationService");
const OrganizationService_1 = require("../services/OrganizationService");
const GroupService_1 = require("../services/GroupService");
const OrganizationResolver = {
    Query: {
        getOrganizations: async (parent, args, context, info) => {
            const organizations = await (0, OrganizationService_1.getOrganizationsForUser)({
                context
            });
            return organizations;
        },
        getOrganization: async (parent, args, context, info) => {
            return (0, OrganizationService_1.getOrganization)(Object.assign({ context }, args));
        },
        getOrganizationForUser: async (parent, args, context, info) => {
            return (0, OrganizationService_1.getOrganizationForUser)(Object.assign({ context }, args));
        },
        getOrganizationMembers: async (parent, args, context, info) => {
            return (0, OrganizationService_1.getOrganizationMembers)(Object.assign({ context }, args));
        },
        getAnnouncements: async (parent, args, context, info) => {
            return (0, OrganizationService_1.getAnnouncements)(Object.assign({ context }, args));
        }
    },
    Mutation: {
        createOrganization: async (parent, args, context, info) => {
            const organization = await (0, OrganizationService_1.createOrganization)(Object.assign({ context }, args));
            return organization;
        },
        deleteOrganization: async (parent, args, context, info) => {
            const organization = await (0, OrganizationService_1.deleteOrganization)(Object.assign({ context }, args));
            return organization;
        },
        updateOrganizationNotificationOptions: async (parent, args, context, info) => {
            const organization = await (0, OrganizationService_1.updateOrganizationNotificationOptions)(Object.assign({ context }, args));
            return organization;
        },
        inviteToOrganization: async (parent, args, context, info) => {
            const { succeeded, failed } = await (0, OrganizationService_1.inviteToOrganization)(Object.assign({ context }, args));
            const userIds = succeeded.map((member) => member.userId);
            if (args.groupIds && args.groupIds.length > 0) {
                await (0, GroupService_1.addUsersToGroups)({
                    context,
                    organizationId: args.organizationId,
                    userIds,
                    groupIds: args.groupIds
                });
            }
            const membersToEmail = succeeded.filter((member) => !member.user.accountCreated);
            await (0, NotificationService_1.sendCompleteSignupNotifications)({
                context,
                organizationId: args.organizationId,
                members: membersToEmail
            });
            if (failed.length > 0) {
                throw new Error("failed to invite 1 or more users");
            }
            return succeeded;
        },
        updateOrgInvite: async (parent, args, context, info) => {
            const organizationMember = await (0, OrganizationService_1.updateOrgInvite)(Object.assign({ context }, args));
            return organizationMember;
        },
        removeFromOrganization: async (parent, args, context, info) => {
            const { succeeded, failed } = await (0, OrganizationService_1.removeFromOrganization)(Object.assign({ context }, args));
            if (failed.length > 0) {
                throw new Error("Failed to remove 1 or more members");
            }
            return succeeded;
        },
        createOrganizationAnnouncement: async (parent, args, context, info) => {
            const announcement = await (0, OrganizationService_1.createOrganizationAnnouncement)(Object.assign({ context }, args));
            await (0, NotificationService_1.sendAnnouncementNotification)({
                announcement,
                groupIds: args.groupIds,
                db: context.db
            });
            return announcement;
        },
        deleteOrganizationAnnouncement: async (parent, args, context, info) => {
            const organization = await (0, OrganizationService_1.deleteOrganizationAnnouncement)(Object.assign({ context }, args));
            return organization;
        }
    }
};
exports.default = OrganizationResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3JnYW5pemF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Jlc29sdmVycy9Pcmdhbml6YXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5RUFHeUM7QUFDekMseUVBY3lDO0FBRXpDLDJEQUE0RDtBQUc1RCxNQUFNLG9CQUFvQixHQUFjO0lBQ3RDLEtBQUssRUFBRTtRQUNMLGdCQUFnQixFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUN0RCxNQUFNLGFBQWEsR0FBRyxNQUFNLElBQUEsNkNBQXVCLEVBQUM7Z0JBQ2xELE9BQU87YUFDUixDQUFDLENBQUM7WUFDSCxPQUFPLGFBQWEsQ0FBQztRQUN2QixDQUFDO1FBQ0QsZUFBZSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUNyRCxPQUFPLElBQUEscUNBQWUsa0JBQ3BCLE9BQU8sSUFDSixJQUFJLEVBQ1AsQ0FBQztRQUNMLENBQUM7UUFDRCxzQkFBc0IsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDNUQsT0FBTyxJQUFBLDRDQUFzQixrQkFDM0IsT0FBTyxJQUNKLElBQUksRUFDUCxDQUFDO1FBQ0wsQ0FBQztRQUNELHNCQUFzQixFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUM1RCxPQUFPLElBQUEsNENBQXNCLGtCQUMzQixPQUFPLElBQ0osSUFBSSxFQUNQLENBQUM7UUFDTCxDQUFDO1FBQ0QsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQ3RELE9BQU8sSUFBQSxzQ0FBZ0Isa0JBQ3JCLE9BQU8sSUFDSixJ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