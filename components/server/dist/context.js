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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.createMockContext = void 0;
const client_1 = require("@prisma/client");
const jest_mock_extended_1 = require("jest-mock-extended");
const logger_1 = __importStar(require("./config/logger"));
const TokenService_1 = __importDefault(require("./services/TokenService"));
const tokenService = new TokenService_1.default();
const createMockContext = () => {
    return {
        db: (0, jest_mock_extended_1.mockDeep)(),
        log: logger_1.mockLogger
    };
};
exports.createMockContext = createMockContext;
const auth = async ({ req }) => {
    var _a;
    const log = (0, logger_1.default)("Kiwitinohk Communications App");
    const prisma = new client_1.PrismaClient();
    const result = { db: prisma, log };
    if ((_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization) {
        const token = req.headers.authorization.replace("Bearer ", "");
        const { userId } = tokenService.verify(token);
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            throw new Error("User does not exist for the given access token");
        }
        result.log = (0, logger_1.default)("Kiwitinohk Communications App", { userId: user.id });
        result.user = user;
    }
    return result;
};
exports.auth = auth;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb250ZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsMkNBQThDO0FBQzlDLDJEQUE2RDtBQUM3RCwwREFBcUQ7QUFDckQsMkVBQW1EO0FBRW5ELE1BQU0sWUFBWSxHQUFHLElBQUksc0JBQVksRUFBRSxDQUFDO0FBY2pDLE1BQU0saUJBQWlCLEdBQUcsR0FBZ0IsRUFBRTtJQUNqRCxPQUFPO1FBQ0wsRUFBRSxFQUFFLElBQUEsNkJBQVEsR0FBZ0I7UUFDNUIsR0FBRyxFQUFFLG1CQUFVO0tBQ2hCLENBQUM7QUFDSixDQUFDLENBQUM7QUFMVyxRQUFBLGlCQUFpQixxQkFLNUI7QUFFSyxNQUFNLElBQUksR0FBRyxLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFOztJQUNwQyxNQUFNLEdBQUcsR0FBRyxJQUFBLGdCQUFNLEVBQUMsK0JBQStCLENBQUMsQ0FBQztJQUNwRCxNQUFNLE1BQU0sR0FBaUIsSUFBSSxxQkFBWSxFQUFFLENBQUM7SUFDaEQsTUFBTSxNQUFNLEdBQVksRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDO0lBQzVDLElBQUksTUFBQSxHQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsT0FBTywwQ0FBRSxhQUFhLEVBQUU7UUFDL0IsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUMvRCxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QyxNQUFNLElBQUksR0FBRyxNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQ3hDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUU7U0FDdEIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNULE1BQU0sSUFBSSxLQUFLLENBQUMsZ0RBQWdELENBQUMsQ0FBQztTQUNuRTtRQUNELE1BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBQSxnQkFBTSxFQUFDLCtCQUErQixFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzFFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0tBQ3BCO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyxDQUFDO0FBbEJXLFFBQUEsSUFBSSxRQWtCZiJ9