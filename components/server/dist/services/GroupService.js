"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUsersFromGroup = exports.inviteUsersToGroups = exports.addUsersToGroup = exports.createGroupNotifications = void 0;
const NotificationService_1 = require("./NotificationService");
const createGroupNotifications = (data) => {
    const { emailService, users, notificationSettings, notificationDetails, pushNotificationService } = data;
    const notifications = [];
    if (notificationSettings === null || notificationSettings === void 0 ? void 0 : notificationSettings.emailEnabled) {
        const userEmails = users.map((user) => user.email);
        const emailNotification = new NotificationService_1.EmailNotification(emailService, userEmails, notificationDetails.message, notificationDetails.subject);
        notifications.push(emailNotification);
    }
    if (notificationSettings === null || notificationSettings === void 0 ? void 0 : notificationSettings.pushEnabled) {
        const userIds = users.map((user) => user.id.toString());
        const pushNotification = new NotificationService_1.PushNotification(pushNotificationService, userIds, notificationDetails.message, notificationDetails.appLink);
        notifications.push(pushNotification);
    }
    return notifications;
};
exports.createGroupNotifications = createGroupNotifications;
const addUsersToGroup = async (data) => {
    const { groupRepository, users, groupId, organizationId, context } = data;
    const succeeded = [];
    const failed = [];
    await Promise.all(users.map(async (user) => {
        try {
            const groupMember = await groupRepository.createGroupMember({
                userId: user.userId,
                organizationId: organizationId,
                groupId,
                admin: user.admin
            });
            succeeded.push(groupMember);
            return groupMember;
        }
        catch (error) {
            failed.push(user.userId);
            context.log.error(`Unable to add user: ${user.userId} to group with id: ${groupId}`);
            throw error;
        }
    }));
    return { succeeded, failed };
};
exports.addUsersToGroup = addUsersToGroup;
const inviteUsersToGroups = async (data) => {
    const { groupRepository, organizationId, groupIds, userIds, context } = data;
    await Promise.all(groupIds.map(async (groupId) => {
        await Promise.all(userIds.map(async (userId) => {
            try {
                await groupRepository.createGroupMember({
                    userId,
                    organizationId,
                    groupId,
                    admin: false
                });
            }
            catch (error) {
                context.log.error(`Unable to add user: ${userId} to group with id: ${groupId}`, error);
            }
        }));
    }));
};
exports.inviteUsersToGroups = inviteUsersToGroups;
const removeUsersFromGroup = async (data) => {
    const { userIds, groupRepository, groupId, context } = data;
    const succeeded = [];
    const failed = [];
    await Promise.all(userIds.map(async (userId) => {
        try {
            const member = await groupRepository.removeMember({
                userId,
                groupId
            });
            succeeded.push(member);
        }
        catch (error) {
            context.log.error(`Failed to remove member with userId: ${userId} from group: ${groupId}`, error);
            failed.push(userId);
        }
    }));
    return { succeeded, failed };
};
exports.removeUsersFromGroup = removeUsersFromGroup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JvdXBTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL0dyb3VwU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFLQSwrREFBNEU7QUFLckUsTUFBTSx3QkFBd0IsR0FBRyxDQUFDLElBTXhDLEVBQUUsRUFBRTtJQUNILE1BQU0sRUFDSixZQUFZLEVBQ1osS0FBSyxFQUNMLG9CQUFvQixFQUNwQixtQkFBbUIsRUFDbkIsdUJBQXVCLEVBQ3hCLEdBQUcsSUFBSSxDQUFDO0lBQ1QsTUFBTSxhQUFhLEdBQW9CLEVBQUUsQ0FBQztJQUMxQyxJQUFJLG9CQUFvQixhQUFwQixvQkFBb0IsdUJBQXBCLG9CQUFvQixDQUFFLFlBQVksRUFBRTtRQUN0QyxNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkQsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLHVDQUFpQixDQUM3QyxZQUFZLEVBQ1osVUFBVSxFQUNWLG1CQUFtQixDQUFDLE9BQU8sRUFDM0IsbUJBQW1CLENBQUMsT0FBTyxDQUM1QixDQUFDO1FBQ0YsYUFBYSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0tBQ3ZDO0lBQ0QsSUFBSSxvQkFBb0IsYUFBcEIsb0JBQW9CLHVCQUFwQixvQkFBb0IsQ0FBRSxXQUFXLEVBQUU7UUFDckMsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ3hELE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxzQ0FBZ0IsQ0FDM0MsdUJBQXVCLEVBQ3ZCLE9BQU8sRUFDUCxtQkFBbUIsQ0FBQyxPQUFPLEVBQzNCLG1CQUFtQixDQUFDLE9BQU8sQ0FDNUIsQ0FBQztRQUNGLGFBQWEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztLQUN0QztJQUNELE9BQU8sYUFBYSxDQUFDO0FBQ3ZCLENBQUMsQ0FBQztBQXBDVyxRQUFBLHdCQUF3Qiw0QkFvQ25DO0FBRUssTUFBTSxlQUFlLEdBQUcsS0FBSyxFQUFFLElBTXJDLEVBQUUsRUFBRTtJQUNILE1BQU0sRUFBRSxlQUFlLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDO0lBQzFFLE1BQU0sU0FBUyxHQUFrQixFQUFFLENBQUM7SUFDcEMsTUFBTSxNQUFNLEdBQWEsRUFBRSxDQUFDO0lBQzVCLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FDZixLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRTtRQUN2QixJQUFJO1lBQ0YsTUFBTSxXQUFXLEdBQUcsTUFBTSxlQUFlLENBQUMsaUJBQWlCLENBQUM7Z0JBQzFELE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtnQkFDbkIsY0FBYyxFQUFFLGNBQWM7Z0JBQzlCLE9BQU87Z0JBQ1AsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO2FBQ2xCLENBQUMsQ0FBQztZQUNILFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDNUIsT0FBTyxXQUFXLENBQUM7U0FDcEI7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLHVCQUF1QixJQUFJLENBQUMsTUFBTSxzQkFBc0IsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUNyRixNQUFNLEtBQUssQ0FBQztTQUNiO0lBQ0gsQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUNGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLENBQUM7QUFDL0IsQ0FBQyxDQUFDO0FBN0JXLFFBQUEsZUFBZSxtQkE2QjFCO0FBRUssTUFBTSxtQkFBbUIsR0FBRyxLQUFLLEVBQUUsSUFNekMsRUFBRSxFQUFFO0lBQ0gsTUFBTSxFQUFFLGVBQWUsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUM7SUFDN0UsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUNmLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFO1FBQzdCLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FDZixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUMzQixJQUFJO2dCQUNGLE1BQU0sZUFBZSxDQUFDLGlCQUFpQixDQUFDO29CQUN0QyxNQUFNO29CQUNOLGNBQWM7b0JBQ2QsT0FBTztvQkFDUCxLQUFLLEVBQUUsS0FBSztpQkFDYixDQUFDLENBQUM7YUFDSjtZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLHVCQUF1QixNQUFNLHNCQUFzQixPQUFPLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUN4RjtRQUNILENBQUMsQ0FBQyxDQUNILENBQUM7SUFDSixDQUFDLENBQUMsQ0FDSCxDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBMUJXLFFBQUEsbUJBQW1CLHVCQTBCOUI7QUFFSyxNQUFNLG9CQUFvQixHQUFHLEtBQUssRUFBRSxJQUsxQyxFQUFFLEVBQUU7SUFDSCxNQUFNLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDO0lBQzVELE1BQU0sU0FBUyxHQUFrQixFQUFFLENBQUM7SUFDcEMsTUFBTSxNQUFNLEdBQWEsRUFBRSxDQUFDO0lBQzVCLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FDZixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUMzQixJQUFJO1lBQ0YsTUFBTSxNQUFNLEdBQUcsTUFBTSxlQUFlLENBQUMsWUFBWSxDQUFDO2dCQUNoRCxNQUFNO2dCQUNOLE9BQU87YUFDUixDQUFDLENBQUM7WUFDSCxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3hCO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FDZix3Q0FBd0MsTUFBTSxnQkFBZ0IsT0FBTyxFQUFFLEVBQ3ZFLEtBQUssQ0FDTixDQUFDO1lBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNyQjtJQUNILENBQUMsQ0FBQyxDQUNILENBQUM7SUFDRixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxDQUFDO0FBQy9CLENBQUMsQ0FBQztBQTNCVyxRQUFBLG9CQUFvQix3QkEyQi9CIn0=