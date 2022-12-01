"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const OneSignal = __importStar(require("@onesignal/node-onesignal"));
class PushNotificationService {
    constructor() {
        const configuration = OneSignal.createConfiguration({
            authMethods: {
                app_key: {
                    tokenProvider: {
                        getToken() {
                            return process.env.ONESIGNAL_API_KEY;
                        }
                    }
                }
            }
        });
        this.client = new OneSignal.DefaultApi(configuration);
    }
    async sendNotifications(users, message) {
        const listOfIds = users.map((user) => user.id.toString());
        const notification = {
            app_id: process.env.ONESIGNAL_APP_ID,
            include_external_user_ids: listOfIds,
            contents: {
                en: message
            }
        };
        try {
            return await this.client.createNotification(notification);
        }
        catch (e) {
            console.log(e);
        }
    }
}
exports.default = PushNotificationService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHVzaE5vdGlmaWNhdGlvblNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvUHVzaE5vdGlmaWNhdGlvblNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFFQUF1RDtBQUl2RCxNQUFxQix1QkFBdUI7SUFHMUM7UUFDRSxNQUFNLGFBQWEsR0FBRyxTQUFTLENBQUMsbUJBQW1CLENBQUM7WUFDbEQsV0FBVyxFQUFFO2dCQUNYLE9BQU8sRUFBRTtvQkFDUCxhQUFhLEVBQUU7d0JBQ2IsUUFBUTs0QkFDTixPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQTJCLENBQUM7d0JBQ2pELENBQUM7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxTQUFTLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRCxLQUFLLENBQUMsaUJBQWlCLENBQUMsS0FBYSxFQUFFLE9BQWU7UUFDcEQsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQzFELE1BQU0sWUFBWSxHQUFHO1lBQ25CLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUEwQjtZQUM5Qyx5QkFBeUIsRUFBRSxTQUFTO1lBQ3BDLFFBQVEsRUFBRTtnQkFDUixFQUFFLEVBQUUsT0FBTzthQUNaO1NBQ0YsQ0FBQztRQUVGLElBQUk7WUFDRixPQUFPLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUMzRDtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNoQjtJQUNILENBQUM7Q0FDRjtBQWxDRCwwQ0FrQ0MifQ==