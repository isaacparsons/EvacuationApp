"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCompleteSignupNotifications = exports.sendPasswordResetNotification = exports.sendAlertEndedNotification = exports.sendAlertNotification = exports.sendAnnouncementNotification = void 0;
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
                    user: true
                }
            }
        }
    });
};
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
    const users = group === null || group === void 0 ? void 0 : group.members.map((member) => member.user);
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
    const users = group === null || group === void 0 ? void 0 : group.members.map((member) => member.user);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTm90aWZpY2F0aW9uU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9Ob3RpZmljYXRpb25TZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQVlBLGtFQUEwQztBQUMxQyx3RkFBZ0U7QUFDaEUsa0VBQTBDO0FBTzFDLE1BQU0sWUFBWSxHQUFHLElBQUksc0JBQVksRUFBRSxDQUFDO0FBQ3hDLE1BQU0sdUJBQXVCLEdBQUcsSUFBSSxpQ0FBdUIsRUFBRSxDQUFDO0FBQzlELE1BQU0sWUFBWSxHQUFHLElBQUksc0JBQVksRUFBRSxDQUFDO0FBRXhDLE1BQU0sUUFBUSxHQUFHLEtBQUssRUFBRSxFQUFnQixFQUFFLE9BQWUsRUFBRSxFQUFFO0lBQzNELE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFDekIsS0FBSyxFQUFFO1lBQ0wsRUFBRSxFQUFFLE9BQU87U0FDWjtRQUNELE9BQU8sRUFBRTtZQUNQLG1CQUFtQixFQUFFLElBQUk7WUFDekIsT0FBTyxFQUFFO2dCQUNQLE9BQU8sRUFBRTtvQkFDUCxJQUFJLEVBQUUsSUFBSTtpQkFDWDthQUNGO1NBQ0Y7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUFFRixNQUFNLGVBQWUsR0FBRyxLQUFLLEVBQUUsRUFBZ0IsRUFBRSxjQUFzQixFQUFFLEVBQUU7SUFDekUsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQztRQUNoQyxLQUFLLEVBQUU7WUFDTCxFQUFFLEVBQUUsY0FBYztTQUNuQjtRQUNELE9BQU8sRUFBRTtZQUNQLG1CQUFtQixFQUFFLElBQUk7WUFDekIsT0FBTyxFQUFFO2dCQUNQLEtBQUssRUFBRTtvQkFDTCxNQUFNLEVBQUUsVUFBVTtpQkFDbkI7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLElBQUksRUFBRSxJQUFJO2lCQUNYO2FBQ0Y7U0FDRjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQUVGLE1BQU0seUJBQXlCLEdBQUcsS0FBSyxFQUFFLEVBQWdCLEVBQUUsUUFBa0IsRUFBRSxFQUFFO0lBQy9FLE1BQU0sTUFBTSxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FDOUIsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUU7UUFDN0IsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztZQUN6QixLQUFLLEVBQUU7Z0JBQ0wsRUFBRSxFQUFFLE9BQU87YUFDWjtZQUNELE9BQU8sRUFBRTtnQkFDUCxPQUFPLEVBQUU7b0JBQ1AsT0FBTyxFQUFFO3dCQUNQLElBQUksRUFBRSxJQUFJO3FCQUNYO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ0YsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTs7UUFDMUMsTUFBTSxVQUFVLEdBQUcsTUFBQSxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxtQ0FBSSxFQUFFLENBQUM7UUFDckUsT0FBTyxDQUFDLEdBQUcsSUFBSSxFQUFFLEdBQUcsVUFBVSxDQUFDLENBQUM7SUFDbEMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ1AsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDLENBQUM7QUFFRixNQUFNLDZCQUE2QixHQUFHLEtBQUssRUFDekMsb0JBQXFELEVBQ3JELEtBQWEsRUFDYixPQUFlLEVBQ2YsT0FBZSxFQUNmLE9BQWdCLEVBQ2hCLEVBQUU7SUFDRixJQUFJLG9CQUFvQixDQUFDLFlBQVksRUFBRTtRQUNyQyxNQUFNLFlBQVksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztLQUN2RDtJQUNELElBQUksb0JBQW9CLENBQUMsV0FBVyxFQUFFO1FBQ3BDLE1BQU0sdUJBQXVCLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztLQUMxRTtBQUNILENBQUMsQ0FBQztBQUVGLE1BQU0sc0JBQXNCLEdBQUcsS0FBSyxFQUNsQyxvQkFBOEMsRUFDOUMsS0FBYSxFQUNiLE9BQWUsRUFDZixPQUFlLEVBQ2YsT0FBZ0IsRUFDaEIsRUFBRTtJQUNGLElBQUksb0JBQW9CLENBQUMsWUFBWSxFQUFFO1FBQ3JDLE1BQU0sWUFBWSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ3ZEO0lBQ0QsSUFBSSxvQkFBb0IsQ0FBQyxXQUFXLEVBQUU7UUFDcEMsTUFBTSx1QkFBdUIsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQzFFO0FBQ0gsQ0FBQyxDQUFDO0FBRUssTUFBTSw0QkFBNEIsR0FBRyxLQUFLLEVBQUUsSUFJbEQsRUFBRSxFQUFFOztJQUNILE1BQU0sRUFBRSxFQUFFLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQztJQUM1QyxNQUFNLFlBQVksR0FBRyxNQUFNLGVBQWUsQ0FBQyxFQUFFLEVBQUUsWUFBWSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzVFLElBQUksS0FBSyxHQUFXLEVBQUUsQ0FBQztJQUN2QixJQUFJLFFBQVEsRUFBRTtRQUNaLEtBQUssR0FBRyxNQUFNLHlCQUF5QixDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUN2RDtTQUFNO1FBQ0wsS0FBSyxHQUFHLE1BQUEsWUFBWSxhQUFaLFlBQVksdUJBQVosWUFBWSxDQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUNBQUksRUFBRSxDQUFDO0tBQ2xFO0lBRUQsSUFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtRQUNqRCxPQUFPO0tBQ1I7SUFDRCxNQUFNLE9BQU8sR0FBRyxrQkFBa0IsWUFBWSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3ZELDhHQUE4RztJQUU5RyxJQUFJLFlBQVksYUFBWixZQUFZLHVCQUFaLFlBQVksQ0FBRSxtQkFBbUIsRUFBRTtRQUNyQyxNQUFNLDZCQUE2QixDQUNqQyxZQUFZLGFBQVosWUFBWSx1QkFBWixZQUFZLENBQUUsbUJBQW1CLEVBQ2pDLEtBQUssRUFDTCxPQUFPLEVBQ1AsWUFBWSxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQy9CLENBQUM7S0FDSDtBQUNILENBQUMsQ0FBQztBQTVCVyxRQUFBLDRCQUE0QixnQ0E0QnZDO0FBRUssTUFBTSxxQkFBcUIsR0FBRyxLQUFLLEVBQUUsSUFBNEIsRUFBRSxFQUFFO0lBQzFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsZUFBZSxFQUFFLEdBQUcsSUFBSSxDQUFDO0lBRXJDLE1BQU0sS0FBSyxHQUFHLE1BQU0sUUFBUSxDQUFDLEVBQUUsRUFBRSxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDMUQsTUFBTSxLQUFLLEdBQUcsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUUxRCxJQUFJLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1FBQzFDLE9BQU87S0FDUjtJQUNELE1BQU0sT0FBTyxHQUFHLG1CQUFtQixDQUFDO0lBQ3BDLE1BQU0sT0FBTyxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLFNBQVMsZUFBZSxDQUFDLE9BQU8sZUFBZSxlQUFlLENBQUMsRUFBRSxFQUFFLENBQUM7SUFDM0csTUFBTSxPQUFPLEdBQUcseUJBQXlCLEtBQUssQ0FBQyxJQUFJLGdCQUFnQixlQUFlLENBQUMsT0FBTyxFQUFFLENBQUM7SUFFN0YsSUFBSSxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsbUJBQW1CLEVBQUU7UUFDOUIsTUFBTSxzQkFBc0IsQ0FBQyxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsbUJBQW1CLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDNUY7QUFDSCxDQUFDLENBQUM7QUFoQlcsUUFBQSxxQkFBcUIseUJBZ0JoQztBQUVLLE1BQU0sMEJBQTBCLEdBQUcsS0FBSyxFQUFFLElBQTRCLEVBQUUsRUFBRTtJQUMvRSxNQUFNLEVBQUUsRUFBRSxFQUFFLGVBQWUsRUFBRSxHQUFHLElBQUksQ0FBQztJQUVyQyxNQUFNLEtBQUssR0FBRyxNQUFNLFFBQVEsQ0FBQyxFQUFFLEVBQUUsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzFELE1BQU0sS0FBSyxHQUFHLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFMUQsSUFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtRQUMxQyxPQUFPO0tBQ1I7SUFFRCxNQUFNLE9BQU8sR0FBRywwQ0FBMEMsQ0FBQztJQUMzRCxNQUFNLE9BQU8sR0FBRyxrQkFBa0IsS0FBSyxDQUFDLElBQUksc0NBQXNDLENBQUM7SUFDbkYsTUFBTSxPQUFPLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsU0FBUyxlQUFlLENBQUMsT0FBTyxlQUFlLGVBQWUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztJQUUzRyxJQUFJLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxtQkFBbUIsRUFBRTtRQUM5QixNQUFNLHNCQUFzQixDQUFDLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxtQkFBbUIsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztLQUM1RjtBQUNILENBQUMsQ0FBQztBQWpCVyxRQUFBLDBCQUEwQiw4QkFpQnJDO0FBRUssTUFBTSw2QkFBNkIsR0FBRyxLQUFLLEVBQUUsSUFBVSxFQUFFLEVBQUU7SUFDaEUsTUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4QyxNQUFNLFNBQVMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSx5QkFBeUIsS0FBSyxFQUFFLENBQUM7SUFDNUUsTUFBTSxZQUFZLENBQUMsU0FBUyxDQUMxQixDQUFDLElBQUksQ0FBQyxFQUNOLGdCQUFnQixFQUNoQixtREFBbUQsU0FBUyxFQUFFLENBQy9ELENBQUM7QUFDSixDQUFDLENBQUM7QUFSVyxRQUFBLDZCQUE2QixpQ0FReEM7QUFFSyxNQUFNLCtCQUErQixHQUFHLEtBQUssRUFBRSxJQU1yRCxFQUFFLEVBQUU7SUFDSCxNQUFNLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUM7SUFFbEQsTUFBTSxZQUFZLEdBQUcsTUFBTSxPQUFPLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7UUFDNUQsS0FBSyxFQUFFO1lBQ0wsRUFBRSxFQUFFLGNBQWM7U0FDbkI7S0FDRixDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsWUFBWSxFQUFFO1FBQ2pCLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLGNBQWMsaUJBQWlCLENBQUMsQ0FBQztLQUMzRTtJQUVELE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FDZixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUMzQixJQUFJO1lBQ0YsTUFBTSw4QkFBOEIsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO1NBQ2pFO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FDZiw0REFBNEQsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FDaEYsQ0FBQztTQUNIO0lBQ0gsQ0FBQyxDQUFDLENBQ0gsQ0FBQztBQUNKLENBQUMsQ0FBQztBQTlCVyxRQUFBLCtCQUErQixtQ0E4QjFDO0FBRUYsTUFBTSw4QkFBOEIsR0FBRyxLQUFLLEVBQUUsSUFBVSxFQUFFLFlBQTBCLEVBQUUsRUFBRTtJQUN0RixNQUFNLEtBQUssR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3hDLE1BQU0sVUFBVSxHQUFHLFVBQVUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLHlCQUF5QixLQUFLLEVBQUUsQ0FBQztJQUVwRixNQUFNLFlBQVksQ0FBQyxTQUFTLENBQzFCLENBQUMsSUFBSSxDQUFDLEVBQ04saUJBQWlCLEVBQ2pCLDhDQUE4QyxZQUFZLENBQUMsSUFBSSwrQ0FBK0MsRUFDOUcsVUFBVSxDQUNYLENBQUM7QUFDSixDQUFDLENBQUMifQ==