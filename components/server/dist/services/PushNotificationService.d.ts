import * as OneSignal from "@onesignal/node-onesignal";
import { User } from "@prisma/client";
export default class PushNotificationService {
    client: OneSignal.DefaultApi;
    constructor();
    sendNotifications(users: User[], message: string): Promise<OneSignal.InlineResponse200 | undefined>;
}
