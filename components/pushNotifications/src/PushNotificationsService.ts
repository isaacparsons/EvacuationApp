import * as OneSignal from "@onesignal/node-onesignal";

export default class PushNotificationService {
  client: OneSignal.DefaultApi;

  constructor() {
    const configuration = OneSignal.createConfiguration({
      authMethods: {
        app_key: {
          tokenProvider: {
            getToken() {
              return process.env.ONESIGNAL_API_KEY as string;
            },
          },
        },
      },
    });
    this.client = new OneSignal.DefaultApi(configuration);
  }

  async sendNotifications(batch: number[], message: string) {
    const batchOfStrs = batch.map((id) => id.toString());
    const notification = {
      app_id: process.env.ONESIGNAL_APP_ID as string,
      include_external_user_ids: batchOfStrs,
      contents: {
        en: message,
      },
    };

    try {
      return await this.client.createNotification(notification);
    } catch (e) {
      console.log(e);
    }
  }
}
