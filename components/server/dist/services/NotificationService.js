"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCompleteSignupNotifications = exports.sendPasswordResetNotification = exports.sendAlertEndedNotification = exports.sendAlertNotification = exports.sendAnnouncementNotification = exports.getAcceptedGroupMembers = void 0;
const EmailService_1 = __importDefault(require("./EmailService"));
const PushNotificationService_1 = __importDefault(require("./PushNotificationService"));
const TokenService_1 = __importDefault(require("./TokenService"));
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
                include: {
                    user: true,
                    organizationMember: true
                }
            }
        }
    });
};
const getAcceptedGroupMembers = async (db, groupId) => {
    return db.group.findMany({
        where: {
            id: groupId
        },
        include: {
            members: {
                where: {
                    organizationMember: {
                        status: "accepted"
                    }
                }
            }
        }
    });
};
exports.getAcceptedGroupMembers = getAcceptedGroupMembers;
const getOrganization = async (db, organizationId) => {
    return db.organization.findUnique({
        where: {
            id: organizationId
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
const getGroupMembersByGroupIds = async (db, groupIds) => {
    const groups = await Promise.all(groupIds.map(async (groupId) => {
        return db.group.findUnique({
            where: {
                id: groupId
            },
            include: {
                members: {
                    include: {
                        user: true
                    }
                }
            }
        });
    }));
    const users = groups.reduce((prev, group) => {
        var _a;
        const groupUsers = (_a = group === null || group === void 0 ? void 0 : group.members.map((member) => member.user)) !== null && _a !== void 0 ? _a : [];
        return [...prev, ...groupUsers];
    }, []);
    return users;
};
const sendOrganizationNotifications = async (notificationSettings, users, subject, message, appLink) => {
    if (notificationSettings.emailEnabled) {
        await emailService.sendEmail(users, subject, message);
    }
    if (notificationSettings.pushEnabled) {
        await pushNotificationService.sendNotifications(users, message, appLink);
    }
};
const sendGroupNotifications = async (notificationSettings, users, subject, message, appLink) => {
    if (notificationSettings.emailEnabled) {
        await emailService.sendEmail(users, subject, message);
    }
    if (notificationSettings.pushEnabled) {
        await pushNotificationService.sendNotifications(users, message, appLink);
    }
};
const sendAnnouncementNotification = async (data) => {
    var _a;
    const { db, announcement, groupIds } = data;
    const organization = await getOrganization(db, announcement.organizationId);
    let users = [];
    if (groupIds) {
        users = await getGroupMembersByGroupIds(db, groupIds);
    }
    else {
        users = (_a = organization === null || organization === void 0 ? void 0 : organization.members.map((member) => member.user)) !== null && _a !== void 0 ? _a : [];
    }
    if (!users || users.length === 0 || !organization) {
        return;
    }
    const subject = `Announcement - ${announcement.title}`;
    // const appLink = `${process.env.APP_LINK}group/${evacuationEvent.groupId}/evacuation/${evacuationEvent.id}`;
    if (organization === null || organization === void 0 ? void 0 : organization.notificationSetting) {
        await sendOrganizationNotifications(organization === null || organization === void 0 ? void 0 : organization.notificationSetting, users, subject, announcement.description || "");
    }
};
exports.sendAnnouncementNotification = sendAnnouncementNotification;
const sendAlertNotification = async (data) => {
    const { db, evacuationEvent } = data;
    const group = await getGroup(db, evacuationEvent.groupId);
    const filteredGroupMembers = group === null || group === void 0 ? void 0 : group.members.filter((member) => member.organizationMember.status === "accepted");
    const users = filteredGroupMembers === null || filteredGroupMembers === void 0 ? void 0 : filteredGroupMembers.map((member) => member.user);
    if (!users || users.length === 0 || !group) {
        return;
    }
    const subject = "Evacuation Alert!";
    const appLink = `${process.env.APP_LINK}group/${evacuationEvent.groupId}/evacuation/${evacuationEvent.id}`;
    const message = `Evacuation issued for ${group.name} \n message: ${evacuationEvent.message}`;
    if (group === null || group === void 0 ? void 0 : group.notificationSetting) {
        await sendGroupNotifications(group === null || group === void 0 ? void 0 : group.notificationSetting, users, subject, message, appLink);
    }
};
exports.sendAlertNotification = sendAlertNotification;
const sendAlertEndedNotification = async (data) => {
    const { db, evacuationEvent } = data;
    const group = await getGroup(db, evacuationEvent.groupId);
    const filteredGroupMembers = group === null || group === void 0 ? void 0 : group.members.filter((member) => member.organizationMember.status === "accepted");
    const users = filteredGroupMembers === null || filteredGroupMembers === void 0 ? void 0 : filteredGroupMembers.map((member) => member.user);
    if (!users || users.length === 0 || !group) {
        return;
    }
    const subject = "Evacuation status update: safe to return";
    const message = `Evacuation for ${group.name} has ended, it is now safe to return`;
    const appLink = `${process.env.APP_LINK}group/${evacuationEvent.groupId}/evacuation/${evacuationEvent.id}`;
    if (group === null || group === void 0 ? void 0 : group.notificationSetting) {
        await sendGroupNotifications(group === null || group === void 0 ? void 0 : group.notificationSetting, users, subject, message, appLink);
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
    const { members, organizationId, context } = data;
    const organization = await context.db.organization.findUnique({
        where: {
            id: organizationId
        }
    });
    if (!organization) {
        throw new Error(`Organization with id: ${organizationId} does not exist`);
    }
    await Promise.all(members.map(async (member) => {
        try {
            await sendCompleteSignupNotification(member.user, organization);
        }
        catch (error) {
            context.log.error(`Failed to send complete signup email to user with email: ${member.user.email}`);
        }
    }));
};
exports.sendCompleteSignupNotifications = sendCompleteSignupNotifications;
const sendCompleteSignupNotification = async (user, organization) => {
    const token = tokenService.create(user);
    const signupLink = `http://${process.env.CLIENT_URL}/completeSignup?token=${token}`;
    await emailService.sendEmail([user], "Complete Signup", `You have been invited to the organization: ${organization.name}. Visit the link below to complete signup: \n`, signupLink);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTm90aWZpY2F0aW9uU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9Ob3RpZmljYXRpb25TZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQVlBLGtFQUEwQztBQUMxQyx3RkFBZ0U7QUFDaEUsa0VBQTBDO0FBTzFDLE1BQU0sWUFBWSxHQUFHLElBQUksc0JBQVksRUFBRSxDQUFDO0FBQ3hDLE1BQU0sdUJBQXVCLEdBQUcsSUFBSSxpQ0FBdUIsRUFBRSxDQUFDO0FBQzlELE1BQU0sWUFBWSxHQUFHLElBQUksc0JBQVksRUFBRSxDQUFDO0FBRXhDLE1BQU0sUUFBUSxHQUFHLEtBQUssRUFBRSxFQUFnQixFQUFFLE9BQWUsRUFBRSxFQUFFO0lBQzNELE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFDekIsS0FBSyxFQUFFO1lBQ0wsRUFBRSxFQUFFLE9BQU87U0FDWjtRQUNELE9BQU8sRUFBRTtZQUNQLG1CQUFtQixFQUFFLElBQUk7WUFDekIsT0FBTyxFQUFFO2dCQUNQLE9BQU8sRUFBRTtvQkFDUCxJQUFJLEVBQUUsSUFBSTtvQkFDVixrQkFBa0IsRUFBRSxJQUFJO2lCQUN6QjthQUNGO1NBQ0Y7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUFFSyxNQUFNLHVCQUF1QixHQUFHLEtBQUssRUFBRSxFQUFnQixFQUFFLE9BQWUsRUFBRSxFQUFFO0lBQ2pGLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7UUFDdkIsS0FBSyxFQUFFO1lBQ0wsRUFBRSxFQUFFLE9BQU87U0FDWjtRQUNELE9BQU8sRUFBRTtZQUNQLE9BQU8sRUFBRTtnQkFDUCxLQUFLLEVBQUU7b0JBQ0wsa0JBQWtCLEVBQUU7d0JBQ2xCLE1BQU0sRUFBRSxVQUFVO3FCQUNuQjtpQkFDRjthQUNGO1NBQ0Y7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUFmVyxRQUFB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