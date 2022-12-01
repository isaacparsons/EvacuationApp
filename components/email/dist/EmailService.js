"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 1;
class EmailService {
    constructor() {
        this.sendEmail = async (email, subject, message) => {
            try {
                await this.transporter.sendMail({
                    from: process.env.EMAIL,
                    to: email,
                    subject,
                    text: message,
                });
                console.log(`Email sent to user with email: ${email}`);
            }
            catch (error) {
                console.log(`Unable to send email user with email: ${email}`);
            }
        };
        this.transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }
}
exports.default = EmailService;
