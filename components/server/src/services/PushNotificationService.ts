import * as OneSignal from "@onesignal/node-onesignal";

import { User } from "@prisma/client";

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

  public async sendNotifications(
    users: User[],
    message: string,
    app_url: string
  ) {
    const listOfIds = users.map((user) => user.id.toString());
    const notification = {
      app_id: process.env.ONESIGNAL_APP_ID as string,
      include_external_user_ids: listOfIds,
      contents: {
        en: message
      },
      app_url
    };

    try {
      return await this.client.createNotification(notification);
    } catch (e) {
      console.log(e);
    }
  }
}
