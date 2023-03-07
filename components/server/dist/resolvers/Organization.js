"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OrganizationService_1 = require("../services/OrganizationService");
const GroupService_1 = require("../services/GroupService");
const errors_1 = require("../util/errors");
const NotificationService_1 = require("../services/NotificationService");
const OrganizationService_2 = require("../services/OrganizationService");
const OrganizationService_3 = require("../services/OrganizationService");
const NotificationService_2 = require("../services/NotificationService");
const NotificationService_3 = require("../services/NotificationService");
const OrganizationResolver = {
    Query: {
        getOrganizations: async (parent, args, context) => {
            const organizations = await (0, OrganizationService_1.getOrganizationsForUser)({
                context
            });
            return organizations;
        },
        getOrganization: async (parent, args, context) => {
            return (0, OrganizationService_1.getOrganization)(Object.assign({ context }, args));
        },
        getOrganizationForUser: async (parent, args, context) => {
            return (0, OrganizationService_1.getOrganizationForUser)(Object.assign({ context }, args));
        },
        getOrganizationMembers: async (parent, args, context) => {
            return (0, OrganizationService_1.getOrganizationMembers)(Object.assign({ context }, args));
        },
        getAnnouncements: async (parent, args, context) => {
            return (0, OrganizationService_1.getAnnouncements)(Object.assign({ context }, args));
        }
    },
    Mutation: {
        createOrganization: async (parent, args, context) => {
            const organization = await (0, OrganizationService_1.createOrganization)(Object.assign({ context }, args));
            return organization;
        },
        deleteOrganization: async (parent, args, context) => {
            const organization = await (0, OrganizationService_1.deleteOrganization)(Object.assign({ context }, args));
            return organization;
        },
        updateOrganizationNotificationOptions: async (parent, args, context) => {
            const organization = await (0, OrganizationService_1.updateOrganizationNotificationOptions)(Object.assign({ context }, args));
            return organization;
        },
        inviteToOrganization: async (parent, args, context) => {
            const { groupIds, organizationId } = args;
            const { succeeded, failed } = await (0, OrganizationService_1.inviteToOrganization)(Object.assign({ context }, args));
            const users = succeeded.map((member) => member.user);
            if (groupIds && groupIds.length > 0) {
                const userIds = users.map((user) => user.id);
                await (0, GroupService_1.addUsersToGroups)({
                    context,
                    organizationId: organizationId,
                    userIds,
                    groupIds: groupIds
                });
            }
            const organization = await (0, OrganizationService_3.getOrganizationById)({ context, organizationId });
            const notSignedUpUsers = users.filter((user) => !user.accountCreated);
            const signedUpUsers = users.filter((user) => user.accountCreated);
            const completeSignupNotifications = notSignedUpUsers.map((user) => {
                const notificationDetails = (0, NotificationService_2.createCompleteSignupNotification)({
                    user,
                    organization
                });
                return {
                    type: NotificationService_1.NotificationType.EMAIL,
                    users: [user],
                    content: notificationDetails
                };
            });
            const invitedToOrgNotifications = signedUpUsers.map((user) => {
                const notificationDetails = (0, NotificationService_2.createInvitedToOrgNotification)({
                    organization
                });
                return {
                    type: NotificationService_1.NotificationType.EMAIL,
                    users: [user],
                    content: notificationDetails
                };
            });
            const notifications = [...completeSignupNotifications, ...invitedToOrgNotifications];
            await (0, NotificationService_3.sendNotifications)({
                context,
                notifications
            });
            if (failed.length > 0) {
                throw new errors_1.RequestError("failed to invite 1 or more users");
            }
            return succeeded;
        },
        updateOrgInvite: async (parent, args, context) => {
            const organizationMember = await (0, OrganizationService_1.updateOrgInvite)(Object.assign({ context }, args));
            return organizationMember;
        },
        removeFromOrganization: async (parent, args, context) => {
            const { succeeded, failed } = await (0, OrganizationService_1.removeFromOrganization)(Object.assign({ context }, args));
            if (failed.length > 0) {
                throw new errors_1.RequestError("Failed to remove 1 or more members");
            }
            return succeeded;
        },
        createOrganizationAnnouncement: async (parent, args, context) => {
            const { groupIds } = args;
            const announcement = await (0, OrganizationService_1.createOrganizationAnnouncement)(Object.assign({ context }, args));
            const organization = await (0, OrganizationService_2.getOrgWithAcceptedMembers)({
                context,
                organizationId: announcement.organizationId
            });
            let users = organization.members.map((member) => member.user);
            const notificationDetails = (0, NotificationService_1.createAnnouncementNotification)({ announcement });
            if (groupIds && groupIds.length > 0) {
                users = await (0, GroupService_1.getAcceptedUsersByGroupIds)({ context, groupIds });
            }
            if (organization.notificationSetting) {
                const notifications = (0, NotificationService_3.createOrganizationNotifications)({
                    users,
                    notificationSettings: organization.notificationSetting,
                    notificationDetails
                });
                await (0, NotificationService_3.sendNotifications)({
                    context,
                    notifications
                });
            }
            return announcement;
        },
        deleteOrganizationAnnouncement: async (parent, args, context) => {
            const organization = await (0, OrganizationService_1.deleteOrganizationAnnouncement)(Object.assign({ context }, args));
            return organization;
        }
    }
};
exports.default = OrganizationResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3JnYW5pemF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Jlc29sdmVycy9Pcmdhbml6YXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5RUFjeUM7QUFHekMsMkRBQXdGO0FBQ3hGLDJDQUE4QztBQUM5Qyx5RUFBbUc7QUFDbkcseUVBQTRFO0FBRTVFLHlFQUFzRTtBQUN0RSx5RUFHeUM7QUFDekMseUVBR3lDO0FBRXpDLE1BQU0sb0JBQW9CLEdBQWM7SUFDdEMsS0FBSyxFQUFFO1FBQ0wsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUU7WUFDaEQsTUFBTSxhQUFhLEdBQUcsTUFBTSxJQUFBLDZDQUF1QixFQUFDO2dCQUNsRCxPQUFPO2FBQ1IsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxhQUFhLENBQUM7UUFDdkIsQ0FBQztRQUNELGVBQWUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsRUFBRTtZQUMvQyxPQUFPLElBQUEscUNBQWUsa0JBQ3BCLE9BQU8sSUFDSixJQUFJLEVBQ1AsQ0FBQztRQUNMLENBQUM7UUFDRCxzQkFBc0IsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsRUFBRTtZQUN0RCxPQUFPLElBQUEsNENBQXNCLGtCQUMzQixPQUFPLElBQ0osSUFBSSxFQUNQLENBQUM7UUFDTCxDQUFDO1FBQ0Qsc0JBQXNCLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUU7WUFDdEQsT0FBTyxJQUFBLDRDQUFzQixrQkFDM0IsT0FBTyxJQUNKLElBQUksRUFDUCxDQUFDO1FBQ0wsQ0FBQztRQUNELGdCQUFnQixFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFO1lBQ2hELE9BQU8sSUFBQSxzQ0FBZ0Isa0JBQ3JCLE9BQU8sSUFDSixJQUFJLEVBQ1AsQ0FBQztRQUNMLENBQUM7S0FDRjtJQUNELFFBQVEsRUFBRTtRQUNSLGtCQUFrQixFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFO1lBQ2xELE1BQU0sWUFBWSxHQUFHLE1BQU0sSUFBQSx3Q0FBa0Isa0JBQzNDLE9BQU8sSUFDSixJQUFJLEVBQ1AsQ0FBQztZQUNILE9BQU8sWUFBWSxDQUFDO1FBQ3RCLENBQUM7UUFDRCxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsRUFBRTtZQUNsRCxNQUFNLFlBQVksR0FBRyxNQUFNLElBQUEsd0NBQWtCLGtCQUMzQyxPQUFPLElBQ0osSUFBSSxFQUNQLENBQUM7WUFDSCxPQUFPLFlBQVksQ0FBQztRQUN0QixDQUFDO1FBQ0QscUNBQXFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUU7WUFDckUsTUFBTSxZQUFZLEdBQUcsTUFBTSxJQUFBLDJEQUFxQyxrQkFDOUQsT0FBTyxJQUNKLElBQUksRUFDUCxDQUFDO1lBQ0gsT0FBTyxZQUFZLENBQUM7UUFDdEIsQ0FBQztRQUNELG9CQUFvQixFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFO1lBQ3BELE1BQU0sRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFFLEdBQUcsSUFBSSxDQUFDO1lBQzFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLEdBQUcsTUFBTSxJQUFBLDBDQUFvQixrQkFDdEQsT0FBTyxJQUNKLElBQUksRUFDUCxDQUFDO1lBQ0gsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JELElBQUksUUFBUSxJQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUNuQyxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQzdDLE1BQU0sSUFBQSwrQkFBZ0IsRUFBQztvQkFDckIsT0FBTztvQkFDUCxjQUFjLEVBQUUsY0FBYztvQkFDOUIsT0FBTztvQkFDUCxRQUFRLEVBQUUsUUFBUTtpQkFDbkIsQ0FBQyxDQUFDO2FBQ0o7WUFDRCxNQUFNLFlBQVksR0FBRyxNQUFNLElBQUEseUNBQW1CLEVBQUMsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQztZQUM1RSxNQUFNLGdCQUFnQixHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ3RFLE1BQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUVsRSxNQUFNLDJCQUEyQixHQUFHLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUNoRSxNQUFNLG1CQUFtQixHQUFHLElBQUEsc0RBQWdDLEVBQUM7b0JBQzNELElBQUk7b0JBQ0osWUFBWTtpQkFDYixDQUFDLENBQUM7Z0JBQ0gsT0FBTztvQkFDTCxJQUFJLEVBQUUsc0NBQWdCLENBQUMsS0FBSztvQkFDNUIsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDO29CQUNiLE9BQU8sRUFBRSxtQkFBbUI7aUJBQzdCLENBQUM7WUFDSixDQUFDLENBQUMsQ0FBQztZQUVILE1BQU0seUJBQXlCLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUMzRCxNQUFNLG1CQUFtQixHQUFHLElBQUEsb0RBQThCLEVBQUM7b0JBQ3pELFlBQVk7aUJBQ2IsQ0FBQyxDQUFDO2dCQUNILE9BQU87b0JBQ0wsSUFBSSxFQUFFLHNDQUFnQixDQUFDLEtBQUs7b0JBQzVCLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQztvQkFDYixPQUFPLEVBQUUsbUJBQW1CO2lCQUM3QixDQUFDO1lBQ0osQ0FBQyxDQUFDLENBQUM7WUFFSCxNQUFNLGFBQWEsR0FBRyxDQUFDLEdBQUcsMkJBQTJCLEVBQUUsR0FBRyx5QkFBeUIsQ0FBQyxDQUFDO1lBRXJGLE1BQU0sSUFBQSx1Q0FBaUIsRUFBQztnQkFDdEIsT0FBTztnQkFDUCxhQUFhO2FBQ2QsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDckIsTUFBTSxJQUFJLHFCQUFZLENBQUMsa0NBQWtDLENBQUMsQ0FBQzthQUM1RDtZQUNELE9BQU8sU0FBUyxDQUFDO1FBQ25CLENBQUM7UUFDRCxlQUFlLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUU7WUFDL0MsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLElBQUEscUNBQWUsa0JBQzlDLE9BQU8sSUFDSixJQUFJLEVBQ1AsQ0FBQztZQUNILE9BQU8sa0JBQWtCLENBQUM7UUFDNUIsQ0FBQztRQUNELHNCQUFzQixFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFO1lBQ3RELE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLEdBQUcsTUFBTSxJQUFBLDRDQUFzQixrQkFDeEQsT0FBTyxJQUNKLElBQUksRUFDUCxDQUFDO1lBQ0gsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDckIsTUFBTSxJQUFJLHFCQUFZLENBQUMsb0NBQW9DLENBQUMsQ0FBQzthQUM5RDtZQUNELE9BQU8sU0FBUyxDQUFDO1FBQ25CLENBQUM7UUFDRCw4QkFBOEIsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsRUFBRTtZQUM5RCxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDO1lBQzFCLE1BQU0sWUFBWSxHQUFHLE1BQU0sSUFBQSxvREFBOEIsa0JBQ3ZELE9BQU8sSUFDSixJQUFJLEVBQ1AsQ0FBQztZQUNILE1BQU0sWUFBWSxHQUFHLE1BQU0sSUFBQSwrQ0FBeUIsRUFBQztnQkFDbkQsT0FBTztnQkFDUCxjQUFjLEVBQUUsWUFBWSxDQUFDLGNBQWM7YUFDNUMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxLQUFLLEdBQVcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0RSxNQUFNLG1CQUFtQixHQUFHLElBQUEsb0RBQThCLEVBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO1lBQzdFLElBQUksUUFBUSxJQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUNuQyxLQUFLLEdBQUcsTUFBTSxJQUFBLHlDQUEwQixFQUFDLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7YUFDakU7WUFDRCxJQUFJLFlBQVksQ0FBQyxtQkFBbUIsRUFBRTtnQkFDcEMsTUFBTSxhQUFhLEdBQUcsSUFBQSxxREFBK0IsRUFBQztvQkFDcEQsS0FBSztvQkFDTCxvQkFBb0IsRUFBRSxZQUFZLENBQUMsbUJBQW1CO29CQUN0RCxtQkFBbUI7aUJBQ3BCLENBQUMsQ0FBQztnQkFDSCxNQUFNLElBQUEsdUNBQWlCLEVBQUM7b0JBQ3RCLE9BQU87b0JBQ1AsYUFBYTtpQkFDZCxDQUFDLENBQUM7YUFDSjtZQUNELE9BQU8sWUFBWSxDQUFDO1FBQ3RCLENBQUM7UUFDRCw4QkFBOEIsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsRUFBRTtZQUM5RCxNQUFNLFlBQVksR0FBRyxNQUFNLElBQUEsb0RBQThCLGtCQUN2RCxPQUFPLElBQ0osSUFBSSxFQUNQLENBQUM7WUFDSCxPQUFPLFlBQVksQ0FBQztRQUN0QixDQUFDO0tBQ0Y7Q0FDRixDQUFDO0FBRUYsa0JBQWUsb0JBQW9CLENBQUMifQ==