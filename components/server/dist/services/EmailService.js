"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const Mailhog_1 = __importDefault(require("../dev/Mailhog"));
const transportOptions = () => {
    if (process.env.NODE_ENV === "test") {
        const mailhog = new Mailhog_1.default();
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
class EmailService {
    constructor() {
        this.sendEmail = async (userEmails, subject, message, link) => {
            try {
                const emailList = userEmails.reduce((list, email, i) => {
                    if (i === 0) {
                        return `${email}`;
                    }
                    return `${list},${email}`;
                }, "");
                const options = {
                    from: process.env.EMAIL,
                    to: emailList,
                    subject
                };
                if (link) {
                    options.html = `<p>${message}<a href="${link}">Link</a></p>`;
                }
                else {
                    options.text = message;
                }
                await this.transporter.sendMail(options);
                console.log(`Email sent to users: ${emailList}`);
            }
            catch (error) {
                console.log(error);
                console.log(`Unable to send email users`);
            }
        };
        const options = transportOptions();
        this.transporter = nodemailer_1.default.createTransport(options);
    }
}
exports.default = EmailService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW1haWxTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL0VtYWlsU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDREQUFvQztBQUNwQyw2REFBcUM7QUFFckMsTUFBTSxnQkFBZ0IsR0FBRyxHQUFHLEVBQUU7SUFDNUIsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsS0FBSyxNQUFNLEVBQUU7UUFDbkMsTUFBTSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7UUFDOUIsT0FBTztZQUNMLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSTtZQUNsQixJQUFJLEVBQUUsT0FBTyxDQUFDLFdBQVc7U0FDMUIsQ0FBQztLQUNIO0lBQ0QsT0FBTztRQUNMLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLElBQUksRUFBRTtZQUNKLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUs7WUFDdkIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYztTQUNqQztLQUNGLENBQUM7QUFDSixDQUFDLENBQUM7QUFTRixNQUFxQixZQUFZO0lBRS9CO1FBS08sY0FBUyxHQUFHLEtBQUssRUFDdEIsVUFBb0IsRUFDcEIsT0FBZSxFQUNmLE9BQWUsRUFDZixJQUFhLEVBQ2IsRUFBRTtZQUNGLElBQUk7Z0JBQ0YsTUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ3JELElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTt3QkFDWCxPQUFPLEdBQUcsS0FBSyxFQUFFLENBQUM7cUJBQ25CO29CQUNELE9BQU8sR0FBRyxJQUFJLElBQUksS0FBSyxFQUFFLENBQUM7Z0JBQzVCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDUCxNQUFNLE9BQU8sR0FBUTtvQkFDbkIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSztvQkFDdkIsRUFBRSxFQUFFLFNBQVM7b0JBQ2IsT0FBTztpQkFDUixDQUFDO2dCQUNGLElBQUksSUFBSSxFQUFFO29CQUNSLE9BQU8sQ0FBQyxJQUFJLEdBQUcsTUFBTSxPQUFPLFlBQVksSUFBSSxnQkFBZ0IsQ0FBQztpQkFDOUQ7cUJBQU07b0JBQ0wsT0FBTyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7aUJBQ3hCO2dCQUVELE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLFNBQVMsRUFBRSxDQUFDLENBQUM7YUFDbEQ7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUM7YUFDM0M7UUFDSCxDQUFDLENBQUM7UUFsQ0EsTUFBTSxPQUFPLEdBQUcsZ0JBQWdCLEVBQUUsQ0FBQztRQUNuQyxJQUFJLENBQUMsV0FBVyxHQUFHLG9CQUFVLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3pELENBQUM7Q0FpQ0Y7QUF0Q0QsK0JBc0NDIn0=