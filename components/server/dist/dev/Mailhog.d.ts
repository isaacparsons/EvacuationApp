interface MailhogEmail {
    To: {
        Mailbox: string;
        Domain: string;
    }[];
    From: {
        Mailbox: string;
        Domain: string;
    };
    Content: {
        Headers: {
            Subject: string[];
        };
        Body: string;
    };
}
export default class Mailhog {
    UI_PORT: number;
    SMTP_SERVER: number;
    HOST: string;
    constructor();
    deleteAllEmails(): Promise<void>;
    getEmails(): Promise<MailhogEmail[]>;
    getSender(email: MailhogEmail): string;
    getRecepients(email: MailhogEmail): string[];
    getSubject(email: MailhogEmail): string;
    getBody(email: MailhogEmail): string;
}
export {};
