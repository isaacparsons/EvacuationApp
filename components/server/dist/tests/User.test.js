"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mailhog_1 = __importDefault(require("../dev/Mailhog"));
const dbUtil_1 = require("../dev/dbUtil");
const client_1 = require("@prisma/client");
const testData_1 = require("../dev/testData");
const server_1 = require("../server");
const auth_1 = require("../dev/gql/auth");
const mailhog = new Mailhog_1.default();
const prisma = new client_1.PrismaClient();
describe("user tests", () => {
    beforeEach(async () => {
        await (0, dbUtil_1.deleteDb)();
        await mailhog.deleteAllEmails();
    });
    describe("Sign up", () => {
        it("shouldnt be able to sign up if account exists with email and account created=true", async () => {
            var _a, _b, _c;
            await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const result = await server_1.server.executeOperation({
                query: auth_1.SIGNUP,
                variables: {
                    email: testData_1.USER1.email,
                    phoneNumber: testData_1.USER2.phoneNumber,
                    firstName: testData_1.USER1.firstName,
                    lastName: testData_1.USER1.lastName,
                    password: testData_1.USER1.password
                }
            });
            expect((_a = result.errors) === null || _a === void 0 ? void 0 : _a.length).toEqual(1);
            expect((_c = (_b = result.errors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message).toEqual("An account with this email already exists");
        });
        it("shouldnt be able to sign up if account with phone number already exists and account created=true", async () => {
            var _a, _b, _c;
            await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const result = await server_1.server.executeOperation({
                query: auth_1.SIGNUP,
                variables: {
                    email: testData_1.USER2.email,
                    phoneNumber: testData_1.USER1.phoneNumber,
                    firstName: testData_1.USER1.firstName,
                    lastName: testData_1.USER1.lastName,
                    password: testData_1.USER1.password
                }
            });
            expect((_a = result.errors) === null || _a === void 0 ? void 0 : _a.length).toEqual(1);
            expect((_c = (_b = result.errors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message).toEqual("An account with this email/phone number already exists");
        });
        it("should be able to sign up if account exists and account created == false", async () => {
            var _a;
            const { user } = await (0, dbUtil_1.setupUser)({
                email: testData_1.USER1.email,
                phoneNumber: testData_1.USER1.phoneNumber,
                password: testData_1.USER1.password,
                accountCreated: false
            });
            const result = await server_1.server.executeOperation({
                query: auth_1.SIGNUP,
                variables: {
                    email: testData_1.USER1.email,
                    phoneNumber: testData_1.USER1.phoneNumber,
                    firstName: testData_1.USER1.firstName,
                    lastName: testData_1.USER1.lastName,
                    password: testData_1.USER1.password
                }
            });
            expect((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.signup).toEqual({
                token: expect.any(String),
                user: {
                    id: user.id,
                    email: testData_1.USER1.email,
                    phoneNumber: testData_1.USER1.phoneNumber,
                    firstName: testData_1.USER1.firstName,
                    lastName: testData_1.USER1.lastName,
                    accountCreated: true,
                    passwordHash: undefined
                }
            });
            const createdUser = await prisma.user.findUnique({
                where: {
                    email: testData_1.USER1.email
                }
            });
            expect(createdUser).toEqual({
                id: user.id,
                email: testData_1.USER1.email,
                passwordHash: expect.any(String),
                phoneNumber: testData_1.USER1.phoneNumber,
                firstName: testData_1.USER1.firstName,
                lastName: testData_1.USER1.lastName,
                accountCreated: true
            });
        });
        it("should be able to sign up if account doesnt exist and account created == false", async () => {
            var _a;
            const result = await server_1.server.executeOperation({
                query: auth_1.SIGNUP,
                variables: {
                    email: testData_1.USER1.email,
                    phoneNumber: testData_1.USER1.phoneNumber,
                    firstName: testData_1.USER1.firstName,
                    lastName: testData_1.USER1.lastName,
                    password: testData_1.USER1.password
                }
            });
            expect((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.signup).toEqual({
                token: expect.any(String),
                user: {
                    id: expect.any(Number),
                    email: testData_1.USER1.email,
                    phoneNumber: testData_1.USER1.phoneNumber,
                    firstName: testData_1.USER1.firstName,
                    lastName: testData_1.USER1.lastName,
                    accountCreated: true,
                    passwordHash: undefined
                }
            });
            const createdUser = await prisma.user.findUnique({
                where: {
                    email: testData_1.USER1.email
                }
            });
            expect(createdUser).toEqual({
                id: expect.any(Number),
                email: testData_1.USER1.email,
                passwordHash: expect.any(String),
                phoneNumber: testData_1.USER1.phoneNumber,
                firstName: testData_1.USER1.firstName,
                lastName: testData_1.USER1.lastName,
                accountCreated: true
            });
        });
    });
    describe("Log in", () => {
        it("should be able to login if account exists and account created == true", async () => {
            var _a;
            const { user } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const result = await server_1.server.executeOperation({
                query: auth_1.LOGIN,
                variables: {
                    email: testData_1.USER1.email,
                    password: testData_1.USER1.password
                }
            });
            expect((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.login).toEqual({
                token: expect.any(String),
                user: {
                    id: user.id,
                    email: testData_1.USER1.email,
                    phoneNumber: testData_1.USER1.phoneNumber,
                    firstName: testData_1.USER1.firstName,
                    lastName: testData_1.USER1.lastName,
                    accountCreated: true,
                    passwordHash: undefined
                }
            });
            const createdUser = await prisma.user.findUnique({
                where: {
                    email: testData_1.USER1.email
                }
            });
            expect(createdUser).toEqual({
                id: user.id,
                email: testData_1.USER1.email,
                passwordHash: expect.any(String),
                phoneNumber: testData_1.USER1.phoneNumber,
                firstName: testData_1.USER1.firstName,
                lastName: testData_1.USER1.lastName,
                accountCreated: true
            });
        });
        it("shouldnt be able to login if account exists and account created == false", async () => {
            var _a, _b, _c;
            await (0, dbUtil_1.setupUser)({
                email: testData_1.USER1.email,
                phoneNumber: testData_1.USER1.phoneNumber,
                password: testData_1.USER1.password,
                accountCreated: false
            });
            const result = await server_1.server.executeOperation({
                query: auth_1.LOGIN,
                variables: {
                    email: testData_1.USER1.email,
                    password: testData_1.USER1.password
                }
            });
            expect((_a = result.errors) === null || _a === void 0 ? void 0 : _a.length).toEqual(1);
            expect((_c = (_b = result.errors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message).toEqual(`Account has not been setup, go to signup to complete`);
        });
        it("shouldnt be able to login if account doesnt exist", async () => {
            var _a, _b, _c;
            const result = await server_1.server.executeOperation({
                query: auth_1.LOGIN,
                variables: {
                    email: testData_1.USER1.email,
                    password: testData_1.USER1.password
                }
            });
            expect((_a = result.errors) === null || _a === void 0 ? void 0 : _a.length).toEqual(1);
            expect((_c = (_b = result.errors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message).toEqual(`No user found with email: ${testData_1.USER1.email}`);
        });
        it("shouldnt be able to login if password is incorrect", async () => {
            var _a, _b, _c;
            await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const result = await server_1.server.executeOperation({
                query: auth_1.LOGIN,
                variables: {
                    email: testData_1.USER1.email,
                    password: "xxxxx"
                }
            });
            expect((_a = result.errors) === null || _a === void 0 ? void 0 : _a.length).toEqual(1);
            expect((_c = (_b = result.errors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message).toEqual("Password is incorrect");
        });
    });
    describe("Reset password", () => {
        it("shouldnt be able to reset password if account exists and account created == false", async () => {
            var _a, _b, _c;
            await (0, dbUtil_1.setupUser)({
                email: testData_1.USER1.email,
                phoneNumber: testData_1.USER1.phoneNumber,
                password: testData_1.USER1.password,
                accountCreated: false
            });
            const result = await server_1.server.executeOperation({
                query: auth_1.RESET_PASSWORD,
                variables: {
                    email: testData_1.USER1.email
                }
            });
            expect((_a = result.errors) === null || _a === void 0 ? void 0 : _a.length).toEqual(1);
            expect((_c = (_b = result.errors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message).toEqual("Account has not been setup, go to signup to complete");
        });
        it("shouldnt be able to reset password if account doesnt exist", async () => {
            var _a, _b, _c;
            const result = await server_1.server.executeOperation({
                query: auth_1.RESET_PASSWORD,
                variables: {
                    email: testData_1.USER1.email
                }
            });
            expect((_a = result.errors) === null || _a === void 0 ? void 0 : _a.length).toEqual(1);
            expect((_c = (_b = result.errors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message).toEqual(`No user found for email: ${testData_1.USER1.email}`);
        });
        it("should be able to reset password if account exists and account created == true", async () => {
            var _a;
            await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const result = await server_1.server.executeOperation({
                query: auth_1.RESET_PASSWORD,
                variables: {
                    email: testData_1.USER1.email
                }
            });
            expect((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.resetPassword).toEqual(testData_1.USER1.email);
            const emails = await mailhog.getEmails();
            const email = emails[0];
            const recepients = mailhog.getRecepients(email);
            expect(mailhog.getSender(email)).toEqual(process.env.EMAIL);
            expect(recepients[0]).toEqual(testData_1.USER1.email);
            expect(recepients.length).toEqual(1);
            expect(mailhog.getSubject(email)).toEqual("Reset Password");
        });
    });
    // describe("Delete account", () => {
    //   it('should delete user if account exists', async () => {})
    //   it('shouldnt delete account if it doesnt exist', async () => {})
    // })
    // describe("update account", () => {
    //   it('should update user if account exists and phone number doesnt already exist', async () => {})
    //   it('shouldnt update user if account doesnt exist', async () => {})
    // })
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Rlc3RzL1VzZXIudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDZEQUFxQztBQUNyQywwQ0FBb0Q7QUFDcEQsMkNBQThDO0FBQzlDLDhDQUErQztBQUMvQyxzQ0FBbUM7QUFDbkMsMENBQWdFO0FBRWhFLE1BQU0sT0FBTyxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO0FBQzlCLE1BQU0sTUFBTSxHQUFHLElBQUkscUJBQVksRUFBRSxDQUFDO0FBRWxDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO0lBQzFCLFVBQVUsQ0FBQyxLQUFLLElBQUksRUFBRTtRQUNwQixNQUFNLElBQUEsaUJBQVEsR0FBRSxDQUFDO1FBQ2pCLE1BQU0sT0FBTyxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQ2xDLENBQUMsQ0FBQyxDQUFDO0lBQ0gsUUFBUSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7UUFDdkIsRUFBRSxDQUFDLG1GQUFtRixFQUFFLEtBQUssSUFBSSxFQUFFOztZQUNqRyxNQUFNLElBQUEsa0JBQVMsRUFBQyxnQkFBSyxDQUFDLENBQUM7WUFFdkIsTUFBTSxNQUFNLEdBQUcsTUFBTSxlQUFNLENBQUMsZ0JBQWdCLENBQUM7Z0JBQzNDLEtBQUssRUFBRSxhQUFNO2dCQUNiLFNBQVMsRUFBRTtvQkFDVCxLQUFLLEVBQUUsZ0JBQUssQ0FBQyxLQUFLO29CQUNsQixXQUFXLEVBQUUsZ0JBQUssQ0FBQyxXQUFXO29CQUM5QixTQUFTLEVBQUUsZ0JBQUssQ0FBQyxTQUFTO29CQUMxQixRQUFRLEVBQUUsZ0JBQUssQ0FBQyxRQUFRO29CQUN4QixRQUFRLEVBQUUsZ0JBQUssQ0FBQyxRQUFRO2lCQUN6QjthQUNGLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxNQUFBLE1BQU0sQ0FBQyxNQUFNLDBDQUFFLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxD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