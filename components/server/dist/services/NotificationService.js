"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushNotification = exports.EmailNotification = exports.sendNotifications = exports.NotificationType = void 0;
var NotificationType;
(function (NotificationType) {
    NotificationType["EMAIL"] = "email";
    NotificationType["PUSH"] = "push";
})(NotificationType = exports.NotificationType || (exports.NotificationType = {}));
const sendNotifications = async (data) => {
    const { context, notifications } = data;
    await Promise.all(notifications.map(async (notification) => {
        try {
            return notification.send();
        }
        catch (error) {
            context.log.error(`Failed to send notification`);
        }
    }));
};
exports.sendNotifications = sendNotifications;
class EmailNotification {
    constructor(emailService, userEmails, message, subject, emailLink) {
        this.emailService = emailService;
        this.userEmails = userEmails;
        this.subject = subject;
        this.message = message;
        this.emailLink = emailLink;
    }
    send() {
        return this.emailService.sendEmail(this.userEmails, this.subject, this.message, this.emailLink);
    }
}
exports.EmailNotification = EmailNotification;
class PushNotification {
    constructor(pushNotificationService, userIds, message, app_url) {
        this.pushNotificationService = pushNotificationService;
        this.userIds = userIds;
        this.message = message;
        this.app_url = app_url;
    }
    send() {
        return this.pushNotificationService.sendNotifications(this.userIds, this.message, this.app_url);
    }
}
exports.PushNotification = PushNotification;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTm90aWZpY2F0aW9uU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9Ob3RpZmljYXRpb25TZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQU1BLElBQVksZ0JBR1g7QUFIRCxXQUFZLGdCQUFnQjtJQUMxQixtQ0FBZSxDQUFBO0lBQ2YsaUNBQWEsQ0FBQTtBQUNmLENBQUMsRUFIVyxnQkFBZ0IsR0FBaEIsd0JBQWdCLEtBQWhCLHdCQUFnQixRQUczQjtBQWVNLE1BQU0saUJBQWlCLEdBQUcsS0FBSyxFQUFFLElBR3ZDLEVBQUUsRUFBRTtJQUNILE1BQU0sRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLEdBQUcsSUFBSSxDQUFDO0lBQ3hDLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FDZixhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsRUFBRTtRQUN2QyxJQUFJO1lBQ0YsT0FBTyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDNUI7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7U0FDbEQ7SUFDSCxDQUFDLENBQUMsQ0FDSCxDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBZFcsUUFBQSxpQkFBaUIscUJBYzVCO0FBTUYsTUFBYSxpQkFBaUI7SUFPNUIsWUFDRSxZQUEwQixFQUMxQixVQUFvQixFQUNwQixPQUFlLEVBQ2YsT0FBZSxFQUNmLFNBQWtCO1FBRWxCLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQzdCLENBQUM7SUFFRCxJQUFJO1FBQ0YsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbEcsQ0FBQztDQUNGO0FBeEJELDhDQXdCQztBQUVELE1BQWEsZ0JBQWdCO0lBTTNCLFlBQ0UsdUJBQWdELEVBQ2hELE9BQWlCLEVBQ2pCLE9BQWUsRUFDZixPQUFnQjtRQUVoQixJQUFJLENBQUMsdUJBQXVCLEdBQUcsdUJBQXVCLENBQUM7UUFDdkQsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDekIsQ0FBQztJQUVELElBQUk7UUFDRixPQUFPLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2xHLENBQUM7Q0FDRjtBQXJCRCw0Q0FxQkMifQ==