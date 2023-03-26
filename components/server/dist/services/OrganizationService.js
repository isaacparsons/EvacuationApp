"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUsersFromOrganization = exports.inviteUsersToOrganization = exports.createOrganizationNotifications = void 0;
const NotificationService_1 = require("./NotificationService");
const doesAlreadyExistError_1 = __importDefault(require("../util/doesAlreadyExistError"));
const createOrganizationNotifications = (data) => {
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
exports.createOrganizationNotifications = createOrganizationNotifications;
const inviteUsersToOrganization = async (data) => {
    const { organizationRepository, users, organizationId, context } = data;
    const succeeded = [];
    const failed = [];
    await Promise.all(users.map(async (user) => {
        try {
            const member = await organizationRepository.createOrganizationMember({
                organizationId,
                admin: user.admin,
                email: user.email
            });
            succeeded.push(member);
        }
        catch (error) {
            if (!(0, doesAlreadyExistError_1.default)(error)) {
                context.log.error(`Failed to add member with email: ${user.email} to organization: ${organizationId}`, error);
                failed.push(user.email);
            }
        }
    }));
    return { succeeded, failed };
};
exports.inviteUsersToOrganization = inviteUsersToOrganization;
const removeUsersFromOrganization = async (data) => {
    const { organizationRepository, userIds, organizationId, context } = data;
    const succeeded = [];
    const failed = [];
    await Promise.all(userIds.map(async (userId) => {
        try {
            const member = await organizationRepository.removeFromOrganization({
                organizationId,
                userId
            });
            succeeded.push(member);
        }
        catch (error) {
            context.log.error(`Failed to remove member with userId: ${userId} from organization: ${organizationId}`, error);
            failed.push(userId);
        }
    }));
    return { succeeded, failed };
};
exports.removeUsersFromOrganization = removeUsersFromOrganization;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3JnYW5pemF0aW9uU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9Pcmdhbml6YXRpb25TZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUlBLCtEQUE0RTtBQUk1RSwwRkFBa0U7QUFFM0QsTUFBTSwrQkFBK0IsR0FBRyxDQUFDLElBTS9DLEVBQUUsRUFBRTtJQUNILE1BQU0sRUFDSixZQUFZLEVBQ1osS0FBSyxFQUNMLG9CQUFvQixFQUNwQixtQkFBbUIsRUFDbkIsdUJBQXVCLEVBQ3hCLEdBQUcsSUFBSSxDQUFDO0lBQ1QsTUFBTSxhQUFhLEdBQW9CLEVBQUUsQ0FBQztJQUMxQyxJQUFJLG9CQUFvQixhQUFwQixvQkFBb0IsdUJBQXBCLG9CQUFvQixDQUFFLFlBQVksRUFBRTtRQUN0QyxNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkQsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLHVDQUFpQixDQUM3QyxZQUFZLEVBQ1osVUFBVSxFQUNWLG1CQUFtQixDQUFDLE9BQU8sRUFDM0IsbUJBQW1CLENBQUMsT0FBTyxDQUM1QixDQUFDO1FBQ0YsYUFBYSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0tBQ3ZDO0lBQ0QsSUFBSSxvQkFBb0IsYUFBcEIsb0JBQW9CLHVCQUFwQixvQkFBb0IsQ0FBRSxXQUFXLEVBQUU7UUFDckMsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ3hELE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxzQ0FBZ0IsQ0FDM0MsdUJBQXVCLEVBQ3ZCLE9BQU8sRUFDUCxtQkFBbUIsQ0FBQyxPQUFPLEVBQzNCLG1C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