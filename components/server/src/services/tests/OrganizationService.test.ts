import { MockContext, Context, createMockContext } from "../../context";
import {
  inviteToOrganization,
  updateOrgInvite,
  removeFromOrganization
} from "../OrganizationService";
import { USER1, USER2 } from "../../dev/testData";
import { Prisma, OrganizationMember, User } from "@prisma/client";
import { RequestError } from "../../util/errors";

let mockCtx: MockContext;
let context: Context;

beforeEach(() => {
  mockCtx = createMockContext();
  context = mockCtx as unknown as Context;
});

describe("organization service unit tests", () => {
  const mockOrgId = 1;
  const mockUser: User = {
    ...USER1,
    id: 1,
    passwordHash: "123123"
  };
  const mockOrgMember: OrganizationMember = {
    id: 1,
    userId: 1,
    organizationId: mockOrgId,
    status: "pending",
    admin: false
  };

  describe("inviteToOrganization", () => {
    const mockUsers = [
      { admin: false, email: USER1.email },
      { admin: false, email: USER2.email }
    ];
    it("should return 1 succeeded user and 1 failed user", async () => {
      mockCtx.db.organizationMember.create.mockRejectedValueOnce(new Error("test error"));
      mockCtx.db.organizationMember.create.mockResolvedValueOnce(mockOrgMember);

      const { succeeded, failed } = await inviteToOrganization({
        context,
        organizationId: mockOrgId,
        users: mockUsers
      });
      expect(succeeded).toEqual([mockOrgMember]);
      expect(failed).toEqual([USER1.email]);
    });
    it("should return 1 succeeded user and ignore the other user (user has already been invited)", async () => {
      mockCtx.db.organizationMember.create.mockRejectedValueOnce(
        new Prisma.PrismaClientKnownRequestError("error", {
          code: "P2002"
        } as any)
      );
      mockCtx.db.organizationMember.create.mockResolvedValueOnce(mockOrgMember);

      const { succeeded, failed } = await inviteToOrganization({
        context,
        organizationId: mockOrgId,
        users: mockUsers
      });
      expect(succeeded).toEqual([mockOrgMember]);
      expect(failed).toEqual([]);
    });
  });

  describe("updateOrgInvite", () => {
    it("should delete the org member if they decline", async () => {
      context.user = mockUser;
      await updateOrgInvite({
        context,
        status: "declined",
        organizationId: mockOrgId
      });
      expect(mockCtx.db.organizationMember.delete).toBeCalled();
      expect(mockCtx.db.organizationMember.update).not.toBeCalled();
    });
    it("should update the org member if they accepted", async () => {
      context.user = mockUser;
      await updateOrgInvite({
        context,
        status: "accepted",
        organizationId: mockOrgId
      });
      expect(mockCtx.db.organizationMember.delete).not.toBeCalled();
      expect(mockCtx.db.organizationMember.update).toBeCalled();
    });
    it("should throw error if not decline/accept", async () => {
      const res = updateOrgInvite({
        context,
        status: "asdfasdfa",
        organizationId: mockOrgId
      });
      expect(res).rejects.toEqual(new RequestError("Not a valid invitation response"));
      expect(mockCtx.db.organizationMember.delete).not.toBeCalled();
      expect(mockCtx.db.organizationMember.update).not.toBeCalled();
    });
  });

  describe("removeFromOrganization", () => {
    it("should delete the org member even if fails to delete other member", async () => {
      const mockUserIds = [2, 1];
      mockCtx.db.organizationMember.delete.mockRejectedValueOnce(new Error("test error"));
      mockCtx.db.organizationMember.delete.mockResolvedValueOnce(mockOrgMember);
      const { succeeded, failed } = await removeFromOrganization({
        context,
        organizationId: mockOrgId,
        userIds: mockUserIds
      });
      expect(succeeded).toEqual([mockOrgMember]);
      expect(failed).toEqual([2]);
    });
  });
});
