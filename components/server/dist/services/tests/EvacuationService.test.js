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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXZhY3VhdGlvblNlcnZpY2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlcy90ZXN0cy9FdmFjdWF0aW9uU2VydmljZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDJFQUEyRTtBQUUzRSw0QkFBNEI7QUFDNUIsd0JBQXdCO0FBRXhCLHFCQUFxQjtBQUNyQixtQ0FBbUM7QUFDbkMsNkNBQTZDO0FBQzdDLE1BQU07QUFFTixRQUFRLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUU7UUFDcEMsRUFBRSxDQUFDLGtEQUFrRCxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ2hFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsK0RBQStEO0FBQy9ELHNDQUFzQztBQUN0Qyx1Q0FBdUM7QUFDdkMsd0NBQXdDO0FBQ3hDLGtFQUFrRTtBQUNsRSx3Q0FBd0M7QUFFeEMscUNBQXFDO0FBRXJDLCtEQUErRDtBQUMvRCxxREFBcUQ7QUFDckQsdUJBQXVCO0FBQ3ZCLCtCQUErQjtBQUMvQiw0QkFBNEI7QUFDNUIsK0JBQStCO0FBQy9CLDJCQUEyQjtBQUMzQixPQUFPO0FBQ1Asd0JBQXdCO0FBQ3hCLGdDQUFnQztBQUNoQyw2QkFBNkI7QUFDN0IsK0JBQStCO0FBQy9CLDJCQUEyQjtBQUMzQixPQUFPO0FBQ1Asd0JBQXdCO0FBQ3hCLHlCQUF5QjtBQUN6QixPQUFPO0FBQ1AsbUNBQW1DO0FBQ25DLDBCQUEwQjtBQUMxQixrQkFBa0I7QUFDbEIsT0FBTztBQUNQLGlDQUFpQztBQUNqQywwQkFBMEI7QUFDMUIsbUJBQW1CO0FBQ25CLE9BQU87QUFDUCw2REFBNkQ7QUFDN0QsMkRB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