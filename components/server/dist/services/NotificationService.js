"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInvitedToOrgNotification = exports.createCompleteSignupNotification = exports.createPasswordResetNotification = exports.createAlertEndedNotification = exports.createAlertNotification = exports.createAnnouncementNotification = exports.createGroupNotifications = exports.createOrganizationNotifications = exports.sendNotifications = exports.NotificationType = void 0;
const EmailService_1 = __importDefault(require("./EmailService"));
const PushNotificationService_1 = __importDefault(require("./PushNotificationService"));
const TokenService_1 = __importDefault(require("./TokenService"));
const emailService = new EmailService_1.default();
const pushNotificationService = new PushNotificationService_1.default();
const tokenService = new TokenService_1.default();
var NotificationType;
(function (NotificationType) {
    NotificationType["EMAIL"] = "email";
    NotificationType["PUSH"] = "push";
})(NotificationType = exports.NotificationType || (exports.NotificationType = {}));
const sendNotifications = async (data) => {
    const { context, notifications } = data;
    await Promise.all(notifications.map(async (notification) => {
        try {
            if (notification.type === "email") {
                await emailService.sendEmail(notification.users, notification.content.subject, notification.content.message, notification.content.signupLink);
            }
            if (notification.type === "push") {
                await pushNotificationService.sendNotifications(notification.users, notification.content.message, notification.content.appLink);
            }
        }
        catch (error) {
            context.log.error({ notification }, `Failed to send notification`);
        }
    }));
};
exports.sendNotifications = sendNotifications;
const createOrganizationNotifications = (data) => {
    const { users, notificationSettings, notificationDetails } = data;
    const notifications = [];
    if (notificationSettings.emailEnabled) {
        notifications.push({
            users,
            type: NotificationType.EMAIL,
            content: notificationDetails
        });
    }
    if (notificationSettings.pushEnabled) {
        notifications.push({
            users,
            type: NotificationType.PUSH,
            content: notificationDetails
        });
    }
    return notifications;
};
exports.createOrganizationNotifications = createOrganizationNotifications;
const createGroupNotifications = (data) => {
    const { users, notificationSettings, notificationDetails } = data;
    const notifications = [];
    if (notificationSettings.emailEnabled) {
        notifications.push({
            users,
            type: NotificationType.EMAIL,
            content: notificationDetails
        });
    }
    if (notificationSettings.pushEnabled) {
        notifications.push({
            users,
            type: NotificationType.PUSH,
            content: notificationDetails
        });
    }
    return notifications;
};
exports.createGroupNotifications = createGroupNotifications;
const createAnnouncementNotification = (data) => {
    const { announcement } = data;
    return {
        subject: `Announcement - ${announcement.title}`,
        message: announcement.description || ""
    };
};
exports.createAnnouncementNotification = createAnnouncementNotification;
const createAlertNotification = (data) => {
    const { group, evacuationEvent } = data;
    return {
        subject: "Evacuation Alert!",
        message: `Evacuation issued for ${group.name} \n message: ${evacuationEvent.message}`,
        appLink: `${process.env.APP_LINK}group/${evacuationEvent.groupId}/evacuation/${evacuationEvent.id}`
    };
};
exports.createAlertNotification = createAlertNotification;
const createAlertEndedNotification = (data) => {
    const { group, evacuationEvent } = data;
    return {
        subject: "Evacuation status update: safe to return",
        message: `Evacuation for ${group.name} has ended, it is now safe to return`,
        appLink: `${process.env.APP_LINK}group/${evacuationEvent.groupId}/evacuation/${evacuationEvent.id}`
    };
};
exports.createAlertEndedNotification = createAlertEndedNotification;
const createPasswordResetNotification = (data) => {
    const { user } = data;
    const token = tokenService.create(user);
    const resetLink = `${process.env.CLIENT_URL}/changePassword?token=${token}`;
    return {
        subject: "Reset Password",
        message: `Visit the link below to reset your password: \n ${resetLink}`
    };
};
exports.createPasswordResetNotification = createPasswordResetNotification;
const createCompleteSignupNotification = (data) => {
    const { user, organization } = data;
    const token = tokenService.create(user);
    const signupLink = `http://${process.env.CLIENT_URL}/completeSignup?token=${token}`;
    return {
        subject: "Complete Signup",
        message: `You have been invited to the organization: ${organization.name}. Visit the link below to complete signup: \n`,
        signupLink
    };
};
exports.createCompleteSignupNotification = createCompleteSignupNotification;
const createInvitedToOrgNotification = (data) => {
    const { organization } = data;
    return {
        subject: `Invitation to ${organization.name}`,
        message: `You have been invited to the organization: ${organization.name}. Open the app to respond to invitation: \n`
    };
};
exports.createInvitedToOrgNotification = createInvitedToOrgNotification;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTm90aWZpY2F0aW9uU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9Ob3RpZmljYXRpb25TZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQVdBLGtFQUEwQztBQUMxQyx3RkFBZ0U7QUFDaEUsa0VBQTBDO0FBRTFDLE1BQU0sWUFBWSxHQUFHLElBQUksc0JBQVksRUFBRSxDQUFDO0FBQ3hDLE1BQU0sdUJBQXVCLEdBQUcsSUFBSSxpQ0FBdUIsRUFBRSxDQUFDO0FBQzlELE1BQU0sWUFBWSxHQUFHLElBQUksc0JBQVksRUFBRSxDQUFDO0FBRXhDLElBQVksZ0JBR1g7QUFIRCxXQUFZLGdCQUFnQjtJQUMxQixtQ0FBZSxDQUFBO0lBQ2YsaUNBQWEsQ0FBQTtBQUNmLENBQUMsRUFIVyxnQkFBZ0IsR0FBaEIsd0JBQWdCLEtBQWhCLHdCQUFnQixRQUczQjtBQWVNLE1BQU0saUJBQWlCLEdBQUcsS0FBSyxFQUFFLElBR3ZDLEVBQUUsRUFBRTtJQUNILE1BQU0sRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLEdBQUcsSUFBSSxDQUFDO0lBQ3hDLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FDZixhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsRUFBRTtRQUN2QyxJQUFJO1lBQ0YsSUFBSSxZQUFZLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRTtnQkFDakMsTUFBTSxZQUFZLENBQUMsU0FBUyxDQUMxQixZQUFZLENBQUMsS0FBSyxFQUNsQixZQUFZLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFDNUIsWUFBWSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQzVCLFlBQVksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUNoQyxDQUFDO2FBQ0g7WUFDRCxJQUFJLFlBQVksQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFFO2dCQUNoQyxNQUFNLHVCQUF1QixDQUFDLGlCQUFpQixDQUM3QyxZQUFZLENB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