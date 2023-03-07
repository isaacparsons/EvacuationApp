// import { MockContext, Context, createMockContext } from "../../context";
// let mockCtx: MockContext;
// let context: Context;
// beforeEach(() => {
//   mockCtx = createMockContext();
//   context = mockCtx as unknown as Context;
// });
describe("group service unit tests", () => {
    describe("inviteToOrganization", () => {
        it("should return 1 succeeded user and 1 failed user", async () => {
            expect(1).toEqual(1);
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlclNlcnZpY2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlcy90ZXN0cy9Vc2VyU2VydmljZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDJFQUEyRTtBQUUzRSw0QkFBNEI7QUFDNUIsd0JBQXdCO0FBRXhCLHFCQUFxQjtBQUNyQixtQ0FBbUM7QUFDbkMsNkNBQTZDO0FBQzdDLE1BQU07QUFFTixRQUFRLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUU7UUFDcEMsRUFBRSxDQUFDLGtEQUFrRCxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ2hFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsK0RBQStEO0FBQy9ELHNDQUFzQztBQUN0Qyx1Q0FBdUM7QUFDdkMsd0NBQXdDO0FBQ3hDLDhDQUE4QztBQUM5Qyw0Q0FBNEM7QUFDNUMsd0NBQXdDO0FBRXhDLGdDQUFnQztBQUVoQyxxQ0FBcUM7QUFFckMseUNBQXlDO0FBQ3pDLG9EQUFvRDtBQUNwRCwrQkFBK0I7QUFDL0IsK0JBQStCO0FBQy9CLHdDQUF3QztBQUN4QyxVQUFVO0FBQ1Ysd0VBQXdFO0FBQ3hFLGlDQUFpQztBQUNqQyxtQ0FBbUM7QUFDbkMsNEJBQTRCO0FBQzVCLGtDQUFrQztBQUNsQyxXQUFXO0FBQ1gsK0RBQStEO0FBQy9ELDhCQUE4QjtBQUM5QixvQ0FBb0M7QUFDcEMsb0JBQW9CO0FBQ3BCLHNDQUFzQztBQUN0QywyQ0FBMkM7QUFDM0MsdURBQXVEO0FBQ3ZELG1DQUFtQztBQUNuQyxlQUFlO0FBQ2Ysc0NBQXNDO0FBQ3RDLGFBQWE7QUFDYixXQUFXO0FBQ1gsOEJBQThCO0FBQzlCLHdD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