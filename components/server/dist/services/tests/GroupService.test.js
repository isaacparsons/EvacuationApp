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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JvdXBTZXJ2aWNlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2VydmljZXMvdGVzdHMvR3JvdXBTZXJ2aWNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsK0RBQStEO0FBQy9ELHNDQUFzQztBQUN0Qyx1Q0FBdUM7QUFDdkMsd0NBQXdDO0FBQ3hDLDhDQUE4QztBQUM5Qyw4Q0FBOEM7QUFDOUMsNENBQTRDO0FBQzVDLHdDQUF3QztBQUV4QyxnQ0FBZ0M7QUFFaEMscUNBQXFDO0FBRXJDLDJDQUEyQztBQUMzQyxxREFBcUQ7QUFDckQsdUJBQXVCO0FBQ3ZCLCtCQUErQjtBQUMvQiw0QkFBNEI7QUFDNUIsK0JBQStCO0FBQy9CLDJCQUEyQjtBQUMzQixPQUFPO0FBQ1Asd0JBQXdCO0FBQ3hCLGdDQUFnQztBQUNoQyw2QkFBNkI7QUFDN0IsK0JBQStCO0FBQy9CLDJCQUEyQjtBQUMzQixPQUFPO0FBQ1Asd0JBQXdCO0FBQ3hCLHlCQUF5QjtBQUN6QixPQUFPO0FBQ1AsbUNBQW1DO0FBQ25DLDBCQUEwQjtBQUMxQixrQkFBa0I7QUFDbEIsT0FBTztBQUNQLGlDQUFpQztBQUNqQywwQkFBMEI7QUFDMUIsbUJBQW1CO0FBQ25CLE9BQU87QUFDUCwyQ0FBMkM7QUFDM0MsMkJBQTJCO0FBQzNCLDBCQUEwQjtBQUMxQix3QkFBd0I7QUFDeEIsT0FBTztBQUVQLHdEQUF3RDtBQUN4RCw4Q0FBOEM7QUFFOUMsa0NBQWtDO0FBQ2xDLCtCQUErQjtBQUMvQix3Q0FBd0M7QUFDeEMseUNBQXlDO0FBQ3pDLCtDQUErQztBQUMvQyxVQUFVO0FBQ1Ysd0RBQXdEO0FBQ3hELGdEQUFnRDtBQUNoRCx5QkFBeUI7QUFDekIsWUFBWTtBQUNaLGtEQUFrRDtBQUNsRCwwQkFBMEI7QUFDMUIsWUFBWTtBQUNaLHlDQUF5QztBQUN6Qyx5REFBeUQ7QUFDekQsb0JBQW9CO0FBQ3BCLCtDQUErQztBQUMvQyx1QkFBdUI7QUFD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