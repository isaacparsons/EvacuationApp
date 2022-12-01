import nodemailer from "nodemailer";
// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 1;

export default class EmailService {
  transporter: any;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  public sendEmail = async (email: string, subject: string, message: string) => {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject,
        text: message,
      });
      console.log(`Email sent to user with email: ${email}`);
    } catch (error) {
      console.log(`Unable to send email user with email: ${email}`);
    }
  };
}
