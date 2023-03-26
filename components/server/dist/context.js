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
const errors_1 = require("./util/errors");
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
    let log = (0, logger_1.default)("Kiwitinohk Communications App");
    const prisma = new client_1.PrismaClient();
    const result = { db: prisma, log };
    if ((_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization) {
        const token = req.headers.authorization.replace("Bearer ", "");
        try {
            const { userId } = tokenService.verifyAccessToken(token);
            const user = await prisma.user.findUnique({
                where: { id: userId }
            });
            if (!user) {
                throw (0, errors_1.NotFoundError)("User does not exist");
            }
            log = (0, logger_1.default)("Kiwitinohk Communications App", { userId: user.id });
            result.user = user;
        }
        catch (error) {
            throw (0, errors_1.AuthenticationError)("Invalid access token");
        }
        result.log = log;
    }
    return result;
};
exports.auth = auth;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb250ZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsMkNBQThDO0FBQzlDLDJEQUE2RDtBQUM3RCwwREFBcUQ7QUFDckQsMkVBQW1EO0FBQ25ELDBDQUFtRTtBQUVuRSxNQUFNLFlBQVksR0FBRyxJQUFJLHNCQUFZLEVBQUUsQ0FBQztBQWNqQyxNQUFNLGlCQUFpQixHQUFHLEdBQWdCLEVBQUU7SUFDakQsT0FBTztRQUNMLEVBQUUsRUFBRSxJQUFBLDZCQUFRLEdBQWdCO1FBQzVCLEdBQUcsRUFBRSxtQkFBVTtLQUNoQixDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBTFcsUUFBQSxpQkFBaUIscUJBSzVCO0FBRUssTUFBTSxJQUFJLEdBQUcsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRTs7SUFDcEMsSUFBSSxHQUFHLEdBQUcsSUFBQSxnQkFBTSxFQUFDLCtCQUErQixDQUFDLENBQUM7SUFDbEQsTUFBTSxNQUFNLEdBQWlCLElBQUkscUJBQVksRUFBRSxDQUFDO0lBQ2hELE1BQU0sTUFBTSxHQUFZLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUM1QyxJQUFJLE1BQUEsR0FBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLE9BQU8sMENBQUUsYUFBYSxFQUFFO1FBQy9CLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDL0QsSUFBSTtZQUNGLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxZQUFZLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDekQsTUFBTSxJQUFJLEdBQUcsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztnQkFDeEMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTthQUN0QixDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNULE1BQU0sSUFBQSxzQkFBYSxFQUFDLHFCQUFxQixDQUFDLENBQUM7YUFDNUM7WUFDRCxHQUFHLEdBQUcsSUFBQSxnQkFBTSxFQUFDLCtCQUErQixFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ25FLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1NBQ3BCO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxNQUFNLElBQUEsNEJBQW1CLEVBQUMsc0JBQXNCLENBQUMsQ0FBQztTQUNuRDtRQUNELE1BQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0tBQ2xCO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyxDQUFDO0FBdkJXLFFBQUEsSUFBSSxRQXVCZiJ9