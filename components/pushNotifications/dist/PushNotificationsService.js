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
    async sendNotifications(batch) {
        const batchOfStrs = batch.map((id) => id.toString());
        const notification = {
            app_id: process.env.ONESIGNAL_APP_ID,
            include_external_user_ids: batchOfStrs,
            contents: {
                en: 'Test!'
            }
        };
        try {
            const response = await this.client.createNotification(notification);
            return {
                status: 'success',
                batch,
                response
            };
        }
        catch (e) {
            return {
                status: 'failed',
                batch,
                response: e
            };
        }
    }
    createBatches(userIds) {
        const BATCH_SIZE = 2000; // max userId batch size for sending notifications
        const batches = [];
        let batch = [];
        for (let i = 0; i < userIds.length; i++) {
            batch.push(userIds[i]);
            if (batch.length === BATCH_SIZE) {
                batches.push(batch);
                batch = [];
            }
        }
        batches.push(batch);
        return batches;
    }
}
exports.default = PushNotificationService;
