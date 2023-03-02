import { MockContext, Context, createMockContext } from "../../context";

let mockCtx: MockContext;
let context: Context;

beforeEach(() => {
  mockCtx = createMockContext();
  context = mockCtx as unknown as Context;
});

describe("group service unit tests", () => {
  beforeEach(async () => {});

  describe("inviteToOrganization", () => {
    it("should return 1 succeeded user and 1 failed user", async () => {});
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
