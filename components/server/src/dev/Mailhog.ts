import axios from "axios";

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
  constructor() {
    this.UI_PORT = 8025;
    this.SMTP_SERVER = 1025;
    this.HOST = "localhost";
  }

  async deleteAllEmails() {
    await axios({
      method: "delete",
      url: "http://localhost:8025/api/v1/messages"
    });
  }

  async getEmails() {
    const _emails: any = await axios({
      method: "get",
      url: "http://localhost:8025/api/v2/messages"
    });
    const emails: MailhogEmail[] = _emails.data.items;
    return emails;
  }

  getSender(email: MailhogEmail) {
    return `${email.From.Mailbox}@${email.From.Domain}`;
  }
  getRecepients(email: MailhogEmail) {
    return email.To.map((item) => `${item.Mailbox}@${item.Domain}`);
  }
  getSubject(email: MailhogEmail) {
    return email.Content.Headers.Subject[0];
  }
  getBody(email: MailhogEmail) {
    return email.Content.Body;
  }
}
