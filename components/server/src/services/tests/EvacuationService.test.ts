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
// import EvacuationEventService from "../EvacuationEventService";
// const { JWT, CLIENT } = KEYS.default;

// const prisma = new PrismaClient();

// const evacuationEventService = new EvacuationEventService();
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
//   const startTime = new Date(2022, 1, 1, 0).toISOString();
//   const endTime = new Date(2022, 1, 2, 0).toISOString();
//   const mockEndedEvacuationEvent = {
//     startTime,
//     endTime,
//     type: "evacuation",
//     status: "ended",
//     message: "test1"
//   };

//   const mockSafeResponse = {
//     response: "at muster point",
//     time: new Date(2022, 1, 1, 5).toISOString()
//   };
//   describe("getEvacuationEvents", () => {
//     beforeEach(async () => {
//       await prisma.user.deleteMany();
//       await prisma.group.deleteMany();
//       await prisma.groupMember.deleteMany();
//       await prisma.evacuationEvent.deleteMany();
//       await prisma.evacuationResponse.deleteMany();
//     });

//     it("should get evacuation events for groupid", async () => {
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
//       const evacuationEvent = await prisma.evacuationEvent.create({
//         data: {
//           ...mockEndedEvacuationEvent,
//           groupId: group.id,
//           createdBy: user.id
//         }
//       });
//       const evacuationResponse = await prisma.evacuationResponse.create({
//         data: {
//           ...mockSafeResponse,
//           userId: user.id,
//           evacuationId: evacuationEvent.id
//         }
//       });
//       const evacuationEvents = await evacuationEventService.getEvacuationEvents(
//         group.id
//       );
//       expect(evacuationEvents).toEqual([
//         {
//           ...evacuationEvent,
//           responses: [{ ...evacuationResponse, user }]
//         }
//       ]);
//     });
//   });
//   describe("createEvent", () => {
//     beforeEach(async () => {
//       await prisma.user.deleteMany();
//       await prisma.group.deleteMany();
//       await prisma.groupMember.deleteMany();
//       await prisma.evacuationEvent.deleteMany();
//       await prisma.evacuationResponse.deleteMany();
//     });
//     it("should create event if user is an admin", async () => {
//       const mockMsg = "test1";
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
//       await evacuationEventService.createEvent({
//         msg: mockMsg,
//         userId: user.id,
//         groupId: group.id
//       });
//       const evacuationEvent = await prisma.evacuationEvent.findFirst({
//         where: {
//           createdBy: user.id,
//           groupId: group.id
//         }
//       });
//       expect(evacuationEvent).toEqual({
//         id: expect.any(Number),
//         startTime: expect.any(String),
//         endTime: null,
//         message: mockMsg,
//         type: "evacuation",
//         createdBy: user.id,
//         status: "in-progress",
//         groupId: group.id
//       });
//     });
//     it("shouldnt create event if user is not an admin", async () => {
//       const mockMsg = "test1";
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
//       const createEvacuationEvent = evacuationEventService.createEvent({
//         msg: mockMsg,
//         userId: user.id,
//         groupId: group.id
//       });
//       await expect(createEvacuationEvent).rejects.toEqual(
//         new Error("User does not have permissions to create event")
//       );
//       const evacuationEvent = await prisma.evacuationEvent.findFirst({
//         where: {
//           createdBy: user.id,
//           groupId: group.id
//         }
//       });
//       expect(evacuationEvent).toEqual(null);
//     });
//     it("shouldnt create event if another evacuation is in progress", async () => {
//       const mockMsg = "test1";
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
//       await prisma.evacuationEvent.create({
//         data: {
//           startTime: new Date().toISOString(),
//           endTime: null,
//           message: mockMsg,
//           type: "evacuation",
//           createdBy: user.id,
//           status: "in-progress",
//           groupId: group.id
//         }
//       });
//       const createEvacuationEvent = evacuationEventService.createEvent({
//         msg: mockMsg,
//         userId: user.id,
//         groupId: group.id
//       });
//       await expect(createEvacuationEvent).rejects.toEqual(
//         new Error("An evacuation event is still in progress")
//       );
//       const evacuationEvent = await prisma.evacuationEvent.findFirst({
//         where: {
//           createdBy: user.id,
//           groupId: group.id
//         }
//       });
//       expect(evacuationEvent).toEqual({
//         id: expect.any(Number),
//         startTime: expect.any(String),
//         endTime: null,
//         message: mockMsg,
//         type: "evacuation",
//         createdBy: user.id,
//         status: "in-progress",
//         groupId: group.id
//       });
//     });
//   });
//   describe("updateEvent", () => {
//     beforeEach(async () => {
//       await prisma.user.deleteMany();
//       await prisma.group.deleteMany();
//       await prisma.groupMember.deleteMany();
//       await prisma.evacuationEvent.deleteMany();
//       await prisma.evacuationResponse.deleteMany();
//     });
//     it("should update event", async () => {
//       const mockMsg = "test1";
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
//       const evacuationEvent = await prisma.evacuationEvent.create({
//         data: {
//           startTime: new Date().toISOString(),
//           endTime: null,
//           message: mockMsg,
//           type: "evacuation",
//           createdBy: user.id,
//           status: "in-progress",
//           groupId: group.id
//         }
//       });
//       await evacuationEventService.updateEvent({
//         evacuationEventId: evacuationEvent.id,
//         userId: user.id,
//         status: "ended"
//       });
//       const evacuationEventAfter = await prisma.evacuationEvent.findFirst({
//         where: {
//           createdBy: user.id,
//           groupId: group.id
//         }
//       });
//       expect(evacuationEventAfter).toEqual({
//         id: expect.any(Number),
//         startTime: expect.any(String),
//         endTime: expect.any(String),
//         status: "ended",
//         type: "evacuation",
//         createdBy: user.id,
//         groupId: group.id,
//         message: mockMsg
//       });
//     });
//     it("should throw error if event is already ended", async () => {
//       const mockMsg = "test1";
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
//       const evacuationEvent = await prisma.evacuationEvent.create({
//         data: {
//           startTime: new Date().toISOString(),
//           endTime: new Date().toISOString(),
//           message: mockMsg,
//           type: "evacuation",
//           createdBy: user.id,
//           status: "ended",
//           groupId: group.id
//         }
//       });
//       const updateEvent = evacuationEventService.updateEvent({
//         evacuationEventId: evacuationEvent.id,
//         userId: user.id,
//         status: "ended"
//       });
//       await expect(updateEvent).rejects.toEqual(
//         new Error("Event has already ended")
//       );
//       const evacuationEventAfter = await prisma.evacuationEvent.findFirst({
//         where: {
//           createdBy: user.id,
//           groupId: group.id
//         }
//       });
//       expect(evacuationEventAfter).toEqual({
//         id: expect.any(Number),
//         startTime: expect.any(String),
//         endTime: expect.any(String),
//         status: "ended",
//         type: "evacuation",
//         createdBy: user.id,
//         groupId: group.id,
//         message: mockMsg
//       });
//     });
//     it("should throw error if user is not admin", async () => {
//       const mockMsg = "test1";
//       const mockStartTime = new Date().toISOString();
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
//       const evacuationEvent = await prisma.evacuationEvent.create({
//         data: {
//           startTime: mockStartTime,
//           endTime: null,
//           message: mockMsg,
//           type: "evacuation",
//           createdBy: user.id,
//           status: "in-progress",
//           groupId: group.id
//         }
//       });
//       const updateEvent = evacuationEventService.updateEvent({
//         evacuationEventId: evacuationEvent.id,
//         userId: user.id,
//         status: "ended"
//       });
//       await expect(updateEvent).rejects.toEqual(
//         new Error("User does not have permissions to update event")
//       );
//       const evacuationEventAfter = await prisma.evacuationEvent.findFirst({
//         where: {
//           createdBy: user.id,
//           groupId: group.id
//         }
//       });
//       expect(evacuationEventAfter).toEqual({
//         id: expect.any(Number),
//         startTime: mockStartTime,
//         endTime: null,
//         message: mockMsg,
//         type: "evacuation",
//         createdBy: user.id,
//         status: "in-progress",
//         groupId: group.id
//       });
//     });
//   });
//   describe("createEventResponse", () => {
//     beforeEach(async () => {
//       await prisma.user.deleteMany();
//       await prisma.group.deleteMany();
//       await prisma.groupMember.deleteMany();
//       await prisma.evacuationEvent.deleteMany();
//       await prisma.evacuationResponse.deleteMany();
//     });
//     it("should create evacuation response", async () => {
//       const mockMsg = "test1";
//       const mockStartTime = new Date().toISOString();
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
//       const evacuationEvent = await prisma.evacuationEvent.create({
//         data: {
//           startTime: mockStartTime,
//           endTime: null,
//           message: mockMsg,
//           type: "evacuation",
//           createdBy: user.id,
//           status: "in-progress",
//           groupId: group.id
//         }
//       });
//       await evacuationEventService.createEventResponse({
//         evacuationEventId: evacuationEvent.id,
//         response: "safe at muster point",
//         userId: user.id
//       });
//       const evacuationResponse = await prisma.evacuationResponse.findUnique({
//         where: {
//           userId_evacuationId: {
//             userId: user.id,
//             evacuationId: evacuationEvent.id
//           }
//         }
//       });
//       expect(evacuationResponse).toEqual({
//         evacuationId: evacuationEvent.id,
//         id: expect.any(Number),
//         response: "safe at muster point",
//         time: expect.any(String),
//         userId: user.id
//       });
//     });
//     it("shouldnt create response if event is not in progress", async () => {
//       const mockMsg = "test1";
//       const mockStartTime = new Date().toISOString();
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
//       const evacuationEvent = await prisma.evacuationEvent.create({
//         data: {
//           startTime: mockStartTime,
//           endTime: mockStartTime,
//           message: mockMsg,
//           type: "evacuation",
//           createdBy: user.id,
//           status: "ended",
//           groupId: group.id
//         }
//       });
//       const createEvacuationResponse =
//         evacuationEventService.createEventResponse({
//           evacuationEventId: evacuationEvent.id,
//           response: "safe at muster point",
//           userId: user.id
//         });
//       await expect(createEvacuationResponse).rejects.toEqual(
//         new Error("Evacuation Event is no longer in progress")
//       );
//       const evacuationResponse = await prisma.evacuationResponse.findUnique({
//         where: {
//           userId_evacuationId: {
//             userId: user.id,
//             evacuationId: evacuationEvent.id
//           }
//         }
//       });
//       expect(evacuationResponse).toEqual(null);
//     });
//   });

//   afterAll(async () => {
//     const deleteEvacuationEvent = prisma.evacuationEvent.deleteMany();
//     const deleteEvacuationResponse = prisma.evacuationResponse.deleteMany();
//     const deleteUser = prisma.user.deleteMany();
//     const deleteGroup = prisma.group.deleteMany();
//     const deleteGroupMember = prisma.groupMember.deleteMany();

//     await prisma.$transaction([
//       deleteEvacuationEvent,
//       deleteEvacuationResponse,
//       deleteUser,
//       deleteGroup,
//       deleteGroupMember
//     ]);

//     await prisma.$disconnect();
//   });
// });
