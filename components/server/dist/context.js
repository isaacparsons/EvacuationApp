"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.createMockContext = void 0;
const client_1 = require("@prisma/client");
const jest_mock_extended_1 = require("jest-mock-extended");
const logger_1 = __importDefault(require("./config/logger"));
const TokenService_1 = __importDefault(require("./services/TokenService"));
const tokenService = new TokenService_1.default();
const createMockContext = () => {
    return {
        db: (0, jest_mock_extended_1.mockDeep)(),
        log: {
            error: () => { },
            info: () => { }
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb250ZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLDJDQUE4QztBQUM5QywyREFBNkQ7QUFDN0QsNkRBQXFDO0FBQ3JDLDJFQUFtRDtBQUVuRCxNQUFNLFlBQVksR0FBRyxJQUFJLHNCQUFZLEVBQUUsQ0FBQztBQWNqQyxNQUFNLGlCQUFpQixHQUFHLEdBQWdCLEVBQUU7SUFDakQsT0FBTztRQUNMLEVBQUUsRUFBRSxJQUFBLDZCQUFRLEdBQWdCO1FBQzVCLEdBQUcsRUFBRTtZQUNILEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRSxDQUFDO1lBQ2YsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFFLENBQUM7U0FDZjtLQUNGLENBQUM7QUFDSixDQUFDLENBQUM7QUFSVyxRQUFBLGlCQUFpQixxQkFRNUI7QUFFSyxNQUFNLElBQUksR0FBRyxLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFOztJQUNwQyxNQUFNLEdBQUcsR0FBRyxJQUFBLGdCQUFNLEVBQUMsK0JBQStCLENBQUMsQ0FBQztJQUNwRCxNQUFNLE1BQU0sR0FBaUIsSUFBSSxxQkFBWSxFQUFFLENBQUM7SUFDaEQsTUFBTSxNQUFNLEdBQVksRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDO0lBQzVDLElBQUksTUFBQSxHQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsT0FBTywwQ0FBRSxhQUFhLEVBQUU7UUFDL0IsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUMvRCxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QyxNQUFNLElBQUksR0FBRyxNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQ3hDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUU7U0FDdEIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNULE1BQU0sSUFBSSxLQUFLLENBQUMsZ0RBQWdELENBQUMsQ0FBQztTQUNuRTtRQUNELE1BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBQSxnQkFBTSxFQUFDLCtCQUErQixFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzFFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0tBQ3BCO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyxDQUFDO0FBbEJXLFFBQUEsSUFBSSxRQWtCZiJ9