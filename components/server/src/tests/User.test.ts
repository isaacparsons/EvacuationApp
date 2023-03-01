import Mailhog from "../dev/Mailhog";
import { deleteDb, setupUser } from "../dev/dbUtil";
import { PrismaClient } from "@prisma/client";
import { USER1, USER2 } from "../dev/testData";
import { server } from "../server";
import { LOGIN, SIGNUP, RESET_PASSWORD } from "../dev/gql/auth";

const mailhog = new Mailhog();
const prisma = new PrismaClient();

describe("user tests", () => {
  beforeEach(async () => {
    await deleteDb();
    await mailhog.deleteAllEmails();
  });
  describe("Sign up", () => {
    it("shouldnt be able to sign up if account exists with email and account created=true", async () => {
      const { user, token } = await setupUser(USER1);

      const result = await server.executeOperation({
        query: SIGNUP,
        variables: {
          email: USER1.email,
          phoneNumber: USER2.phoneNumber,
          firstName: USER1.firstName,
          lastName: USER1.lastName,
          password: USER1.password
        }
      });
      expect(result.errors?.length).toEqual(1);
      expect(result.errors?.[0]?.message).toEqual("An account with this email already exists");
    });
    it("shouldnt be able to sign up if account with phone number already exists and account created=true", async () => {
      const { user, token } = await setupUser(USER1);

      const result = await server.executeOperation({
        query: SIGNUP,
        variables: {
          email: USER2.email,
          phoneNumber: USER1.phoneNumber,
          firstName: USER1.firstName,
          lastName: USER1.lastName,
          password: USER1.password
        }
      });
      expect(result.errors?.length).toEqual(1);
      expect(result.errors?.[0]?.message).toEqual(
        "An account with this phone number already exists"
      );
    });
    it("should be able to sign up if account exists and account created == false", async () => {
      const { user, token } = await setupUser({
        email: USER1.email,
        phoneNumber: USER1.phoneNumber,
        password: USER1.password,
        accountCreated: false
      });

      const result = await server.executeOperation({
        query: SIGNUP,
        variables: {
          email: USER1.email,
          phoneNumber: USER1.phoneNumber,
          firstName: USER1.firstName,
          lastName: USER1.lastName,
          password: USER1.password
        }
      });
      expect(result?.data?.signup).toEqual({
        token: expect.any(String),
        user: {
          id: user.id,
          email: USER1.email,
          phoneNumber: USER1.phoneNumber,
          firstName: USER1.firstName,
          lastName: USER1.lastName,
          accountCreated: true,
          passwordHash: undefined
        }
      });
      const createdUser = await prisma.user.findUnique({
        where: {
          email: USER1.email
        }
      });
      expect(createdUser).toEqual({
        id: user.id,
        email: USER1.email,
        passwordHash: expect.any(String),
        phoneNumber: USER1.phoneNumber,
        firstName: USER1.firstName,
        lastName: USER1.lastName,
        accountCreated: true
      });
    });
    it("should be able to sign up if account doesnt exist and account created == false", async () => {
      const result = await server.executeOperation({
        query: SIGNUP,
        variables: {
          email: USER1.email,
          phoneNumber: USER1.phoneNumber,
          firstName: USER1.firstName,
          lastName: USER1.lastName,
          password: USER1.password
        }
      });
      expect(result?.data?.signup).toEqual({
        token: expect.any(String),
        user: {
          id: expect.any(Number),
          email: USER1.email,
          phoneNumber: USER1.phoneNumber,
          firstName: USER1.firstName,
          lastName: USER1.lastName,
          accountCreated: true,
          passwordHash: undefined
        }
      });
      const createdUser = await prisma.user.findUnique({
        where: {
          email: USER1.email
        }
      });
      expect(createdUser).toEqual({
        id: expect.any(Number),
        email: USER1.email,
        passwordHash: expect.any(String),
        phoneNumber: USER1.phoneNumber,
        firstName: USER1.firstName,
        lastName: USER1.lastName,
        accountCreated: true
      });
    });
  });
  describe("Log in", () => {
    it("should be able to login if account exists and account created == true", async () => {
      const { user, token } = await setupUser(USER1);

      const result = await server.executeOperation({
        query: LOGIN,
        variables: {
          email: USER1.email,
          password: USER1.password
        }
      });
      expect(result?.data?.login).toEqual({
        token: expect.any(String),
        user: {
          id: user.id,
          email: USER1.email,
          phoneNumber: USER1.phoneNumber,
          firstName: USER1.firstName,
          lastName: USER1.lastName,
          accountCreated: true,
          passwordHash: undefined
        }
      });
      const createdUser = await prisma.user.findUnique({
        where: {
          email: USER1.email
        }
      });
      expect(createdUser).toEqual({
        id: user.id,
        email: USER1.email,
        passwordHash: expect.any(String),
        phoneNumber: USER1.phoneNumber,
        firstName: USER1.firstName,
        lastName: USER1.lastName,
        accountCreated: true
      });
    });
    it("shouldnt be able to login if account exists and account created == false", async () => {
      const { user, token } = await setupUser({
        email: USER1.email,
        phoneNumber: USER1.phoneNumber,
        password: USER1.password,
        accountCreated: false
      });

      const result = await server.executeOperation({
        query: LOGIN,
        variables: {
          email: USER1.email,
          password: USER1.password
        }
      });

      expect(result.errors?.length).toEqual(1);
      expect(result.errors?.[0]?.message).toEqual(
        `Account has not been setup, go to signup to complete`
      );
    });
    it("shouldnt be able to login if account doesnt exist", async () => {
      const result = await server.executeOperation({
        query: LOGIN,
        variables: {
          email: USER1.email,
          password: USER1.password
        }
      });
      expect(result.errors?.length).toEqual(1);
      expect(result.errors?.[0]?.message).toEqual(`No user found with email: ${USER1.email}`);
    });
    it("shouldnt be able to login if password is incorrect", async () => {
      const { user, token } = await setupUser(USER1);
      const result = await server.executeOperation({
        query: LOGIN,
        variables: {
          email: USER1.email,
          password: "xxxxx"
        }
      });
      expect(result.errors?.length).toEqual(1);
      expect(result.errors?.[0]?.message).toEqual("Password is incorrect");
    });
  });
  describe("Reset password", () => {
    it("shouldnt be able to reset password if account exists and account created == false", async () => {
      const { user, token } = await setupUser({
        email: USER1.email,
        phoneNumber: USER1.phoneNumber,
        password: USER1.password,
        accountCreated: false
      });
      const result = await server.executeOperation({
        query: RESET_PASSWORD,
        variables: {
          email: USER1.email
        }
      });
      expect(result.errors?.length).toEqual(1);
      expect(result.errors?.[0]?.message).toEqual(
        "Account has not been setup, go to signup to complete"
      );
    });
    it("shouldnt be able to reset password if account doesnt exist", async () => {
      const result = await server.executeOperation({
        query: RESET_PASSWORD,
        variables: {
          email: USER1.email
        }
      });
      expect(result.errors?.length).toEqual(1);
      expect(result.errors?.[0]?.message).toEqual(`No user found for email: ${USER1.email}`);
    });
    it("should be able to reset password if account exists and account created == true", async () => {
      const { user, token } = await setupUser(USER1);
      const result = await server.executeOperation({
        query: RESET_PASSWORD,
        variables: {
          email: USER1.email
        }
      });
      expect(result?.data?.resetPassword).toEqual({ ...user, passwordHash: undefined });

      const emails = await mailhog.getEmails();

      const email = emails[0];
      const recepients = mailhog.getRecepients(email);
      expect(mailhog.getSender(email)).toEqual(process.env.EMAIL);
      expect(recepients[0]).toEqual(USER1.email);
      expect(recepients.length).toEqual(1);
      expect(mailhog.getSubject(email)).toEqual("Reset Password");
    });
    it("test fail", async () => {
      expect(1).toEqual(2);
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
