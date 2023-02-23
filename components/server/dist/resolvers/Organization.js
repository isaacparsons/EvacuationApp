"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NotificationService_1 = require("../services/NotificationService");
const OrganizationService_1 = require("../services/OrganizationService");
const GroupService_1 = require("../services/GroupService");
const errors_1 = require("../util/errors");
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
                throw new errors_1.RequestError("failed to invite 1 or more users");
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
                throw new errors_1.RequestError("Failed to remove 1 or more members");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3JnYW5pemF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Jlc29sdmVycy9Pcmdhbml6YXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5RUFHeUM7QUFDekMseUVBY3lDO0FBR3pDLDJEQUE0RDtBQUM1RCwyQ0FBOEM7QUFFOUMsTUFBTSxvQkFBb0IsR0FBYztJQUN0QyxLQUFLLEVBQUU7UUFDTCxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDdEQsTUFBTSxhQUFhLEdBQUcsTUFBTSxJQUFBLDZDQUF1QixFQUFDO2dCQUNsRCxPQUFPO2FBQ1IsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxhQUFhLENBQUM7UUFDdkIsQ0FBQztRQUNELGVBQWUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDckQsT0FBTyxJQUFBLHFDQUFlLGtCQUNwQixPQUFPLElBQ0osSUFBSSxFQUNQLENBQUM7UUFDTCxDQUFDO1FBQ0Qsc0JBQXNCLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQzVELE9BQU8sSUFBQSw0Q0FBc0Isa0JBQzNCLE9BQU8sSUFDSixJQUFJLEVBQ1AsQ0FBQztRQUNMLENBQUM7UUFDRCxzQkFBc0IsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDNUQsT0FBTyxJQUFBLDRDQUFzQixrQkFDM0IsT0FBTyxJQUNKLElBQUksRUFDUCxDQUFDO1FBQ0wsQ0FBQztRQUNELGdCQUFnQixFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUN0RCxPQUFPLElBQUEsc0NBQWdCLGtCQUNy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