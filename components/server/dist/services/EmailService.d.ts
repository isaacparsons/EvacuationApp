import { User } from "@prisma/client";
import TokenService from "./TokenService";
export default class EmailService {
    transporter: any;
    tokenService: TokenService;
    constructor();
    sendEmail: (users: User[], subject: string, message: string, link?: string) => Promise<void>;
}
