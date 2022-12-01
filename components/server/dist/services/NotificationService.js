"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotifications = void 0;
const EmailService_1 = __importDefault(require("./EmailService"));
const PushNotificationService_1 = __importDefault(require("./PushNotificationService"));
const emailService = new EmailService_1.default();
const pushNotificationService = new PushNotificationService_1.default();
const sendNotifications = async (data) => {
    var _a, _b;
    const { db, groupId } = data;
    const group = await db.group.findUnique({
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
    const users = group === null || group === void 0 ? void 0 : group.members.map((member) => member.user);
    if (((_a = group === null || group === void 0 ? void 0 : group.notificationSetting) === null || _a === void 0 ? void 0 : _a.emailEnabled) && users && users.length > 0) {
        await emailService.sendAlertNotifications(users);
    }
    if (((_b = group === null || group === void 0 ? void 0 : group.notificationSetting) === null || _b === void 0 ? void 0 : _b.pushEnabled) && users && users.length > 0) {
        await pushNotificationService.sendNotifications(users, "test");
    }
};
exports.sendNotifications = sendNotifications;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTm90aWZpY2F0aW9uU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9Ob3RpZmljYXRpb25TZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLGtFQUEwQztBQUMxQyx3RkFBZ0U7QUFPaEUsTUFBTSxZQUFZLEdBQUcsSUFBSSxzQkFBWSxFQUFFLENBQUM7QUFDeEMsTUFBTSx1QkFBdUIsR0FBRyxJQUFJLGlDQUF1QixFQUFFLENBQUM7QUFFdkQsTUFBTSxpQkFBaUIsR0FBRyxLQUFLLEVBQUUsSUFBdUIsRUFBRSxFQUFFOztJQUNqRSxNQUFNLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQztJQUU3QixNQUFNLEtBQUssR0FBRyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDO1FBQ3RDLEtBQUssRUFBRTtZQUNMLEVBQUUsRUFBRSxPQUFPO1NBQ1o7UUFDRCxPQUFPLEVBQUU7WUFDUCxtQkFBbUIsRUFBRSxJQUFJO1lBQ3pCLE9BQU8sRUFBRTtnQkFDUCxLQUFLLEVBQUU7b0JBQ0wsTUFBTSxFQUFFLFVBQVU7aUJBQ25CO2dCQUNELE9BQU8sRUFBRTtvQkFDUCxJQUFJLEVBQUUsSUFBSTtpQkFDWDthQUNGO1NBQ0Y7S0FDRixDQUFDLENBQUM7SUFDSCxNQUFNLEtBQUssR0FBRyxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRTFELElBQUksQ0FBQSxNQUFBLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxtQkFBbUIsMENBQUUsWUFBWSxLQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUN6RSxNQUFNLFlBQVksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNsRDtJQUNELElBQUksQ0FBQSxNQUFBLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxtQkFBbUIsMENBQUUsV0FBVyxLQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUN4RSxNQUFNLHVCQUF1QixDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztLQUNoRTtBQUNILENBQUMsQ0FBQztBQTNCVyxRQUFBLGlCQUFpQixxQkEyQjVCIn0=