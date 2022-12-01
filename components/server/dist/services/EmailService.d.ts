import { Organization, User } from "@prisma/client";
import TokenService from "./TokenService";
export default class EmailService {
    transporter: any;
    tokenService: TokenService;
    constructor();
    sendEmail: (email: string, subject: string, message: string) => Promise<void>;
    sendAlertNotifications: (users: User[]) => Promise<void>;
    sendPasswordReset: (user: User) => Promise<void>;
    sendCompleteSignup: (user: User, organization: Organization) => Promise<void>;
}
