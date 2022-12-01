import { Organization, User } from "@prisma/client";
import nodemailer from "nodemailer";
import TokenService from "./TokenService";

export default class EmailService {
  public transporter: any;
  public tokenService: TokenService;
  constructor() {
    this.tokenService = new TokenService();
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  public sendEmail = async (
    users: User[],
    subject: string,
    message: string
  ) => {
    try {
      const emailList = users.reduce((list, user, i) => {
        if (i === 0) {
          return `${user.email}`;
        }
        return `${list},${user.email}`;
      }, "");
      await this.transporter.sendMail({
        from: process.env.EMAIL,
        to: emailList,
        subject,
        text: message
      });
      console.log(`Email sent to users: ${emailList}`);
    } catch (error) {
      console.log(error);
      console.log(`Unable to send email users`);
    }
  };
}
