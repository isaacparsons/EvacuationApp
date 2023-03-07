"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("../../context");
const OrganizationService_1 = require("../OrganizationService");
const testData_1 = require("../../dev/testData");
const client_1 = require("@prisma/client");
const errors_1 = require("../../util/errors");
let mockCtx;
let context;
beforeEach(() => {
    mockCtx = (0, context_1.createMockContext)();
    context = mockCtx;
});
describe("organization service unit tests", () => {
    const mockOrgId = 1;
    const mockUser = Object.assign(Object.assign({}, testData_1.USER1), { id: 1, passwordHash: "123123" });
    const mockOrgMember = {
        id: 1,
        userId: 1,
        organizationId: mockOrgId,
        status: "pending",
        admin: false
    };
    describe("inviteToOrganization", () => {
        const mockUsers = [
            { admin: false, email: testData_1.USER1.email },
            { admin: false, email: testData_1.USER2.email }
        ];
        it("should return 1 succeeded user and 1 failed user", async () => {
            mockCtx.db.organizationMember.create.mockRejectedValueOnce(new Error("test error"));
            mockCtx.db.organizationMember.create.mockResolvedValueOnce(mockOrgMember);
            const { succeeded, failed } = await (0, OrganizationService_1.inviteToOrganization)({
                context,
                organizationId: mockOrgId,
                users: mockUsers
            });
            expect(succeeded).toEqual([mockOrgMember]);
            expect(failed).toEqual([testData_1.USER1.email]);
        });
        it("should return 1 succeeded user and ignore the other user (user has already been invited)", async () => {
            mockCtx.db.organizationMember.create.mockRejectedValueOnce(new client_1.Prisma.PrismaClientKnownRequestError("error", {
                code: "P2002"
            }));
            mockCtx.db.organizationMember.create.mockResolvedValueOnce(mockOrgMember);
            const { succeeded, failed } = await (0, OrganizationService_1.inviteToOrganization)({
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
            await (0, OrganizationService_1.updateOrgInvite)({
                context,
                status: "declined",
                organizationId: mockOrgId
            });
            expect(mockCtx.db.organizationMember.delete).toBeCalled();
            expect(mockCtx.db.organizationMember.update).not.toBeCalled();
        });
        it("should update the org member if they accepted", async () => {
            context.user = mockUser;
            await (0, OrganizationService_1.updateOrgInvite)({
                context,
                status: "accepted",
                organizationId: mockOrgId
            });
            expect(mockCtx.db.organizationMember.delete).not.toBeCalled();
            expect(mockCtx.db.organizationMember.update).toBeCalled();
        });
        it("should throw error if not decline/accept", async () => {
            const res = (0, OrganizationService_1.updateOrgInvite)({
                context,
                status: "asdfasdfa",
                organizationId: mockOrgId
            });
            expect(res).rejects.toEqual(new errors_1.RequestError("Not a valid invitation response"));
            expect(mockCtx.db.organizationMember.delete).not.toBeCalled();
            expect(mockCtx.db.organizationMember.update).not.toBeCalled();
        });
    });
    describe("removeFromOrganization", () => {
        it("should delete the org member even if fails to delete other member", async () => {
            const mockUserIds = [2, 1];
            mockCtx.db.organizationMember.delete.mockRejectedValueOnce(new Error("test error"));
            mockCtx.db.organizationMember.delete.mockResolvedValueOnce(mockOrgMember);
            const { succeeded, failed } = await (0, OrganizationService_1.removeFromOrganization)({
                context,
                organizationId: mockOrgId,
                userIds: mockUserIds
            });
            expect(succeeded).toEqual([mockOrgMember]);
            expect(failed).toEqual([2]);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3JnYW5pemF0aW9uU2VydmljZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL3Rlc3RzL09yZ2FuaXphdGlvblNlcnZpY2UudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJDQUF3RTtBQUN4RSxnRUFJZ0M7QUFDaEMsaURBQWtEO0FBQ2xELDJDQUFrRTtBQUNsRSw4Q0FBaUQ7QUFFakQsSUFBSSxPQUFvQixDQUFDO0FBQ3pCLElBQUksT0FBZ0IsQ0FBQztBQUVyQixVQUFVLENBQUMsR0FBRyxFQUFFO0lBQ2QsT0FBTyxHQUFHLElBQUEsMkJBQWlCLEdBQUUsQ0FBQztJQUM5QixPQUFPLEdBQUcsT0FBNkIsQ0FBQztBQUMxQyxDQUFDLENBQUMsQ0FBQztBQUVILFFBQVEsQ0FBQyxpQ0FBaUMsRUFBRSxHQUFHLEVBQUU7SUFDL0MsTUFBTSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCLE1BQU0sUUFBUSxtQ0FDVCxnQkFBSyxLQUNSLEVBQUUsRUFBRSxDQUFDLEVBQ0wsWUFBWSxFQUFFLFFBQVEsR0FDdkIsQ0FBQztJQUNGLE1BQU0sYUFBYSxHQUF1QjtRQUN4QyxFQUFFLEVBQUUsQ0FBQztRQUNMLE1BQU0sRUFBRSxDQUFDO1FBQ1QsY0FBYyxFQUFFLFNBQVM7UUFDekIsTUFBTSxFQUFFLFNBQVM7UUFDakIsS0FBSyxFQUFFLEtBQUs7S0FDYixDQUFDO0lBRUYsUUFBUSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRTtRQUNwQyxNQUFNLFNBQVMsR0FBRztZQUNoQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLGdCQUFLLENBQUMsS0FBSyxFQUFFO1lBQ3BDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsZ0JBQUssQ0FBQyxLQUFLLEVBQUU7U0FDckMsQ0FBQztRQUNGLEVBQUUsQ0FBQyxrREFBa0QsRUFBRSxLQUFLLElBQUksRUFBRTtZQUNo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QUFFLEtBQUssSUFBSSxFQUFFO1lBQ3hELE1BQU0sR0FBRyxHQUFHLElBQUEscUNBQWUsRUFBQztnQkFDMUIsT0FBTztnQkFDUCxNQUFNLEVBQUUsV0FBVztnQkFDbkIsY0FBYyxFQUFFLFNBQVM7YUFDMUIsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxxQkFBWSxDQUFDLGlDQUFpQyxDQUFDLENBQUMsQ0FBQztZQUNqRixNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDOUQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2hFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFO1FBQ3RDLEVBQUUsQ0FBQyxtRUFBbUUsRUFBRSxLQUFLLElBQUksRUFBRTtZQUNqRixNQUFNLFdBQVcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMzQixPQUFPLENBQUMsRUFBRSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ3BGLE9BQU8sQ0FBQyxFQUFFLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLEdBQUcsTUFBTSxJQUFBLDRDQUFzQixFQUFDO2dCQUN6RCxPQUFPO2dCQUNQLGNBQWMsRUFBRSxTQUFTO2dCQUN6QixPQUFPLEVBQUUsV0FBVzthQUNyQixDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUMzQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==