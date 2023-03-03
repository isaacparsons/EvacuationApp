"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class Mailhog {
    constructor() {
        this.UI_PORT = 8025;
        this.SMTP_SERVER = 1025;
        this.HOST = "localhost";
    }
    async deleteAllEmails() {
        await (0, axios_1.default)({
            method: "delete",
            url: "http://localhost:8025/api/v1/messages"
        });
    }
    async getEmails() {
        const _emails = await (0, axios_1.default)({
            method: "get",
            url: "http://localhost:8025/api/v2/messages"
        });
        const emails = _emails.data.items;
        return emails;
    }
    getSender(email) {
        return `${email.From.Mailbox}@${email.From.Domain}`;
    }
    getRecepients(email) {
        return email.To.map((item) => `${item.Mailbox}@${item.Domain}`);
    }
    getSubject(email) {
        return email.Content.Headers.Subject[0];
    }
    getBody(email) {
        return email.Content.Body;
    }
}
exports.default = Mailhog;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFpbGhvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kZXYvTWFpbGhvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtEQUEwQjtBQW1CMUIsTUFBcUIsT0FBTztJQUkxQjtRQUNFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDO0lBQzFCLENBQUM7SUFFRCxLQUFLLENBQUMsZUFBZTtRQUNuQixNQUFNLElBQUEsZUFBSyxFQUFDO1lBQ1YsTUFBTSxFQUFFLFFBQVE7WUFDaEIsR0FBRyxFQUFFLHVDQUF1QztTQUM3QyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsS0FBSyxDQUFDLFNBQVM7UUFDYixNQUFNLE9BQU8sR0FBUSxNQUFNLElBQUEsZUFBSyxFQUFDO1lBQy9CLE1BQU0sRUFBRSxLQUFLO1lBQ2IsR0FBRyxFQUFFLHVDQUF1QztTQUM3QyxDQUFDLENBQUM7UUFDSCxNQUFNLE1BQU0sR0FBbUIsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDbEQsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVELFNBQVMsQ0FBQyxLQUFtQjtRQUMzQixPQUFPLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUN0RCxDQUFDO0lBQ0QsYUFBYSxDQUFDLEtBQW1CO1FBQy9CLE9BQU8sS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBQ0QsVUFBVSxDQUFDLEtBQW1CO1FBQzVCLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFDRCxPQUFPLENBQUMsS0FBbUI7UUFDekIsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztJQUM1QixDQUFDO0NBQ0Y7QUF0Q0QsMEJBc0NDIn0=