"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOrgAnnouncementNotification = exports.sendCompleteSignupNotifications = exports.sendPasswordResetNotification = exports.sendAlertEndedNotification = exports.sendAlertNotification = void 0;
const TokenService_1 = __importDefault(require("../../dist/services/TokenService"));
const EmailService_1 = __importDefault(require("./EmailService"));
const PushNotificationService_1 = __importDefault(require("./PushNotificationService"));
const emailService = new EmailService_1.default();
const pushNotificationService = new PushNotificationService_1.default();
const tokenService = new TokenService_1.default();
const getGroup = async (db, groupId) => {
    return db.group.findUnique({
        where: {
            id: groupId
        },
        include: {
            notificationSetting: true,
            members: {
                where: {
                    status: "accepted"
                },
                include: {
                    user: true
                }
            }
        }
    });
};
const sendAlertNotification = async (data) => {
    var _a, _b;
    const { db, evacuationEvent } = data;
    const group = await getGroup(db, evacuationEvent.groupId);
    const users = group === null || group === void 0 ? void 0 : group.members.map((member) => member.user);
    if (!users || users.length === 0 || !group) {
        return;
    }
    const subject = "Evacuation Alert!";
    const appLink = `${process.env.APP_LINK}group/${evacuationEvent.groupId}/evacuation/${evacuationEvent.id}`;
    const message = `Evacuation issued for ${group.name}`;
    if ((_a = group === null || group === void 0 ? void 0 : group.notificationSetting) === null || _a === void 0 ? void 0 : _a.emailEnabled) {
        await emailService.sendEmail(users, subject, message, appLink);
    }
    if ((_b = group === null || group === void 0 ? void 0 : group.notificationSetting) === null || _b === void 0 ? void 0 : _b.pushEnabled) {
        await pushNotificationService.sendNotifications(users, message, appLink);
    }
};
exports.sendAlertNotification = sendAlertNotification;
const sendAlertEndedNotification = async (data) => {
    var _a, _b;
    const { db, evacuationEvent } = data;
    const group = await getGroup(db, evacuationEvent.groupId);
    const users = group === null || group === void 0 ? void 0 : group.members.map((member) => member.user);
    if (!users || users.length === 0 || !group) {
        return;
    }
    const subject = "Evacuation status update: safe to return";
    const message = `Evacuation for ${group.name} has ended, it is now safe to return`;
    const appLink = `${process.env.APP_LINK}group/${evacuationEvent.groupId}/evacuation/${evacuationEvent.id}`;
    if ((_a = group === null || group === void 0 ? void 0 : group.notificationSetting) === null || _a === void 0 ? void 0 : _a.emailEnabled) {
        await emailService.sendEmail(users, subject, message);
    }
    if ((_b = group === null || group === void 0 ? void 0 : group.notificationSetting) === null || _b === void 0 ? void 0 : _b.pushEnabled) {
        await pushNotificationService.sendNotifications(users, message, appLink);
    }
};
exports.sendAlertEndedNotification = sendAlertEndedNotification;
const sendPasswordResetNotification = async (user) => {
    const token = tokenService.create(user);
    const resetLink = `${process.env.CLIENT_URL}/changePassword?token=${token}`;
    await emailService.sendEmail([user], "Reset Password", `Visit the link below to reset your password: \n ${resetLink}`);
};
exports.sendPasswordResetNotification = sendPasswordResetNotification;
const sendCompleteSignupNotifications = async (data) => {
    const { db, members } = data;
    const membersToEmail = members.filter((member) => !member.user.accountCreated);
    await Promise.all(membersToEmail.map(async (member) => {
        await sendCompleteSignupNotification(member.user, member.organization);
    }));
};
exports.sendCompleteSignupNotifications = sendCompleteSignupNotifications;
const sendCompleteSignupNotification = async (user, organization) => {
    const token = tokenService.create(user);
    const signupLink = `${process.env.CLIENT_URL}/completeSignup?token=${token}`;
    console.log(signupLink);
    await emailService.sendEmail([user], "Complete Signup", `You have been invited to the organization: ${organization.name}. Visit the link below to complete signup: \n ${signupLink}`);
};
const sendOrgAnnouncementNotification = () => { };
exports.sendOrgAnnouncementNotification = sendOrgAnnouncementNotification;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTm90aWZpY2F0aW9uU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9Ob3RpZmljYXRpb25TZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQU9BLG9GQUE0RDtBQUU1RCxrRUFBMEM7QUFDMUMsd0ZBQWdFO0FBaUJoRSxNQUFNLFlBQVksR0FBRyxJQUFJLHNCQUFZLEVBQUUsQ0FBQztBQUN4QyxNQUFNLHVCQUF1QixHQUFHLElBQUksaUNBQXVCLEVBQUUsQ0FBQztBQUM5RCxNQUFNLFlBQVksR0FBRyxJQUFJLHNCQUFZLEVBQUUsQ0FBQztBQUV4QyxNQUFNLFFBQVEsR0FBRyxLQUFLLEVBQUUsRUFBZ0IsRUFBRSxPQUFlLEVBQUUsRUFBRTtJQUMzRCxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDO1FBQ3pCLEtBQUssRUFBRTtZQUNMLEVBQUUsRUFBRSxPQUFPO1NBQ1o7UUFDRCxPQUFPLEVBQUU7WUFDUCxtQkFBbUIsRUFBRSxJQUFJO1lBQ3pCLE9BQU8sRUFBRTtnQkFDUCxLQUFLLEVBQUU7b0JBQ0wsTUFBTSxFQUFFLFVBQVU7aUJBQ25CO2dCQUNELE9BQU8sRUFBRTtvQkFDUCxJQUFJLEVBQUUsSUFBSTtpQkFDWDthQUNGO1NBQ0Y7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUFFSyxNQUFNLHFCQUFxQixHQUFHLEtBQUssRUFBRSxJQUE0QixFQUFFLEVBQUU7O0lBQzFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsZUFBZSxFQUFFLEdBQUcsSUFBSSxDQUFDO0lBRXJDLE1BQU0sS0FBSyxHQUFHLE1BQU0sUUFBUSxDQUFDLEVBQUUsRUFBRSxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDMUQsTUFBTSxLQUFLLEdBQUcsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFD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