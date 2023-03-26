import { MockContext, Context, createMockContext } from "../../context";
import AuthResolver from "../Auth";
import UserRepository from "../../db/user";
import bcrypt from "bcryptjs";

jest.mock("../../db/user");

let mockCtx: MockContext;
let context: Context;

const mockUser = {
  email: "test@email.com",
  id: 1,
  accountCreated: true,
  passwordHash: "123"
};

beforeEach(() => {
  mockCtx = createMockContext();
  context = mockCtx as unknown as Context;
});

describe("Auth resolver tests", () => {
  const mockedUserRepository = UserRepository as jest.Mock;
  const mockGetUserByEmail = jest.fn();
  describe("login", () => {
    const mockCompare = jest.spyOn(bcrypt, "compare");
    it("if user exists, account is created, and password is correct, should return user and tokens", async () => {
      mockCompare.mockReturnValue(true);
      mockGetUserByEmail.mockReturnValue(mockUser);
      mockedUserRepository.mockReturnValue({
        getUserByEmail: mockGetUserByEmail
      });
      await AuthResolver.Mutation!.login!(
        {},
        { email: mockUser.email, password: "password" },
        context,
        {} as any
      );
      expect(mockGetUserByEmail).toBeCalledWith({ email: mockUser.email });
    });
    it("if user does not exist, should throw error", async () => {
      mockGetUserByEmail.mockReturnValue(null);
      mockedUserRepository.mockReturnValue({
        getUserByEmail: mockGetUserByEmail
      });
      const login = AuthResolver.Mutation!.login!(
        {},
        { email: mockUser.email, password: "password" },
        context,
        {} as any
      );
      expect(login).rejects.toEqual(new Error(`No user found with email: ${mockUser.email}`));
      expect(mockGetUserByEmail).toBeCalledWith({ email: mockUser.email });
    });
    it("should throw error if account has not been created", async () => {
      mockGetUserByEmail.mockReturnValue({ ...mockUser, accountCreated: false });
      mockedUserRepository.mockReturnValue({
        getUserByEmail: mockGetUserByEmail
      });
      const login = AuthResolver.Mutation!.login!(
        {},
        { email: mockUser.email, password: "password" },
        context,
        {} as any
      );
      expect(login).rejects.toEqual(
        new Error(`Account has not been setup, go to signup to complete`)
      );
      expect(mockGetUserByEmail).toBeCalledWith({ email: mockUser.email });
    });
    it("should throw error if password is incorrect", async () => {
      mockCompare.mockReturnValue(false);
      mockGetUserByEmail.mockReturnValue(mockUser);
      mockedUserRepository.mockReturnValue({
        getUserByEmail: mockGetUserByEmail
      });
      const login = AuthResolver.Mutation!.login!(
        {},
        { email: mockUser.email, password: "password" },
        context,
        {} as any
      );
      expect(login).rejects.toEqual(new Error(`Password is incorrect`));
      expect(mockGetUserByEmail).toBeCalledWith({ email: mockUser.email });
    });
  });
  describe("signup", () => {
    const mockHash = jest.spyOn(bcrypt, "hash");
    mockHash.mockReturnValue("1234567890");
    it("if user exists with email and account has been created, should throw error", async () => {
      mockGetUserByEmail.mockReturnValue(mockUser);
      mockedUserRepository.mockReturnValue({
        getUserByEmail: mockGetUserByEmail
      });
      await AuthResolver.Mutation!.login!(
        {},
        { email: mockUser.email, password: "password" },
        context,
        {} as any
      );
      expect(mockGetUserByEmail).toBeCalledWith({ email: mockUser.email });
    });
    // it("if user exists with phone number and account has been created, should throw error", async () => {});
  });
});
