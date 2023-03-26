"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = __importStar(require("jsonwebtoken"));
class TokenService {
    constructor() {
        this.create = (user) => {
            return jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        };
        this.verify = (token) => {
            return jwt.verify(token, process.env.JWT_SECRET);
        };
        this.createAccessToken = (userId) => {
            return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30m" });
        };
        this.createRefreshToken = (userId) => {
            return jwt.sign({ userId }, process.env.JWT_SECRET_REFRESH, { expiresIn: "14d" });
        };
        this.verifyAccessToken = (token) => {
            return jwt.verify(token, process.env.JWT_SECRET);
        };
        this.verifyRefreshToken = (token) => {
            return jwt.verify(token, process.env.JWT_SECRET_REFRESH);
        };
    }
}
exports.default = TokenService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVG9rZW5TZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL1Rva2VuU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0Esa0RBQW9DO0FBRXBDLE1BQXFCLFlBQVk7SUFBakM7UUFDUyxXQUFNLEdBQUcsQ0FBQyxJQUFVLEVBQUUsRUFBRTtZQUM3QixPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBb0IsQ0FBQyxDQUFDO1FBQ3pFLENBQUMsQ0FBQztRQUNLLFdBQU0sR0FBRyxDQUFDLEtBQWEsRUFBRSxFQUFFO1lBQ2hDLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFvQixDQUV4RCxDQUFDO1FBQ0osQ0FBQyxDQUFDO1FBRUssc0JBQWlCLEdBQUcsQ0FBQyxNQUFjLEVBQUUsRUFBRTtZQUM1QyxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQW9CLEVBQUUsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUN0RixDQUFDLENBQUM7UUFDSyx1QkFBa0IsR0FBRyxDQUFDLE1BQWMsRUFBRSxFQUFFO1lBQzdDLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQTRCLEVBQUUsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUM5RixDQUFDLENBQUM7UUFFSyxzQkFBaUIsR0FBRyxDQUFDLEtBQWEsRUFBRSxFQUFFO1lBQzNDLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFvQixDQUV4RCxDQUFDO1FBQ0osQ0FBQyxDQUFDO1FBQ0ssdUJBQWtCLEdBQUcsQ0FBQyxLQUFhLEVBQUUsRUFBRTtZQUM1QyxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQTRCLENBRWhFLENBQUM7UUFDSixDQUFDLENBQUM7SUFDSixDQUFDO0NBQUE7QUEzQkQsK0JBMkJDIn0=