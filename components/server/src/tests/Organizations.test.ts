import { PrismaClient } from "@prisma/client";
import { gql } from "apollo-server";
import { deleteDb, updateInvite } from "../dev/dbUtil";
import {
  createOrg,
  deleteOrg,
  inviteUsersToOrg,
  removeOrgMembers,
  setupUser
} from "../dev/dbUtil";
import { USER2 } from "../dev/testData";
import {
  ORG,
  ORG_ADMIN_MEMBER,
  ORG_NON_ADMIN_MEMBER,
  USER1
} from "../dev/testData";
import { server } from "../server";
import TokenService from "../services/TokenService";
import { InviteUser } from "../types";

const prisma = new PrismaClient();
const tokenService = new TokenService();

interface InvitedOrganizationUser {
  admin: boolean;
  email: string;
  inviteToGroups: InviteUser[];
}

describe("organization tests", () => {
  beforeAll(async () => {
    await deleteDb();
  });

  describe("create org", () => {
    it("should create organization", async () => {
      const { user, token } = await setupUser(USER1);
      const result = await server.executeOperation(
        {
          query: gql`
            mutation Mutation($name: String!) {
              createOrganization(name: $name) {
                id
                name
                members {
                  id
                  userId
                  organizationId
                  status
                  admin
                  user {
                    id
                    email
                    phoneNumber
                    passwordHash
                    accountCreated
                  }
                }
              }
            }
          `,
          variables: { name: ORG.name }
        },
        { req: { headers: { authorization: `Bearer ${token}` } } } as any
      );
      const org = result.data?.createOrganization;
      expect(org).toEqual({
        id: expect.any(Number),
        name: ORG.name,
        members: [
          {
            id: expect.any(Number),
            userId: user.id,
            organizationId: expect.any(Number),
            status: "accepted",
            admin: true,
            user: {
              id: user.id,
              email: user.email,
              phoneNumber: user.phoneNumber,
              passwordHash: user.passwordHash,
              accountCreated: user.accountCreated
            }
          }
        ]
      });
    });
  });

  describe("delete org", () => {
    it("should delete org if user is admin", async () => {
      const { user, token } = await setupUser(USER1);
      const org = await prisma.organization.create({
        data: {
          ...ORG,
          members: {
            create: {
              user: {
                connect: { id: user.id }
              },
              ...ORG_ADMIN_MEMBER
            }
          }
        },
        include: {
          members: true
        }
      });
      const result = await server.executeOperation(
        {
          query: gql`
            mutation RemoveFromOrganization($organizationId: Int!) {
              deleteOrganization(organizationId: $organizationId) {
                id
                name
              }
            }
          `,
          variables: { organizationId: org.id }
        },
        { req: { headers: { authorization: `Bearer ${token}` } } } as any
      );
      const orgInDb = await prisma.organization.findUnique({
        where: {
          id: org.id
        }
      });
      expect(orgInDb).toEqual(null);
    });
    it("should not delete org if user is not admin", async () => {
      const { user, token } = await setupUser(USER1);
      const org = await prisma.organization.create({
        data: {
          ...ORG,
          members: {
            create: {
              user: {
                connect: { id: user.id }
              },
              ...ORG_NON_ADMIN_MEMBER
            }
          }
        },
        include: {
          members: true
        }
      });
      const result = await server.executeOperation(
        {
          query: gql`
            mutation RemoveFromOrganization($organizationId: Int!) {
              deleteOrganization(organizationId: $organizationId) {
                id
                name
              }
            }
          `,
          variables: { organizationId: org.id }
        },
        { req: { headers: { authorization: `Bearer ${token}` } } } as any
      );

      expect(result.errors?.length).toEqual(1);
      expect(result.errors?.[0]?.message).toEqual("Not Authorised!");
    });
  });

  describe("invite users", () => {
    it("should invite users to org if user is admin", async () => {
      const { user: adminUser, token: adminUserToken } = await setupUser(USER1);
      const { user: invitedUser, token: invitedUserToken } = await setupUser(
        USER2
      );

      const users = [{ admin: false, email: invitedUser.email }];

      const org = await prisma.organization.create({
        data: {
          ...ORG,
          members: {
            create: {
              user: {
                connect: { id: adminUser.id }
              },
              ...ORG_ADMIN_MEMBER
            }
          }
        },
        include: {
          members: true
        }
      });

      const result = await server.executeOperation(
        {
          query: gql`
            mutation InviteToOrganization(
              $organizationId: Int!
              $users: [InvitedOrganizationUser]
            ) {
              inviteToOrganization(
                organizationId: $organizationId
                users: $users
              ) {
                id
                userId
                organizationId
              }
            }
          `,
          variables: { organizationId: org.id, users }
        },
        {
          req: { headers: { authorization: `Bearer ${adminUserToken}` } }
        } as any
      );
      const invitedOrgMember = await prisma.organizationMember.findUnique({
        where: {
          userId_organizationId: {
            userId: invitedUser.id,
            organizationId: org.id
          }
        }
      });
      expect(invitedOrgMember).toEqual({
        id: expect.any(Number),
        userId: invitedUser.id,
        organizationId: org.id,
        status: "pending",
        admin: false
      });
    });
    it("should not invite users to org if user is not admin", async () => {
      const { user: adminUser, token: adminUserToken } = await setupUser(USER1);
      const { user: invitedUser, token: invitedUserToken } = await setupUser(
        USER2
      );

      const users = [{ admin: false, email: invitedUser.email }];

      const org = await prisma.organization.create({
        data: {
          ...ORG,
          members: {
            create: {
              user: {
                connect: { id: adminUser.id }
              },
              ...ORG_NON_ADMIN_MEMBER
            }
          }
        },
        include: {
          members: true
        }
      });

      const result = await server.executeOperation(
        {
          query: gql`
            mutation InviteToOrganization(
              $organizationId: Int!
              $users: [InvitedOrganizationUser]
            ) {
              inviteToOrganization(
                organizationId: $organizationId
                users: $users
              ) {
                id
                userId
                organizationId
              }
            }
          `,
          variables: { organizationId: org.id, users }
        },
        {
          req: { headers: { authorization: `Bearer ${adminUserToken}` } }
        } as any
      );
      const invitedOrgMember = await prisma.organizationMember.findUnique({
        where: {
          userId_organizationId: {
            userId: invitedUser.id,
            organizationId: org.id
          }
        }
      });
      expect(result.errors?.length).toEqual(1);
      expect(result.errors?.[0]?.message).toEqual("Not Authorised!");
      expect(invitedOrgMember).toEqual(null);
    });
  });

  // describe("remove users", () => {
  //   it("should remove users from org if user is admin", async () => {
  //     const { user: adminUser, token: adminUserToken } = await setupUser(USER1);
  //     const { user: memberUser, token: memberUserToken } = await setupUser(
  //       USER2
  //     );

  //     const org = await prisma.organization.create({
  //       data: {
  //         ...ORG,
  //         members: {
  //           createMany: {
  //             data: [
  //               {
  //                 userId: adminUser.id,
  //                 ...ORG_ADMIN_MEMBER
  //               },
  //               {
  //                 userId: memberUser.id,
  //                 ...ORG_NON_ADMIN_MEMBER
  //               }
  //             ]
  //           }
  //         }
  //       },
  //       include: {
  //         members: {
  //           include: {
  //             user: true
  //           }
  //         }
  //       }
  //     });
  //     console.log(org);
  //     const result = await server.executeOperation(
  //       {
  //         query: gql`
  //           mutation RemoveFromOrganization(
  //             $organizationId: Int!
  //             $memberIds: [Int]
  //           ) {
  //             removeFromOrganization(
  //               organizationId: $organizationId
  //               memberIds: $memberIds
  //             ) {
  //               id
  //               organizationId
  //             }
  //           }
  //         `,
  //         variables: { organizationId: org.id, memberIds }
  //       },
  //       {
  //         req: { headers: { authorization: `Bearer ${adminUserToken}` } }
  //       } as any
  //     );
  //   });
  //   it("should not remove users from org if user is not admin", async () => {});
  // });
  describe("update invite", () => {
    it("should update invite if the invite is for the user", async () => {
      const { user: adminUser, token: adminUserToken } = await setupUser(USER1);
      const { user: invitedUser, token: invitedUserToken } = await setupUser(
        USER2
      );
      const org = await prisma.organization.create({
        data: {
          ...ORG,
          members: {
            createMany: {
              data: [
                {
                  userId: adminUser.id,
                  ...ORG_ADMIN_MEMBER
                },
                {
                  userId: invitedUser.id,
                  status: "pending",
                  admin: false
                }
              ]
            }
          }
        },
        include: {
          members: true
        }
      });

      const result = await server.executeOperation(
        {
          query: gql`
            mutation UpdateOrgInvite($organizationId: Int!, $status: String!) {
              updateOrgInvite(
                organizationId: $organizationId
                status: $status
              ) {
                id
                userId
                organizationId
                status
                admin
              }
            }
          `,
          variables: { organizationId: org.id, status: "accepted" }
        },
        {
          req: { headers: { authorization: `Bearer ${invitedUserToken}` } }
        } as any
      );
      const orgMember = await prisma.organizationMember.findUnique({
        where: {
          userId_organizationId: {
            userId: invitedUser.id,
            organizationId: org.id
          }
        }
      });
      expect(orgMember).toEqual({
        id: expect.any(Number),
        userId: invitedUser.id,
        organizationId: org.id,
        status: "accepted",
        admin: false
      });
    });
  });
});
