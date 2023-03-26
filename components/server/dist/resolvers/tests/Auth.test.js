"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("../../context");
const Auth_1 = __importDefault(require("../Auth"));
const user_1 = __importDefault(require("../../db/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
jest.mock("../../db/user");
let mockCtx;
let context;
const mockUser = {
    email: "test@email.com",
    id: 1,
    accountCreated: true,
    passwordHash: "123"
};
beforeEach(() => {
    mockCtx = (0, context_1.createMockContext)();
    context = mockCtx;
});
describe("Auth resolver tests", () => {
    const mockedUserRepository = user_1.default;
    const mockGetUserByEmail = jest.fn();
    describe("login", () => {
        const mockCompare = jest.spyOn(bcryptjs_1.default, "compare");
        it("if user exists, account is created, and password is correct, should return user and tokens", async () => {
            mockCompare.mockReturnValue(true);
            mockGetUserByEmail.mockReturnValue(mockUser);
            mockedUserRepository.mockReturnValue({
                getUserByEmail: mockGetUserByEmail
            });
            await Auth_1.default.Mutation.login({}, { email: mockUser.email, password: "password" }, context, {});
            expect(mockGetUserByEmail).toBeCalledWith({ email: mockUser.email });
        });
        it("if user does not exist, should throw error", async () => {
            mockGetUserByEmail.mockReturnValue(null);
            mockedUserRepository.mockReturnValue({
                getUserByEmail: mockGetUserByEmail
            });
            const login = Auth_1.default.Mutation.login({}, { email: mockUser.email, password: "password" }, context, {});
            expect(login).rejects.toEqual(new Error(`No user found with email: ${mockUser.email}`));
            expect(mockGetUserByEmail).toBeCalledWith({ email: mockUser.email });
        });
        it("should throw error if account has not been created", async () => {
            mockGetUserByEmail.mockReturnValue(Object.assign(Object.assign({}, mockUser), { accountCreated: false }));
            mockedUserRepository.mockReturnValue({
                getUserByEmail: mockGetUserByEmail
            });
            const login = Auth_1.default.Mutation.login({}, { email: mockUser.email, password: "password" }, context, {});
            expect(login).rejects.toEqual(new Error(`Account has not been setup, go to signup to complete`));
            expect(mockGetUserByEmail).toBeCalledWith({ email: mockUser.email });
        });
        it("should throw error if password is incorrect", async () => {
            mockCompare.mockReturnValue(false);
            mockGetUserByEmail.mockReturnValue(mockUser);
            mockedUserRepository.mockReturnValue({
                getUserByEmail: mockGetUserByEmail
            });
            const login = Auth_1.default.Mutation.login({}, { email: mockUser.email, password: "password" }, context, {});
            expect(login).rejects.toEqual(new Error(`Password is incorrect`));
            expect(mockGetUserByEmail).toBeCalledWith({ email: mockUser.email });
        });
    });
    describe("signup", () => {
        const mockHash = jest.spyOn(bcryptjs_1.default, "hash");
        mockHash.mockReturnValue("1234567890");
        it("if user exists with email and account has been created, should throw error", async () => {
            mockGetUserByEmail.mockReturnValue(mockUser);
            mockedUserRepository.mockReturnValue({
                getUserByEmail: mockGetUserByEmail
            });
            await Auth_1.default.Mutation.login({}, { email: mockUser.email, password: "password" }, context, {});
            expect(mockGetUserByEmail).toBeCalledWith({ email: mockUser.email });
        });
        // it("if user exists with phone number and account has been created, should throw error", async () => {});
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXV0aC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Jlc29sdmVycy90ZXN0cy9BdXRoLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwyQ0FBd0U7QUFDeEUsbURBQW1DO0FBQ25DLHlEQUEyQztBQUMzQyx3REFBOEI7QUFFOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUUzQixJQUFJLE9BQW9CLENBQUM7QUFDekIsSUFBSSxPQUFnQixDQUFDO0FBRXJCLE1BQU0sUUFBUSxHQUFHO0lBQ2YsS0FBSyxFQUFFLGdCQUFnQjtJQUN2QixFQUFFLEVBQUUsQ0FBQztJQUNMLGNBQWMsRUFBRSxJQUFJO0lBQ3BCLFlBQVksRUFBRSxLQUFLO0NBQ3BCLENBQUM7QUFFRixVQUFVLENBQUMsR0FBRyxFQUFFO0lBQ2QsT0FBTyxHQUFHLElBQUEsMkJBQWlCLEdBQUUsQ0FBQztJQUM5QixPQUFPLEdBQUcsT0FBNkIsQ0FBQztBQUMxQyxDQUFDLENBQUMsQ0FBQztBQUVILFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7SUFDbkMsTUFBTSxvQkFBb0IsR0FBRyxjQUEyQixDQUFDO0lBQ3pELE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO0lBQ3JDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1FBQ3JCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsa0JBQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNsRCxFQUFFLENBQUMsNEZBQTRGLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDMUcsV0FBVyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDN0Msb0JBQW9CLENBQUMsZUFBZSxDQUFDO2dCQUNuQyxjQUFjLEVBQUUsa0JBQWtCO2FB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