"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const TokenService_1 = __importDefault(require("./TokenService"));
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
                    subject,
                    text: message
                };
                if (link) {
                    options.html = `<a href=\"${link}\">link to app</a>`;
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
        this.transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }
}
exports.default = EmailService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW1haWxTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL0VtYWlsU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLDREQUFvQztBQUNwQyxrRUFBMEM7QUFFMUMsTUFBcUIsWUFBWTtJQUcvQjtRQVdPLGNBQVMsR0FBRyxLQUFLLEVBQ3RCLEtBQWEsRUFDYixPQUFlLEVBQ2YsT0FBZSxFQUNmLElBQWEsRUFDYixFQUFFO1lBQ0YsSUFBSTtnQkFDRixNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDL0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO3dCQUNYLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7cUJBQ3hCO29CQUNELE9BQU8sR0FBRyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNqQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ1AsTUFBTSxPQUFPLEdBQVE7b0JBQ25CLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUs7b0JBQ3ZCLEVBQUUsRUFBRSxTQUFTO29CQUNiLE9BQU87b0JBQ1AsSUFBSSxFQUFFLE9BQU87aUJBQ2QsQ0FBQztnQkFDRixJQUFJLElBQUksRUFBRTtvQkFDUixPQUFPLENBQUMsSUFBSSxHQUFHLGFBQWEsSUFBSSxvQkFBb0IsQ0FBQztpQkFDdEQ7Z0JBQ0QsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDekMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsU0FBUyxFQUFFLENBQUMsQ0FBQzthQUNsRDtZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQzthQUMzQztRQUNILENBQUMsQ0FBQztRQXRDQSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksc0JBQVksRUFBRSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxXQUFXLEdBQUcsb0JBQVUsQ0FBQyxlQUFlLENBQUM7WUFDNUMsT0FBTyxFQUFFLE9BQU87WUFDaEIsSUFBSSxFQUFFO2dCQUNKLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUs7Z0JBQ3ZCLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWM7YUFDakM7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0NBK0JGO0FBM0NELCtCQTJDQyJ9