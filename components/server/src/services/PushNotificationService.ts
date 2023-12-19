import * as OneSignal from "@onesignal/node-onesignal";

export default class PushNotificationService {
  public client: OneSignal.DefaultApi;

  constructor() {
    const configuration = OneSignal.createConfiguration({
      authMethods: {
        app_key: {
          tokenProvider: {
            getToken() {
              return process.env.ONESIGNAL_API_KEY as string;
            }
          }
        }
      }
    });
    this.client = new OneSignal.DefaultApi(configuration);
  }

  public async sendNotifications(usersIds: string[], message: string, app_url?: string) {
    const notification = {
      app_id: process.env.ONESIGNAL_APP_ID as string,
      include_external_user_ids: usersIds,
      contents: {
        en: message || ""
      },
      app_url
    };
    try {
      await this.client.createNotification(notification);
      return;
    } catch (e) {
      console.log(e);
    }
  }
}
