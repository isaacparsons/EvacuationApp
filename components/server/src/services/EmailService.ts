import nodemailer from "nodemailer";
import Mailhog from "../dev/Mailhog";

const transportOptions = () => {
  if (process.env.NODE_ENV === "test") {
    const mailhog = new Mailhog();
    return {
      host: mailhog.HOST,
      port: mailhog.SMTP_SERVER
    };
  }
  return {
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  };
};

export interface EmailDetails {
  users: string[];
  subject: string;
  message: string;
  link?: string;
}

export default class EmailService {
  public transporter: any;
  constructor() {
    const options = transportOptions();
    this.transporter = nodemailer.createTransport(options);
  }

  public sendEmail = async (
    userEmails: string[],
    subject: string,
    message: string,
    link?: string
  ) => {
    try {
      const emailList = userEmails.reduce((list, email, i) => {
        if (i === 0) {
          return `${email}`;
        }
        return `${list},${email}`;
      }, "");
      const options: any = {
        from: process.env.EMAIL,
        to: emailList,
        subject
      };
      if (link) {
        options.html = `<p>${message}<a href="${link}">Link</a></p>`;
      } else {
        options.text = message;
      }

      await this.transporter.sendMail(options);
      console.log(`Email sent to users: ${emailList}`);
    } catch (error) {
      console.log(error);
      console.log(`Unable to send email users`);
    }
  };
}
