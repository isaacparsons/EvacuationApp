"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("../../context");
let mockCtx;
let context;
beforeEach(() => {
    mockCtx = (0, context_1.createMockContext)();
    context = mockCtx;
});
describe("group service unit tests", () => {
    beforeEach(async () => { });
    describe("inviteToOrganization", () => {
        it("should return 1 succeeded user and 1 failed user", async () => { });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXZhY3VhdGlvblNlcnZpY2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlcy90ZXN0cy9FdmFjdWF0aW9uU2VydmljZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkNBQXdFO0FBRXhFLElBQUksT0FBb0IsQ0FBQztBQUN6QixJQUFJLE9BQWdCLENBQUM7QUFFckIsVUFBVSxDQUFDLEdBQUcsRUFBRTtJQUNkLE9BQU8sR0FBRyxJQUFBLDJCQUFpQixHQUFFLENBQUM7SUFDOUIsT0FBTyxHQUFHLE9BQTZCLENBQUM7QUFDMUMsQ0FBQyxDQUFDLENBQUM7QUFFSCxRQUFRLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLFVBQVUsQ0FBQyxLQUFLLElBQUksRUFBRSxHQUFFLENBQUMsQ0FBQyxDQUFDO0lBRTNCLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUU7UUFDcEMsRUFBRSxDQUFDLGtEQUFrRCxFQUFFLEtBQUssSUFBSSxFQUFFLEdBQUUsQ0FBQyxDQUFDLENBQUM7SUFDekUsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILCtEQUErRDtBQUMvRCxzQ0FBc0M7QUFDdEMsdUNBQXVDO0FBQ3ZDLHdDQUF3QztBQUN4QyxrRUFBa0U7QUFDbEUsd0NBQXdDO0FBRXhDLHFDQUFxQztBQUVyQywrREFBK0Q7QUFDL0QscURBQXFEO0FBQ3JELHVCQUF1QjtBQUN2QiwrQkFBK0I7QUFDL0IsNEJBQTRCO0FBQzVCLCtCQUErQjtBQUMvQiwyQkFBMkI7QUFDM0IsT0FBTztBQUNQLHdCQUF3QjtBQUN4QixnQ0FBZ0M7QUFDaEMsNkJBQTZCO0FBQzdCLCtCQUErQjtBQUMvQiwyQkFBMkI7QUFDM0IsT0FBTztBQUNQLHdCQUF3QjtBQUN4Qix5QkFBeUI7QUFDekIsT0FBTztBQUNQLG1DQUFtQztBQUNuQywwQkFBMEI7QUFDMUIsa0JBQWtCO0FBQ2xC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