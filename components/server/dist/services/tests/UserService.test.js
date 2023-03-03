"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("../../context");
let mockCtx;
let context;
beforeEach(() => {
    mockCtx = (0, context_1.createMockContext)();
    context = mockCtx;
});
describe("group service unit tests", () => {
    beforeEach(async () => { });
    describe("inviteToOrganization", () => {
        it("should return 1 succeeded user and 1 failed user", async () => { });
    });
});
// import { Prisma, PrismaClient, User } from "@prisma/client";
// import * as bcrypt from "bcryptjs";
// import * as jwt from "jsonwebtoken";
// import KEYS from "../../config/keys";
// import EmailService from "../EmailService";
// import UserService from "../UserService";
// const { JWT, CLIENT } = KEYS.default;
// jest.mock("../EmailService");
// const prisma = new PrismaClient();
// const userService = new UserService();
// describe("UserService integration tests", () => {
//   describe("signup", () => {
//     beforeEach(async () => {
//       await prisma.user.deleteMany();
//     });
//     it("should sign up a user if account doesnt exist", async () => {
//       const mockUserSignup = {
//         email: "test@email.com",
//         password: "pass",
//         phoneNumber: "12345678"
//       };
//       const user = await userService.signup(mockUserSignup);
//       expect(user).toEqual(
//         expect.objectContaining({
//           user: {
//             id: expect.any(Number),
//             email: mockUserSignup.email,
//             phoneNumber: mockUserSignup.phoneNumber,
//             accountCreated: true
//           },
//           token: expect.any(String)
//         })
//       );
//       expect(user).toEqual(
//         expect.not.objectContaining({
//           user: {
//             password: expect.any(String)
//           }
//         })
//       );
//     });
//     it("should throw error if user already exists with email and account is created", async () => {
//       const mockUserSignup = {
//         email: "test@email.com",
//         password: "pass",
//         phoneNumber: "12345678"
//       };
//       await prisma.user.create({
//         data: {
//           email: mockUserSignup.email,
//           passwordHash: "1234",
//           phoneNumber: "123123123",
//           accountCreated: true
//         }
//       });
//       const user = userService.signup(mockUserSignup);
//       await expect(user).rejects.toEqual(
//         new Error("An account with this email/phone number already exists")
//       );
//     });
//     it("should update user if the account is not created", async () => {
//       const mockUserSignup = {
//         email: "test@email.com",
//         password: "pass",
//         phoneNumber: "12345678"
//       };
//       await prisma.user.create({
//         data: {
//           email: mockUserSignup.email,
//           accountCreated: false
//         }
//       });
//       const user = await userService.signup(mockUserSignup);
//       expect(user).toEqual(
//         expect.objectContaining({
//           user: {
//             id: expect.any(Number),
//             email: mockUserSignup.email,
//             phoneNumber: mockUserSignup.phoneNumber,
//             accountCreated: true
//           },
//           token: expect.any(String)
//         })
//       );
//       expect(user).toEqual(
//         expect.not.objectContaining({
//           user: {
//             password: expect.any(String)
//           }
//         })
//       );
//     });
//   });
//   describe("login", () => {
//     beforeEach(async () => {
//       await prisma.user.deleteMany();
//     });
//     it("should log in if the user exists and password is correct", async () => {
//       const mockUserLogin = {
//         email: "test@email.com",
//         password: "pass"
//       };
//       const passwordHash = await bcrypt.hash(mockUserLogin.password, 10);
//       await prisma.user.create({
//         data: {
//           email: mockUserLogin.email,
//           passwordHash,
//           phoneNumber: "123123123",
//           accountCreated: true
//         }
//       });
//       const user = await userService.login(mockUserLogin);
//       expect(user).toEqual(
//         expect.objectContaining({
//           user: {
//             id: expect.any(Number),
//             email: mockUserLogin.email,
//             phoneNumber: expect.any(String),
//             accountCreated: true
//           },
//           token: expect.any(String)
//         })
//       );
//       expect(user).toEqual(
//         expect.not.objectContaining({
//           user: {
//             password: expect.any(String)
//           }
//         })
//       );
//     });
//     it("should throw error if the account doesnt exist", async () => {
//       const mockUserLogin = {
//         email: "test@email.com",
//         password: "pass"
//       };
//       const user = userService.login(mockUserLogin);
//       await expect(user).rejects.toEqual(
//         new Error(`No user found with email: ${mockUserLogin.email}`)
//       );
//     });
//     it("should throw error if the password is incorrect", async () => {
//       const mockUserLogin = {
//         email: "test@email.com",
//         password: "pass"
//       };
//       const passwordHash = await bcrypt.hash("pass2", 10);
//       await prisma.user.create({
//         data: {
//           email: mockUserLogin.email,
//           passwordHash,
//           phoneNumber: "123123123",
//           accountCreated: true
//         }
//       });
//       const user = userService.login(mockUserLogin);
//       await expect(user).rejects.toEqual(new Error("Invalid password"));
//     });
//   });
//   describe("delete account", () => {
//     beforeEach(async () => {
//       await prisma.user.deleteMany();
//     });
//     it("should delete account if it exists", async () => {
//       const mockUser = {
//         email: "test@email.com",
//         phoneNumber: "123123123",
//         accountCreated: true
//       };
//       await prisma.user.create({
//         data: {
//           email: mockUser.email,
//           passwordHash: "12412312",
//           phoneNumber: "123123123",
//           accountCreated: true
//         }
//       });
//       const user = await userService.delete(mockUser.email);
//       expect(user).toEqual(
//         expect.objectContaining({
//           id: expect.any(Number),
//           email: mockUser.email,
//           phoneNumber: mockUser.phoneNumber,
//           accountCreated: mockUser.accountCreated
//         })
//       );
//       expect(user).toEqual(
//         expect.not.objectContaining({
//           password: expect.any(String)
//         })
//       );
//     });
//     it("should do nothing if account doesnt exist", async () => {
//       const mockEmail = "test@email.com";
//       const user = await userService.delete(mockEmail);
//       expect(user).toBe(null);
//     });
//   });
//   describe("reset password", () => {
//     const mockEmailService = EmailService as jest.Mock;
//     const mockSendPasswordReset = jest.fn();
//     beforeEach(async () => {
//       jest.resetAllMocks();
//       await prisma.user.deleteMany();
//     });
//     it("should send email to user if account exists", async () => {
//       const mockEmail = "test@email.com";
//       mockEmailService.mockReturnValue({
//         sendPasswordReset: mockSendPasswordReset
//       });
//       const user = await prisma.user.create({
//         data: {
//           email: mockEmail,
//           passwordHash: "123123123",
//           phoneNumber: "123123123",
//           accountCreated: true
//         }
//       });
//       const _user = await userService.resetPassword(mockEmail);
//       expect(_user).toEqual(
//         expect.objectContaining({
//           id: expect.any(Number),
//           email: mockEmail,
//           phoneNumber: expect.any(String),
//           accountCreated: true
//         })
//       );
//       expect(_user).toEqual(
//         expect.not.objectContaining({
//           password: expect.any(String)
//         })
//       );
//       expect(mockSendPasswordReset).toBeCalledWith(_user);
//     });
//     it("shouldnt throw error if account doesnt exist", async () => {
//       const mockEmail = "test@email.com";
//       const user = userService.resetPassword(mockEmail);
//       await expect(user).rejects.toEqual(
//         new Error(`No user found for email: ${mockEmail}`)
//       );
//       expect(mockSendPasswordReset).not.toBeCalled();
//     });
//   });
//   describe("update user", () => {
//     beforeEach(async () => {
//       await prisma.user.deleteMany();
//     });
//     it("should update password/phonenumber if account exists and set account created to true", async () => {
//       const mockEmail = "test@test.com";
//       const mockUpdateUser = { password: "456", phoneNumber: "1234567" };
//       const user = await prisma.user.create({
//         data: {
//           email: mockEmail,
//           accountCreated: false
//         }
//       });
//       await userService.updateUser({ user, ...mockUpdateUser });
//       const updatedUser = await prisma.user.findUnique({
//         where: { email: mockEmail }
//       });
//       const valid = await bcrypt.compare(
//         mockUpdateUser.password,
//         updatedUser?.passwordHash
//       );
//       expect(valid).toEqual(true);
//       expect(updatedUser?.accountCreated).toEqual(true);
//       expect(updatedUser?.phoneNumber).toEqual(mockUpdateUser.phoneNumber);
//     });
//   });
//   afterAll(async () => {
//     const deleteUser = prisma.user.deleteMany();
//     await prisma.$transaction([deleteUser]);
//     await prisma.$disconnect();
//   });
// });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlclNlcnZpY2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlcy90ZXN0cy9Vc2VyU2VydmljZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkNBQXdFO0FBRXhFLElBQUksT0FBb0IsQ0FBQztBQUN6QixJQUFJLE9BQWdCLENBQUM7QUFFckIsVUFBVSxDQUFDLEdBQUcsRUFBRTtJQUNkLE9BQU8sR0FBRyxJQUFBLDJCQUFpQixHQUFFLENBQUM7SUFDOUIsT0FBTyxHQUFHLE9BQTZCLENBQUM7QUFDMUMsQ0FBQyxDQUFDLENBQUM7QUFFSCxRQUFRLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLFVBQVUsQ0FBQyxLQUFLLElBQUksRUFBRSxHQUFFLENBQUMsQ0FBQyxDQUFDO0lBRTNCLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUU7UUFDcEMsRUFBRSxDQUFDLGtEQUFrRCxFQUFFLEtBQUssSUFBSSxFQUFFLEdBQUUsQ0FBQyxDQUFDLENBQUM7SUFDekUsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILCtEQUErRDtBQUMvRCxzQ0FBc0M7QUFDdEMsdUNBQXVDO0FBQ3ZDLHdDQUF3QztBQUN4Qyw4Q0FBOEM7QUFDOUMsNENBQTRDO0FBQzVDLHdDQUF3QztBQUV4QyxnQ0FBZ0M7QUFFaEMscUNBQXFDO0FBRXJDLHlDQUF5QztBQUN6QyxvREFBb0Q7QUFDcEQsK0JBQStCO0FBQy9CLCtCQUErQjtBQUMvQix3Q0FBd0M7QUFDeEMsVUFBVTtBQUNWLHdFQUF3RTtBQUN4RSxpQ0FBaUM7QUFDakMsbUNBQW1DO0FBQ25DLDRCQUE0QjtBQUM1QixrQ0FBa0M7QUFDbEMsV0FBVztBQUNYLCtEQUErRDtBQUMvRCw4QkFBOEI7QUFDOUIsb0NBQW9DO0FBQ3BDLG9CQUFvQjtBQUNwQixzQ0FBc0M7QUFDdEMsMkNBQTJDO0FBQzNDLHVEQUF1RDtB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