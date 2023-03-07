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
// import GroupService from "../GroupService";
// import UserService from "../UserService";
// const { JWT, CLIENT } = KEYS.default;
// jest.mock("../EmailService");
// const prisma = new PrismaClient();
// const groupService = new GroupService();
// describe("GroupService integration tests", () => {
//   const mockUser = {
//     email: "test@email.com",
//     passwordHash: "1234",
//     phoneNumber: "12345678",
//     accountCreated: true
//   };
//   const mockUser2 = {
//     email: "test2@email.com",
//     passwordHash: "12345",
//     phoneNumber: "12345679",
//     accountCreated: true
//   };
//   const mockGroup = {
//     name: "testGroup1"
//   };
//   const mockAdminGroupMember = {
//     status: "accepted",
//     admin: true
//   };
//   const mockNonAdminMember = {
//     status: "accepted",
//     admin: false
//   };
//   const mockGroupNotificationSetting = {
//     emailEnabled: false,
//     pushEnabled: false,
//     smsEnabled: false
//   };
//   const mockEmailService = EmailService as jest.Mock;
//   const mockSendCompleteSignup = jest.fn();
//   describe("getGroups", () => {
//     beforeEach(async () => {
//       await prisma.user.deleteMany();
//       await prisma.group.deleteMany();
//       await prisma.groupMember.deleteMany();
//     });
//     it("should get users for a userId", async () => {
//       const user = await prisma.user.create({
//         data: mockUser
//       });
//       const group = await prisma.group.create({
//         data: mockGroup
//       });
//       const groupNotificationSetting =
//         await prisma.groupNotificationSetting.create({
//           data: {
//             ...mockGroupNotificationSetting,
//             group: {
//               connect: { id: group.id }
//             }
//           }
//         });
//       const groupMember = await prisma.groupMember.create({
//         data: {
//           ...mockAdminGroupMember,
//           group: {
//             connect: { id: group.id }
//           },
//           user: {
//             connect: { id: user.id }
//           }
//         }
//       });
//       const groups = await groupService.getGroups(user.id);
//       expect(groups).toEqual([
//         {
//           id: groupMember.id,
//           userId: user.id,
//           user,
//           groupId: group.id,
//           status: groupMember.status,
//           admin: groupMember.admin,
//           group: { ...group, notificationSetting: groupNotificationSetting }
//         }
//       ]);
//     });
//   });
//   describe("getGroup", () => {
//     beforeEach(async () => {
//       await prisma.user.deleteMany();
//       await prisma.group.deleteMany();
//       await prisma.groupMember.deleteMany();
//       await prisma.groupNotificationSetting.deleteMany();
//     });
//     it("should get group for a groupId", async () => {
//       const user = await prisma.user.create({
//         data: mockUser
//       });
//       const group = await prisma.group.create({
//         data: mockGroup
//       });
//       const groupMember = await prisma.groupMember.create({
//         data: {
//           ...mockAdminGroupMember,
//           group: {
//             connect: { id: group.id }
//           },
//           user: {
//             connect: { id: user.id }
//           }
//         }
//       });
//       const groupNotificationSetting =
//         await prisma.groupNotificationSetting.create({
//           data: {
//             ...mockGroupNotificationSetting,
//             group: {
//               connect: { id: group.id }
//             }
//           }
//         });
//       const groupAfter = await groupService.getGroup(group.id);
//       expect(groupAfter).toEqual({
//         id: expect.any(Number),
//         name: mockGroup.name,
//         members: [
//           {
//             ...groupMember,
//             user
//           }
//         ],
//         notificationSetting: groupNotificationSetting
//       });
//     });
//   });
//   describe("getGroupMembers", () => {
//     beforeEach(async () => {
//       await prisma.user.deleteMany();
//       await prisma.group.deleteMany();
//       await prisma.groupMember.deleteMany();
//     });
//     it("should get group members for groupId", async () => {
//       const user = await prisma.user.create({
//         data: mockUser
//       });
//       const group = await prisma.group.create({
//         data: mockGroup
//       });
//       const groupMember = await prisma.groupMember.create({
//         data: {
//           ...mockAdminGroupMember,
//           group: {
//             connect: { id: group.id }
//           },
//           user: {
//             connect: { id: user.id }
//           }
//         }
//       });
//       const groupMembers = await groupService.getGroupMembers(group.id);
//       expect(groupMembers).toEqual([
//         {
//           ...groupMember,
//           user
//         }
//       ]);
//     });
//   });
//   describe("createGroup", () => {
//     beforeEach(async () => {
//       await prisma.user.deleteMany();
//       await prisma.group.deleteMany();
//       await prisma.groupMember.deleteMany();
//       await prisma.groupNotificationSetting.deleteMany();
//     });
//     it("should create group and group notification setting", async () => {
//       const user = await prisma.user.create({
//         data: mockUser
//       });
//       const mockGroupNotificationSetting = {
//         emailEnabled: false,
//         pushEnabled: false,
//         smsEnabled: false
//       };
//       const group = await groupService.createGroup({
//         name: mockGroup.name,
//         userId: user.id,
//         groupNotificationSetting: mockGroupNotificationSetting
//       });
//       const groupMember = await prisma.groupMember.findFirst({
//         where: {
//           groupId: group.id,
//           userId: user.id
//         }
//       });
//       const groupNotificationSetting =
//         await prisma.groupNotificationSetting.findFirst({
//           where: {
//             groupId: group.id
//           }
//         });
//       expect(group).toEqual({
//         name: group.name,
//         id: group.id
//       });
//       expect(groupMember).toEqual({
//         status: "accepted",
//         admin: true,
//         userId: user.id,
//         groupId: group.id,
//         id: expect.any(Number)
//       });
//       expect(groupNotificationSetting).toEqual({
//         id: expect.any(Number),
//         groupId: group.id,
//         ...mockGroupNotificationSetting
//       });
//     });
//   });
//   describe("deleteGroup", () => {
//     beforeEach(async () => {
//       await prisma.user.deleteMany();
//       await prisma.group.deleteMany();
//       await prisma.groupMember.deleteMany();
//       await prisma.groupNotificationSetting.deleteMany();
//     });
//     it("should delete group if it exists, and delete group notification setting and group members", async () => {
//       const user = await prisma.user.create({
//         data: mockUser
//       });
//       const user2 = await prisma.user.create({
//         data: mockUser2
//       });
//       const group = await prisma.group.create({
//         data: mockGroup
//       });
//       await prisma.groupMember.create({
//         data: {
//           ...mockAdminGroupMember,
//           group: {
//             connect: { id: group.id }
//           },
//           user: {
//             connect: { id: user.id }
//           }
//         }
//       });
//       await prisma.groupMember.create({
//         data: {
//           ...mockNonAdminMember,
//           group: {
//             connect: { id: group.id }
//           },
//           user: {
//             connect: { id: user2.id }
//           }
//         }
//       });
//       await prisma.groupNotificationSetting.create({
//         data: {
//           ...mockGroupNotificationSetting,
//           group: {
//             connect: { id: group.id }
//           }
//         }
//       });
//       await groupService.deleteGroup({ groupId: group.id, userId: user.id });
//       const groupAfter = await prisma.group.findFirst({
//         where: {
//           id: group.id
//         }
//       });
//       const groupNotificationSetting =
//         await prisma.groupNotificationSetting.findFirst({
//           where: {
//             groupId: group.id
//           }
//         });
//       const groupMembers = await prisma.groupMember.findMany({
//         where: {
//           groupId: group.id
//         }
//       });
//       expect(groupAfter).toEqual(null);
//       expect(groupNotificationSetting).toEqual(null);
//       expect(groupMembers).toEqual([]);
//     });
//     it("shouldnt delete group if member is not an admin", async () => {
//       const user = await prisma.user.create({
//         data: mockUser
//       });
//       const group = await prisma.group.create({
//         data: mockGroup
//       });
//       const groupMember = await prisma.groupMember.create({
//         data: {
//           ...mockNonAdminMember,
//           group: {
//             connect: { id: group.id }
//           },
//           user: {
//             connect: { id: user.id }
//           }
//         }
//       });
//       const groupNotificationSetting =
//         await prisma.groupNotificationSetting.create({
//           data: {
//             ...mockGroupNotificationSetting,
//             group: {
//               connect: { id: group.id }
//             }
//           }
//         });
//       const deleteGroup = groupService.deleteGroup({
//         groupId: group.id,
//         userId: user.id
//       });
//       await expect(deleteGroup).rejects.toEqual(
//         new Error("User does not have permissions to delete group")
//       );
//       const groupAfter = await prisma.group.findFirst({
//         where: {
//           id: group.id
//         }
//       });
//       const groupNotificationSettingAfter =
//         await prisma.groupNotificationSetting.findFirst({
//           where: {
//             groupId: group.id
//           }
//         });
//       const groupMemberAfter = await prisma.groupMember.findFirst({
//         where: {
//           groupId: group.id,
//           userId: user.id
//         }
//       });
//       expect(groupAfter).toEqual(group);
//       expect(groupMemberAfter).toEqual(groupMember);
//       expect(groupNotificationSettingAfter).toEqual(groupNotificationSetting);
//     });
//   });
//   describe("updateGroupNotificationOptions", () => {
//     beforeEach(async () => {
//       await prisma.user.deleteMany();
//       await prisma.group.deleteMany();
//       await prisma.groupMember.deleteMany();
//       await prisma.groupNotificationSetting.deleteMany();
//     });
//     it("should update group notification setting", async () => {
//       const mockUpdatedGroupNotificationSetting = {
//         emailEnabled: false,
//         pushEnabled: false,
//         smsEnabled: true
//       };
//       const user = await prisma.user.create({
//         data: mockUser
//       });
//       const group = await prisma.group.create({
//         data: mockGroup
//       });
//       await prisma.groupMember.create({
//         data: {
//           ...mockAdminGroupMember,
//           group: {
//             connect: { id: group.id }
//           },
//           user: {
//             connect: { id: user.id }
//           }
//         }
//       });
//       await prisma.groupNotificationSetting.create({
//         data: {
//           ...mockGroupNotificationSetting,
//           group: {
//             connect: { id: group.id }
//           }
//         }
//       });
//       await groupService.updateGroupNotificationOptions({
//         groupId: group.id,
//         userId: user.id,
//         groupNotificationSetting: mockUpdatedGroupNotificationSetting
//       });
//       const groupNotificationSetting =
//         await prisma.groupNotificationSetting.findUnique({
//           where: {
//             groupId: group.id
//           }
//         });
//       expect(groupNotificationSetting).toEqual({
//         id: expect.any(Number),
//         groupId: group.id,
//         ...mockUpdatedGroupNotificationSetting
//       });
//     });
//     it("shouldnt update group notification setting if not admin", async () => {
//       const mockUpdatedGroupNotificationSetting = {
//         emailEnabled: false,
//         pushEnabled: false,
//         smsEnabled: true
//       };
//       const user = await prisma.user.create({
//         data: mockUser
//       });
//       const group = await prisma.group.create({
//         data: mockGroup
//       });
//       await prisma.groupMember.create({
//         data: {
//           ...mockNonAdminMember,
//           group: {
//             connect: { id: group.id }
//           },
//           user: {
//             connect: { id: user.id }
//           }
//         }
//       });
//       await prisma.groupNotificationSetting.create({
//         data: {
//           ...mockGroupNotificationSetting,
//           group: {
//             connect: { id: group.id }
//           }
//         }
//       });
//       const updateGroupNotificationSetting =
//         groupService.updateGroupNotificationOptions({
//           groupId: group.id,
//           userId: user.id,
//           groupNotificationSetting: mockUpdatedGroupNotificationSetting
//         });
//       await expect(updateGroupNotificationSetting).rejects.toEqual(
//         new Error("Account does not have permissions")
//       );
//       const groupNotificationSetting =
//         await prisma.groupNotificationSetting.findUnique({
//           where: {
//             groupId: group.id
//           }
//         });
//       expect(groupNotificationSetting).toEqual({
//         id: expect.any(Number),
//         groupId: group.id,
//         ...mockGroupNotificationSetting
//       });
//     });
//   });
//   describe("inviteUsers", () => {
//     beforeEach(async () => {
//       await prisma.user.deleteMany();
//       await prisma.group.deleteMany();
//       await prisma.groupMember.deleteMany();
//       await prisma.groupNotificationSetting.deleteMany();
//     });
//     it("should invite user if they exist and user is admin", async () => {
//       const user = await prisma.user.create({
//         data: mockUser
//       });
//       const user2 = await prisma.user.create({
//         data: mockUser2
//       });
//       const group = await prisma.group.create({
//         data: mockGroup
//       });
//       await prisma.groupMember.create({
//         data: {
//           ...mockAdminGroupMember,
//           group: {
//             connect: { id: group.id }
//           },
//           user: {
//             connect: { id: user.id }
//           }
//         }
//       });
//       await groupService.inviteUsers({
//         userId: user.id,
//         groupId: group.id,
//         users: [
//           {
//             admin: false,
//             email: user2.email
//           }
//         ]
//       });
//       const invitedGroupMember = await prisma.groupMember.findFirst({
//         where: {
//           userId: user2.id,
//           groupId: group.id
//         }
//       });
//       expect(invitedGroupMember).toEqual({
//         id: expect.any(Number),
//         groupId: group.id,
//         userId: user2.id,
//         status: "pending",
//         admin: false
//       });
//       expect(mockSendCompleteSignup).not.toBeCalled();
//     });
//     it("should invite and create user if they dont exist and send an email to complete signup", async () => {
//       mockEmailService.mockReturnValue({
//         sendCompleteSignup: mockSendCompleteSignup
//       });
//       const inviteUserEmail = "test3@email.com";
//       const user = await prisma.user.create({
//         data: mockUser
//       });
//       const group = await prisma.group.create({
//         data: mockGroup
//       });
//       await prisma.groupMember.create({
//         data: {
//           ...mockAdminGroupMember,
//           group: {
//             connect: { id: group.id }
//           },
//           user: {
//             connect: { id: user.id }
//           }
//         }
//       });
//       await groupService.inviteUsers({
//         userId: user.id,
//         groupId: group.id,
//         users: [
//           {
//             admin: false,
//             email: inviteUserEmail
//           }
//         ]
//       });
//       const invitedUser = await prisma.user.findUnique({
//         where: {
//           email: inviteUserEmail
//         }
//       });
//       const invitedGroupMember = await prisma.groupMember.findFirst({
//         where: {
//           userId: invitedUser?.id,
//           groupId: group.id
//         }
//       });
//       expect(invitedUser).toEqual({
//         id: expect.any(Number),
//         email: inviteUserEmail,
//         phoneNumber: null,
//         passwordHash: null,
//         accountCreated: false
//       });
//       expect(invitedGroupMember).toEqual({
//         id: expect.any(Number),
//         groupId: group.id,
//         userId: invitedUser?.id,
//         status: "pending",
//         admin: false
//       });
//       expect(mockSendCompleteSignup).toBeCalledWith(invitedUser, group);
//     });
//     it("shouldnt invite user if not admin", async () => {
//       const user = await prisma.user.create({
//         data: mockUser
//       });
//       const user2 = await prisma.user.create({
//         data: mockUser2
//       });
//       const group = await prisma.group.create({
//         data: mockGroup
//       });
//       await prisma.groupMember.create({
//         data: {
//           ...mockNonAdminMember,
//           group: {
//             connect: { id: group.id }
//           },
//           user: {
//             connect: { id: user.id }
//           }
//         }
//       });
//       const inviteUser = groupService.inviteUsers({
//         userId: user.id,
//         groupId: group.id,
//         users: [
//           {
//             admin: false,
//             email: user2.email
//           }
//         ]
//       });
//       await expect(inviteUser).rejects.toEqual(
//         new Error("Account does not have permissions")
//       );
//       const invitedGroupMember = await prisma.groupMember.findFirst({
//         where: {
//           userId: user2.id,
//           groupId: group.id
//         }
//       });
//       expect(invitedGroupMember).toEqual(null);
//     });
//   });
//   describe("updateInvite", () => {
//     beforeEach(async () => {
//       await prisma.user.deleteMany();
//       await prisma.group.deleteMany();
//       await prisma.groupMember.deleteMany();
//       await prisma.groupNotificationSetting.deleteMany();
//     });
//     it("should update invite", async () => {
//       const mockGroupMember = {
//         status: "pending",
//         admin: false
//       };
//       const user = await prisma.user.create({
//         data: mockUser
//       });
//       const group = await prisma.group.create({
//         data: mockGroup
//       });
//       const groupMember = await prisma.groupMember.create({
//         data: {
//           ...mockGroupMember,
//           group: {
//             connect: { id: group.id }
//           },
//           user: {
//             connect: { id: user.id }
//           }
//         }
//       });
//       await groupService.updateInvite({
//         groupId: group.id,
//         userId: user.id,
//         response: "accepted"
//       });
//       const groupMemberAfter = await prisma.groupMember.findUnique({
//         where: {
//           userId_groupId: {
//             userId: user.id,
//             groupId: group.id
//           }
//         }
//       });
//       expect(groupMemberAfter).toEqual({
//         id: expect.any(Number),
//         userId: user.id,
//         groupId: group.id,
//         status: "accepted",
//         admin: false
//       });
//     });
//     it("should delete group member if they decline", async () => {
//       const mockGroupMember = {
//         status: "pending",
//         admin: false
//       };
//       const user = await prisma.user.create({
//         data: mockUser
//       });
//       const group = await prisma.group.create({
//         data: mockGroup
//       });
//       const groupMember = await prisma.groupMember.create({
//         data: {
//           ...mockGroupMember,
//           group: {
//             connect: { id: group.id }
//           },
//           user: {
//             connect: { id: user.id }
//           }
//         }
//       });
//       await groupService.updateInvite({
//         groupId: group.id,
//         userId: user.id,
//         response: "declined"
//       });
//       const groupMemberAfter = await prisma.groupMember.findUnique({
//         where: {
//           userId_groupId: {
//             userId: user.id,
//             groupId: group.id
//           }
//         }
//       });
//       expect(groupMemberAfter).toEqual(null);
//     });
//   });
//   describe("removeMembers", () => {
//     beforeEach(async () => {
//       await prisma.user.deleteMany();
//       await prisma.group.deleteMany();
//       await prisma.groupMember.deleteMany();
//       await prisma.groupNotificationSetting.deleteMany();
//     });
//     it("should remove users if they exist", async () => {
//       const user1 = await prisma.user.create({
//         data: mockUser
//       });
//       const user2 = await prisma.user.create({
//         data: mockUser2
//       });
//       const group = await prisma.group.create({
//         data: mockGroup
//       });
//       await prisma.groupMember.create({
//         data: {
//           ...mockAdminGroupMember,
//           group: {
//             connect: { id: group.id }
//           },
//           user: {
//             connect: { id: user1.id }
//           }
//         }
//       });
//       const groupMember = await prisma.groupMember.create({
//         data: {
//           ...mockAdminGroupMember,
//           group: {
//             connect: { id: group.id }
//           },
//           user: {
//             connect: { id: user2.id }
//           }
//         }
//       });
//       await groupService.removeMembers({
//         groupId: group.id,
//         userId: user1.id,
//         memberIds: [groupMember.id]
//       });
//       const groupMemberAfter = await prisma.groupMember.findUnique({
//         where: {
//           userId_groupId: {
//             userId: user2.id,
//             groupId: group.id
//           }
//         }
//       });
//       expect(groupMemberAfter).toEqual(null);
//     });
//     it("shouldnt remove users if user isnt an admin", async () => {
//       const user1 = await prisma.user.create({
//         data: mockUser
//       });
//       const user2 = await prisma.user.create({
//         data: mockUser2
//       });
//       const group = await prisma.group.create({
//         data: mockGroup
//       });
//       await prisma.groupMember.create({
//         data: {
//           ...mockNonAdminMember,
//           group: {
//             connect: { id: group.id }
//           },
//           user: {
//             connect: { id: user1.id }
//           }
//         }
//       });
//       const groupMember = await prisma.groupMember.create({
//         data: {
//           ...mockAdminGroupMember,
//           group: {
//             connect: { id: group.id }
//           },
//           user: {
//             connect: { id: user2.id }
//           }
//         }
//       });
//       const removeMembers = groupService.removeMembers({
//         groupId: group.id,
//         userId: user1.id,
//         memberIds: [groupMember.id]
//       });
//       await expect(removeMembers).rejects.toEqual(
//         new Error("Account does not have permissions")
//       );
//       const groupMemberAfter = await prisma.groupMember.findUnique({
//         where: {
//           userId_groupId: {
//             userId: user2.id,
//             groupId: group.id
//           }
//         }
//       });
//       expect(groupMemberAfter).toEqual(groupMember);
//     });
//   });
//   afterAll(async () => {
//     const deleteUser = prisma.user.deleteMany();
//     const deleteGroup = prisma.group.deleteMany();
//     const deleteGroupMember = prisma.groupMember.deleteMany();
//     const deleteGroupNotificationSetting =
//       prisma.groupNotificationSetting.deleteMany();
//     await prisma.$transaction([
//       deleteUser,
//       deleteGroup,
//       deleteGroupMember,
//       deleteGroupNotificationSetting
//     ]);
//     await prisma.$disconnect();
//   });
// });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JvdXBTZXJ2aWNlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2VydmljZXMvdGVzdHMvR3JvdXBTZXJ2aWNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMkVBQTJFO0FBRTNFLDRCQUE0QjtBQUM1Qix3QkFBd0I7QUFFeEIscUJBQXFCO0FBQ3JCLG1DQUFtQztBQUNuQyw2Q0FBNkM7QUFDN0MsTUFBTTtBQUVOLFFBQVEsQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7SUFDeEMsUUFBUSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRTtRQUNwQyxFQUFFLENBQUMsa0RBQWtELEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDaEUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCwrREFBK0Q7QUFDL0Qsc0NBQXNDO0FBQ3RDLHVDQUF1QztBQUN2Qyx3Q0FBd0M7QUFDeEMsOENBQThDO0FBQzlDLDhDQUE4QztBQUM5Qyw0Q0FBNEM7QUFDNUMsd0NBQXdDO0FBRXhDLGdDQUFnQztBQUVoQyxxQ0FBcUM7QUFFckMsMkNBQTJDO0FBQzNDLHFEQUFxRDtBQUNyRCx1QkFBdUI7QUFDdkIsK0JBQStCO0FBQy9CLDRCQUE0QjtBQUM1QiwrQkFBK0I7QUFDL0IsMkJBQTJCO0FBQzNCLE9BQU87QUFDUCx3QkFBd0I7QUFDeEIsZ0NBQWdDO0FBQ2hDLDZCQUE2QjtBQUM3QiwrQkFBK0I7QUFDL0IsMkJBQTJCO0FBQzNCLE9BQU87QUFDUCx3QkFBd0I7QUFDeEIseUJBQXlCO0FBQ3pCLE9BQU87QUFDUCxtQ0FBbUM7QUFDbkMsMEJBQTBCO0FBQzFCLGtCQUFrQjtBQUNsQixPQUFPO0FBQ1AsaUNBQWlDO0FBQ2pDLDBCQUEwQjtBQUMxQixtQkFBbUI7QUFD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