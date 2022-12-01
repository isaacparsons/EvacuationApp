"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const EmailService_1 = __importDefault(require("./EmailService"));
const handler = async (event, context) => {
    const emailService = new EmailService_1.default();
    console.log(`Event: ${JSON.stringify(event, null, 2)}`);
    const batchItemFailures = [];
    await Promise.all(event.Records.map(async (record) => {
        console.log(record);
        try {
            const { email, subject, message } = JSON.parse(record.body);
            console.log(email);
            await emailService.sendEmail(email, subject, message);
        }
        catch (error) {
            batchItemFailures.push({ itemIdentifier: record.messageId });
            console.log(error);
        }
    }));
    return {
        batchItemFailures,
    };
};
exports.handler = handler;
