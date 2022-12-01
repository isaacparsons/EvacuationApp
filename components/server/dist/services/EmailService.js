"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const TokenService_1 = __importDefault(require("./TokenService"));
class EmailService {
    constructor() {
        this.sendEmail = async (email, subject, message) => {
            try {
                await this.transporter.sendMail({
                    from: process.env.EMAIL,
                    to: email,
                    subject,
                    text: message
                });
                console.log(`Email sent to user with email: ${email}`);
            }
            catch (error) {
                console.log(error);
                console.log(`Unable to send email user with email: ${email}`);
            }
        };
        this.sendAlertNotifications = async (users) => {
            const emailList = users.reduce((list, user, i) => {
                if (i === 0) {
                    return `${user.email}`;
                }
                return `${list},${user.email}`;
            }, "");
            await this.sendEmail(emailList, "subject", "message");
        };
        this.sendPasswordReset = async (user) => {
            const token = this.tokenService.create(user);
            const resetLink = `${process.env.CLIENT_URL}/changePassword?token=${token}`;
            await this.sendEmail(user.email, "Reset Password", `Visit the link below to reset your password: \n ${resetLink}`);
        };
        this.sendCompleteSignup = async (user, organization) => {
            const token = this.tokenService.create(user);
            const resetLink = `${process.env.CLIENT_URL}/completeSignup?token=${token}`;
            this.sendEmail(user.email, "Complete Signup", `Visit the link below to complete signup: \n ${resetLink}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW1haWxTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL0VtYWlsU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDREQUFvQztBQUVwQyxrRUFBMEM7QUFFMUMsTUFBcUIsWUFBWTtJQUcvQjtRQVdPLGNBQVMsR0FBRyxLQUFLLEVBQ3RCLEtBQWEsRUFDYixPQUFlLEVBQ2YsT0FBZSxFQUNmLEVBQUU7WUFDRixJQUFJO2dCQUNGLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUM7b0JBQzlCLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUs7b0JBQ3ZCLEVBQUUsRUFBRSxLQUFLO29CQUNULE9BQU87b0JBQ1AsSUFBSSxFQUFFLE9BQU87aUJBQ2QsQ0FBQyxDQUFDO2dCQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsa0NBQWtDLEtBQUssRUFBRSxDQUFDLENBQUM7YUFDeEQ7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLHlDQUF5QyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2FBQy9EO1FBQ0gsQ0FBQyxDQUFDO1FBRUssMkJBQXNCLEdBQUcsS0FBSyxFQUFFLEtBQWEsRUFBRSxFQUFFO1lBQ3RELE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUMvQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQ1gsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztpQkFDeEI7Z0JBQ0QsT0FBTyxHQUFHLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDakMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ1AsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDeEQsQ0FBQyxDQUFDO1FBRUssc0JBQWlCLEdBQUcsS0FBSyxFQUFFLElBQVUsRUFBRSxFQUFFO1lBQzlDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdDLE1BQU0sU0FBUyxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLHlCQUF5QixLQUFLLEVBQUUsQ0FBQztZQUU1RSxNQUFNLElBQUksQ0FBQyxTQUFTLENBQ2xCLElBQUksQ0FBQyxLQUFLLEVBQ1YsZ0JBQWdCLEVBQ2hCLG1EQUFtRCxTQUFTLEVBQUUsQ0FDL0QsQ0FBQztRQUNKLENBQUMsQ0FBQztRQUVLLHVCQUFrQixHQUFHLEtBQUssRUFDL0IsSUFBVSxFQUNWLFlBQTBCLEVBQzFCLEVBQUU7WUFDRixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3QyxNQUFNLFNBQVMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSx5QkFBeUIsS0FBSyxFQUFFLENBQUM7WUFDNUUsSUFBSSxDQUFDLFNBQVMsQ0FDWixJQUFJLENBQUMsS0FBSyxFQUNWLGlCQUFpQixFQUNqQiwrQ0FBK0MsU0FBUyxFQUFFLENBQzNELENBQUM7UUFDSixDQUFDLENBQUM7UUE3REEsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLHNCQUFZLEVBQUUsQ0FBQztRQUN2QyxJQUFJLENBQUMsV0FBVyxHQUFHLG9CQUFVLENBQUMsZUFBZSxDQUFDO1lBQzVDLE9BQU8sRUFBRSxPQUFPO1lBQ2hCLElBQUksRUFBRTtnQkFDSixJQUFJLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLO2dCQUN2QixJQUFJLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjO2FBQ2pDO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQXNERjtBQWxFRCwrQkFrRUMifQ==