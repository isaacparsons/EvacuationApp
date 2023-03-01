import { Organization, User } from "@prisma/client";
import nodemailer from "nodemailer";
import TokenService from "./TokenService";
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

export default class EmailService {
  public transporter: any;
  public tokenService: TokenService;
  constructor() {
    this.tokenService = new TokenService();
    const options = transportOptions();
    this.transporter = nodemailer.createTransport(options);
  }

  public sendEmail = async (users: User[], subject: string, message: string, link?: string) => {
    try {
      const emailList = users.reduce((list, user, i) => {
        if (i === 0) {
          return `${user.email}`;
        }
        return `${list},${user.email}`;
      }, "");
      const options: any = {
        from: process.env.EMAIL,
        to: emailList,
        subject
      };
      if (link) {
        options.html = `<p>${message}<a href="${link}">Sign up</a></p>`;
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
