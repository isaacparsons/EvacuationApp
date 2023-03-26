export interface EmailDetails {
    users: string[];
    subject: string;
    message: string;
    link?: string;
}
export default class EmailService {
    transporter: any;
    constructor();
    sendEmail: (userEmails: string[], subject: string, message: string, link?: string) => Promise<void>;
}
