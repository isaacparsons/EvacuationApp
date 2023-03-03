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
            const { user, token } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
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
            const { user, token } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
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
            expect((_c = (_b = result.errors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message).toEqual("An account with this phone number already exists");
        });
        it("should be able to sign up if account exists and account created == false", async () => {
            var _a;
            const { user, token } = await (0, dbUtil_1.setupUser)({
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
            const { user, token } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
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
            const { user, token } = await (0, dbUtil_1.setupUser)({
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
            const { user, token } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
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
            const { user, token } = await (0, dbUtil_1.setupUser)({
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
            const { user, token } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const result = await server_1.server.executeOperation({
                query: auth_1.RESET_PASSWORD,
                variables: {
                    email: testData_1.USER1.email
                }
            });
            expect((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.resetPassword).toEqual(Object.assign(Object.assign({}, user), { passwordHash: undefined }));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Rlc3RzL1VzZXIudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDZEQUFxQztBQUNyQywwQ0FBb0Q7QUFDcEQsMkNBQThDO0FBQzlDLDhDQUErQztBQUMvQyxzQ0FBbUM7QUFDbkMsMENBQWdFO0FBRWhFLE1BQU0sT0FBTyxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO0FBQzlCLE1BQU0sTUFBTSxHQUFHLElBQUkscUJBQVksRUFBRSxDQUFDO0FBRWxDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO0lBQzFCLFVBQVUsQ0FBQyxLQUFLLElBQUksRUFBRTtRQUNwQixNQUFNLElBQUEsaUJBQVEsR0FBRSxDQUFDO1FBQ2pCLE1BQU0sT0FBTyxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQ2xDLENBQUMsQ0FBQyxDQUFDO0lBQ0gsUUFBUSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7UUFDdkIsRUFBRSxDQUFDLG1GQUFtRixFQUFFLEtBQUssSUFBSSxFQUFFOztZQUNqRyxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLE1BQU0sSUFBQSxrQkFBUyxFQUFDLGdCQUFLLENBQUMsQ0FBQztZQUUvQyxNQUFNLE1BQU0sR0FBRyxNQUFNLGVBQU0sQ0FBQyxnQkFBZ0IsQ0FBQztnQkFDM0MsS0FBSyxFQUFFLGFBQU07Z0JBQ2IsU0FBUyxFQUFFO29CQUNULEtBQUssRUFBRSxnQkFBSyxDQUFDLEtBQUs7b0JBQ2xCLFdBQVcsRUFBRSxnQkFBSyxDQUFDLFdBQVc7b0JBQzlCLFNBQVMsRUFBRSxnQkFBSyxDQUFDLFNBQVM7b0JBQzFCLFFBQVEsRUFBRSxnQkFBSyxDQUFDLFFBQVE7b0JBQ3hCLFFBQVEsRUFBRSxnQkFBSyxDQUFDLFFBQVE7aUJBQ3pCO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLE1BQUEsTUFBTSxDQUFDLE1B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