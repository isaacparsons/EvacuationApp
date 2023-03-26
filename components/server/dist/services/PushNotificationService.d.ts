import * as OneSignal from "@onesignal/node-onesignal";
export default class PushNotificationService {
    client: OneSignal.DefaultApi;
    constructor();
    sendNotifications(usersIds: string[], message: string, app_url?: string): Promise<void>;
}
