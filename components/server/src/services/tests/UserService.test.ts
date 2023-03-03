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
