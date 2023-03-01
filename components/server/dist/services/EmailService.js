"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const TokenService_1 = __importDefault(require("./TokenService"));
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
        this.sendEmail = async (users, subject, message, link) => {
            try {
                const emailList = users.reduce((list, user, i) => {
                    if (i === 0) {
                        return `${user.email}`;
                    }
                    return `${list},${user.email}`;
                }, "");
                const options = {
                    from: process.env.EMAIL,
                    to: emailList,
                    subject
                };
                if (link) {
                    options.html = `<p>${message}<a href="${link}">Sign up</a></p>`;
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
        this.tokenService = new TokenService_1.default();
        const options = transportOptions();
        this.transporter = nodemailer_1.default.createTransport(options);
    }
}
exports.default = EmailService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW1haWxTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL0VtYWlsU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLDREQUFvQztBQUNwQyxrRUFBMEM7QUFDMUMsNkRBQXFDO0FBRXJDLE1BQU0sZ0JBQWdCLEdBQUcsR0FBRyxFQUFFO0lBQzVCLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEtBQUssTUFBTSxFQUFFO1FBQ25DLE1BQU0sT0FBTyxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1FBQzlCLE9BQU87WUFDTCxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7WUFDbEIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxXQUFXO1NBQzFCLENBQUM7S0FDSDtJQUNELE9BQU87UUFDTCxPQUFPLEVBQUUsT0FBTztRQUNoQixJQUFJLEVBQUU7WUFDSixJQUFJLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLO1lBQ3ZCLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWM7U0FDakM7S0FDRixDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBRUYsTUFBcUIsWUFBWTtJQUcvQjtRQU1PLGNBQVMsR0FBRyxLQUFLLEVBQUUsS0FBYSxFQUFFLE9BQWUsRUFBRSxPQUFlLEVBQUUsSUFBYSxFQUFFLEVBQUU7WUFDMUYsSUFBSTtnQkFDRixNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDL0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO3dCQUNYLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7cUJBQ3hCO29CQUNELE9BQU8sR0FBRyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNqQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ1AsTUFBTSxPQUFPLEdBQVE7b0JBQ25CLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUs7b0JBQ3ZCLEVBQUUsRUFBRSxTQUFTO29CQUNiLE9BQU87aUJBQ1IsQ0FBQztnQkFDRixJQUFJLElBQUksRUFBRTtvQkFDUixPQUFPLENBQUMsSUFBSSxHQUFHLE1BQU0sT0FBTyxZQUFZLElBQUksbUJBQW1CLENBQUM7aUJBQ2pFO3FCQUFNO29CQUNMLE9BQU8sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO2lCQUN4QjtnQkFFRCxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN6QyxPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixTQUFTLEVBQUUsQ0FBQyxDQUFDO2FBQ2xEO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO2FBQzNDO1FBQ0gsQ0FBQyxDQUFDO1FBOUJBLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxzQkFBWSxFQUFFLENBQUM7UUFDdkMsTUFBTSxPQUFPLEdBQUcsZ0JBQWdCLEVBQUUsQ0FBQztRQUNuQyxJQUFJLENBQUMsV0FBVyxHQUFHLG9CQUFVLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3pELENBQUM7Q0E0QkY7QUFuQ0QsK0JBbUNDIn0=