"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const dbUtil_1 = require("../dev/dbUtil");
const Mailhog_1 = __importDefault(require("../dev/Mailhog"));
const client_1 = require("@prisma/client");
const testData_1 = require("../dev/testData");
const dbUtil_2 = require("../dev/dbUtil");
const server_1 = require("../server");
const evacuationEvents_1 = require("../dev/gql/evacuationEvents");
const evacuationEvents_2 = require("../dev/gql/evacuationEvents");
const prisma = new client_1.PrismaClient();
const mailhog = new Mailhog_1.default();
const EVACUATION_EVENT_MSG = "test event";
describe("evacuation event tests", () => {
  beforeEach(async () => {
    await (0, dbUtil_1.deleteDb)();
    await mailhog.deleteAllEmails();
  });
  describe("create evacuation events", () => {
    it("org admin should be able to create an evacuation event, and should send notifications to joined users", async () => {
      const { user: user1, token: token1 } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
      const { user: user2, token: token2 } = await (0, dbUtil_1.setupUser)(testData_1.USER2);
      const { user: user3, token: token3 } = await (0, dbUtil_1.setupUser)(testData_1.USER3);
      const org = await (0, dbUtil_1.createOrg)(prisma);
      const adminOrgMember = await (0, dbUtil_1.createAdminOrgMember)(prisma, user1, org);
      const nonAdminOrgMember1 = await (0, dbUtil_1.createNonAdminOrgMember)(prisma, user2, org);
      const nonAdminOrgMember2 = await await prisma.organizationMember.create({
        data: {
          user: {
            connect: { id: user3.id }
          },
          organization: {
            connect: { id: org.id }
          },
          status: "pending",
          admin: false
        }
      });
      const group = await (0, dbUtil_2.createGroup)({
        db: prisma,
        org,
        notificationSettings: {
          pushEnabled: false,
          emailEnabled: true,
          smsEnabled: false
        }
      });
      const nonAdminGroupMember1 = await (0, dbUtil_2.createNonAdminGroupMember)(
        prisma,
        user1,
        org,
        group
      );
      const nonAdminGroupMember2 = await (0, dbUtil_2.createNonAdminGroupMember)(
        prisma,
        user2,
        org,
        group
      );
      const result = await server_1.server.executeOperation(
        {
          query: evacuationEvents_2.CREATE_EVACUATION_EVENT,
          variables: {
            groupId: group.id,
            msg: EVACUATION_EVENT_MSG
          }
        },
        { req: { headers: { authorization: `Bearer ${token1}` } } }
      );
      const evacuationEventInDb = await prisma.evacuationEvent.findFirst({
        where: {
          groupId: group.id
        }
      });
      expect(evacuationEventInDb).toEqual({
        id: expect.any(Number),
        startTime: expect.any(String),
        createdBy: user1.id,
        endTime: null,
        message: EVACUATION_EVENT_MSG,
        status: "in-progress",
        groupId: group.id,
        type: "evacuation"
      });
      const emails = await mailhog.getEmails();
      const email = emails[0];
      const recepients = mailhog.getRecepients(email);
      expect(emails.length).toEqual(1);
      expect(recepients).toEqual([user1.email, user2.email]);
      expect(mailhog.getSender(email)).toEqual(process.env.EMAIL);
      expect(mailhog.getSubject(email)).toEqual("Evacuation Alert!");
    });
    it("group admin should be able to create an evacuation event", async () => {
      const { user: user1, token: token1 } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
      const org = await (0, dbUtil_1.createOrg)(prisma);
      const nonAdminOrgMember1 = await (0, dbUtil_1.createNonAdminOrgMember)(prisma, user1, org);
      const group = await (0, dbUtil_2.createGroup)({
        db: prisma,
        org
      });
      const adminGroupMember1 = await (0, dbUtil_2.createAdminGroupMember)(
        prisma,
        user1,
        org,
        group
      );
      const result = await server_1.server.executeOperation(
        {
          query: evacuationEvents_2.CREATE_EVACUATION_EVENT,
          variables: {
            groupId: group.id,
            msg: EVACUATION_EVENT_MSG
          }
        },
        { req: { headers: { authorization: `Bearer ${token1}` } } }
      );
      const evacuationEventInDb = await prisma.evacuationEvent.findFirst({
        where: {
          groupId: group.id
        }
      });
      expect(evacuationEventInDb).toEqual({
        id: expect.any(Number),
        startTime: expect.any(String),
        createdBy: user1.id,
        endTime: null,
        message: EVACUATION_EVENT_MSG,
        status: "in-progress",
        groupId: group.id,
        type: "evacuation"
      });
    });
    it("non org/group admin should not be able to create an evacuation event", async () => {
      var _a, _b, _c;
      const { user: user1, token: token1 } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
      const org = await (0, dbUtil_1.createOrg)(prisma);
      const nonAdminOrgMember1 = await (0, dbUtil_1.createNonAdminOrgMember)(prisma, user1, org);
      const group = await (0, dbUtil_2.createGroup)({
        db: prisma,
        org
      });
      const nonAdminGroupMember1 = await (0, dbUtil_2.createNonAdminGroupMember)(
        prisma,
        user1,
        org,
        group
      );
      const EVACUATION_EVENT_MSG = "test event";
      const result = await server_1.server.executeOperation(
        {
          query: evacuationEvents_2.CREATE_EVACUATION_EVENT,
          variables: {
            groupId: group.id,
            msg: EVACUATION_EVENT_MSG
          }
        },
        { req: { headers: { authorization: `Bearer ${token1}` } } }
      );
      const evacuationEventInDb = await prisma.evacuationEvent.findFirst({
        where: {
          groupId: group.id
        }
      });
      expect(evacuationEventInDb).toBeNull();
      expect((_a = result.errors) === null || _a === void 0 ? void 0 : _a.length).toEqual(1);
      expect(
        (_c = (_b = result.errors) === null || _b === void 0 ? void 0 : _b[0]) === null ||
          _c === void 0
          ? void 0
          : _c.message
      ).toEqual("Not Authorised!");
    });
    it("shouldnt be able to create evacuation event if one is already in progress", async () => {
      var _a, _b, _c;
      const { user: user1, token: token1 } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
      const org = await (0, dbUtil_1.createOrg)(prisma);
      const nonAdminOrgMember1 = await (0, dbUtil_1.createNonAdminOrgMember)(prisma, user1, org);
      const group = await (0, dbUtil_2.createGroup)({
        db: prisma,
        org
      });
      const adminGroupMember1 = await (0, dbUtil_2.createAdminGroupMember)(
        prisma,
        user1,
        org,
        group
      );
      const EVACUATION_EVENT_START_TIME = new Date().toISOString();
      const evacuationEventInProgress = await prisma.evacuationEvent.create({
        data: {
          startTime: EVACUATION_EVENT_START_TIME,
          message: EVACUATION_EVENT_MSG,
          type: "evacuation",
          createdBy: user1.id,
          status: "in-progress",
          groupId: group.id
        }
      });
      const result = await server_1.server.executeOperation(
        {
          query: evacuationEvents_2.CREATE_EVACUATION_EVENT,
          variables: {
            groupId: group.id,
            msg: EVACUATION_EVENT_MSG
          }
        },
        { req: { headers: { authorization: `Bearer ${token1}` } } }
      );
      const evacuationEventsInDb = await prisma.evacuationEvent.findMany({
        where: {
          groupId: group.id
        }
      });
      expect(evacuationEventsInDb.length).toEqual(1);
      expect(evacuationEventsInDb[0].startTime).toEqual(EVACUATION_EVENT_START_TIME);
      expect((_a = result.errors) === null || _a === void 0 ? void 0 : _a.length).toEqual(1);
      expect(
        (_c = (_b = result.errors) === null || _b === void 0 ? void 0 : _b[0]) === null ||
          _c === void 0
          ? void 0
          : _c.message
      ).toEqual("An evacuation event is still in progress");
    });
  });
  describe("updating evacuation events", () => {
    it("ending an evacuation event should send notifications to joined users", async () => {
      const { user: user1, token: token1 } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
      const { user: user2, token: token2 } = await (0, dbUtil_1.setupUser)(testData_1.USER2);
      const { user: user3, token: token3 } = await (0, dbUtil_1.setupUser)(testData_1.USER3);
      const org = await (0, dbUtil_1.createOrg)(prisma);
      const adminOrgMember = await (0, dbUtil_1.createAdminOrgMember)(prisma, user1, org);
      const nonAdminOrgMember1 = await (0, dbUtil_1.createNonAdminOrgMember)(prisma, user2, org);
      const nonAdminOrgMember2 = await await prisma.organizationMember.create({
        data: {
          user: {
            connect: { id: user3.id }
          },
          organization: {
            connect: { id: org.id }
          },
          status: "pending",
          admin: false
        }
      });
      const group = await (0, dbUtil_2.createGroup)({
        db: prisma,
        org,
        notificationSettings: {
          pushEnabled: false,
          emailEnabled: true,
          smsEnabled: false
        }
      });
      const nonAdminGroupMember1 = await (0, dbUtil_2.createNonAdminGroupMember)(
        prisma,
        user1,
        org,
        group
      );
      const nonAdminGroupMember2 = await (0, dbUtil_2.createNonAdminGroupMember)(
        prisma,
        user2,
        org,
        group
      );
      const EVACUATION_EVENT_START_TIME = new Date().toISOString();
      const evacuationEventInProgress = await prisma.evacuationEvent.create({
        data: {
          startTime: EVACUATION_EVENT_START_TIME,
          message: EVACUATION_EVENT_MSG,
          type: "evacuation",
          createdBy: user1.id,
          status: "in-progress",
          groupId: group.id
        }
      });
      const result = await server_1.server.executeOperation(
        {
          query: evacuationEvents_2.UPDATE_EVACUATION_EVENT,
          variables: {
            evacuationId: evacuationEventInProgress.id,
            status: "ended"
          }
        },
        { req: { headers: { authorization: `Bearer ${token1}` } } }
      );
      const evacuationEventInDb = await prisma.evacuationEvent.findFirst({
        where: {
          groupId: group.id
        }
      });
      expect(evacuationEventInDb).toEqual({
        id: expect.any(Number),
        startTime: expect.any(String),
        createdBy: user1.id,
        endTime: expect.any(String),
        message: EVACUATION_EVENT_MSG,
        status: "ended",
        groupId: group.id,
        type: "evacuation"
      });
      const emails = await mailhog.getEmails();
      const email = emails[0];
      const recepients = mailhog.getRecepients(email);
      expect(emails.length).toEqual(1);
      expect(recepients).toEqual([user1.email, user2.email]);
      expect(mailhog.getSender(email)).toEqual(process.env.EMAIL);
      expect(mailhog.getSubject(email)).toEqual("Evacuation status update: safe to return");
    });
    it("group admin should be able to update in-progress evacuation event", async () => {
      const { user: user1, token: token1 } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
      const org = await (0, dbUtil_1.createOrg)(prisma);
      const nonAdminOrgMember = await (0, dbUtil_1.createNonAdminOrgMember)(prisma, user1, org);
      const group = await (0, dbUtil_2.createGroup)({
        db: prisma,
        org
      });
      const adminGroupMember = await (0, dbUtil_2.createAdminGroupMember)(
        prisma,
        user1,
        org,
        group
      );
      const EVACUATION_EVENT_START_TIME = new Date().toISOString();
      const evacuationEventInProgress = await prisma.evacuationEvent.create({
        data: {
          startTime: EVACUATION_EVENT_START_TIME,
          message: EVACUATION_EVENT_MSG,
          type: "evacuation",
          createdBy: user1.id,
          status: "in-progress",
          groupId: group.id
        }
      });
      const result = await server_1.server.executeOperation(
        {
          query: evacuationEvents_2.UPDATE_EVACUATION_EVENT,
          variables: {
            evacuationId: evacuationEventInProgress.id,
            status: "ended"
          }
        },
        { req: { headers: { authorization: `Bearer ${token1}` } } }
      );
      const evacuationEventInDb = await prisma.evacuationEvent.findFirst({
        where: {
          groupId: group.id
        }
      });
      expect(evacuationEventInDb).toEqual({
        id: expect.any(Number),
        startTime: expect.any(String),
        createdBy: user1.id,
        endTime: expect.any(String),
        message: EVACUATION_EVENT_MSG,
        status: "ended",
        groupId: group.id,
        type: "evacuation"
      });
    });
    it("org admin should be able to update in-progress evacuation event", async () => {
      const { user: user1, token: token1 } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
      const org = await (0, dbUtil_1.createOrg)(prisma);
      const adminOrgMember = await (0, dbUtil_1.createAdminOrgMember)(prisma, user1, org);
      const group = await (0, dbUtil_2.createGroup)({
        db: prisma,
        org
      });
      const nonAdminGroupMember = await (0, dbUtil_2.createNonAdminGroupMember)(
        prisma,
        user1,
        org,
        group
      );
      const EVACUATION_EVENT_START_TIME = new Date().toISOString();
      const evacuationEventInProgress = await prisma.evacuationEvent.create({
        data: {
          startTime: EVACUATION_EVENT_START_TIME,
          message: EVACUATION_EVENT_MSG,
          type: "evacuation",
          createdBy: user1.id,
          status: "in-progress",
          groupId: group.id
        }
      });
      const result = await server_1.server.executeOperation(
        {
          query: evacuationEvents_2.UPDATE_EVACUATION_EVENT,
          variables: {
            evacuationId: evacuationEventInProgress.id,
            status: "ended"
          }
        },
        { req: { headers: { authorization: `Bearer ${token1}` } } }
      );
      const evacuationEventInDb = await prisma.evacuationEvent.findFirst({
        where: {
          groupId: group.id
        }
      });
      expect(evacuationEventInDb).toEqual({
        id: expect.any(Number),
        startTime: expect.any(String),
        createdBy: user1.id,
        endTime: expect.any(String),
        message: EVACUATION_EVENT_MSG,
        status: "ended",
        groupId: group.id,
        type: "evacuation"
      });
    });
  });
  describe("evacuation event response", () => {
    it("shouldnt be able to respond to evacuation event if the event is not in progress", async () => {
      var _a, _b, _c;
      const EVACUATION_RESPONSE = "safe";
      const { user: user1, token: token1 } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
      const org = await (0, dbUtil_1.createOrg)(prisma);
      const adminOrgMember = await (0, dbUtil_1.createAdminOrgMember)(prisma, user1, org);
      const group = await (0, dbUtil_2.createGroup)({
        db: prisma,
        org
      });
      const nonAdminGroupMember = await (0, dbUtil_2.createNonAdminGroupMember)(
        prisma,
        user1,
        org,
        group
      );
      const EVACUATION_EVENT_START_TIME = new Date().toISOString();
      const evacuationEventEnded = await prisma.evacuationEvent.create({
        data: {
          startTime: EVACUATION_EVENT_START_TIME,
          endTime: EVACUATION_EVENT_START_TIME,
          message: EVACUATION_EVENT_MSG,
          type: "evacuation",
          createdBy: user1.id,
          status: "ended",
          groupId: group.id
        }
      });
      const result = await server_1.server.executeOperation(
        {
          query: evacuationEvents_2.CREATE_EVACUATION_EVENT_RESPONSE,
          variables: {
            evacuationId: evacuationEventEnded.id,
            response: EVACUATION_RESPONSE
          }
        },
        { req: { headers: { authorization: `Bearer ${token1}` } } }
      );
      const evacuationResponseInDb = await prisma.evacuationResponse.findFirst({
        where: {
          evacuationId: evacuationEventEnded.id
        }
      });
      expect(evacuationResponseInDb).toBeNull();
      expect((_a = result.errors) === null || _a === void 0 ? void 0 : _a.length).toEqual(1);
      expect(
        (_c = (_b = result.errors) === null || _b === void 0 ? void 0 : _b[0]) === null ||
          _c === void 0
          ? void 0
          : _c.message
      ).toEqual("Evacuation Event is no longer in progress");
    });
    it("non org admin should be able to respond to evacuation event in-progress", async () => {
      const EVACUATION_RESPONSE = "safe";
      const { user: user1, token: token1 } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
      const org = await (0, dbUtil_1.createOrg)(prisma);
      const nonAdminOrgMember = await (0, dbUtil_1.createNonAdminOrgMember)(prisma, user1, org);
      const group = await (0, dbUtil_2.createGroup)({
        db: prisma,
        org
      });
      const nonAdminGroupMember = await (0, dbUtil_2.createNonAdminGroupMember)(
        prisma,
        user1,
        org,
        group
      );
      const EVACUATION_EVENT_START_TIME = new Date().toISOString();
      const evacuationEventInProgress = await prisma.evacuationEvent.create({
        data: {
          startTime: EVACUATION_EVENT_START_TIME,
          message: EVACUATION_EVENT_MSG,
          type: "evacuation",
          createdBy: user1.id,
          status: "in-progress",
          groupId: group.id
        }
      });
      const result = await server_1.server.executeOperation(
        {
          query: evacuationEvents_2.CREATE_EVACUATION_EVENT_RESPONSE,
          variables: {
            evacuationId: evacuationEventInProgress.id,
            response: EVACUATION_RESPONSE
          }
        },
        { req: { headers: { authorization: `Bearer ${token1}` } } }
      );
      const evacuationResponseInDb = await prisma.evacuationResponse.findFirst({
        where: {
          evacuationId: evacuationEventInProgress.id
        }
      });
      expect(evacuationResponseInDb).toEqual({
        id: expect.any(Number),
        response: EVACUATION_RESPONSE,
        userId: user1.id,
        time: expect.any(String),
        evacuationId: evacuationEventInProgress.id
      });
    });
  });
  describe("get evacuation events", () => {
    it("non org admin should not be able to retrieve all evacuation events", async () => {
      var _a, _b, _c;
      const { user: user1, token: token1 } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
      const { user: user2, token: token2 } = await (0, dbUtil_1.setupUser)(testData_1.USER2);
      const org = await (0, dbUtil_1.createOrg)(prisma);
      const nonAdminOrgMember = await (0, dbUtil_1.createNonAdminOrgMember)(prisma, user1, org);
      const adminOrgMember = await (0, dbUtil_1.createAdminOrgMember)(prisma, user2, org);
      const group = await (0, dbUtil_2.createGroup)({
        db: prisma,
        org
      });
      const nonAdminGroupMember1 = await (0, dbUtil_2.createNonAdminGroupMember)(
        prisma,
        user1,
        org,
        group
      );
      const nonAdminGroupMember2 = await (0, dbUtil_2.createNonAdminGroupMember)(
        prisma,
        user2,
        org,
        group
      );
      const EVACUATION_EVENT_START_TIME = new Date().toISOString();
      const evacuationEventInProgress = await prisma.evacuationEvent.create({
        data: {
          startTime: EVACUATION_EVENT_START_TIME,
          message: EVACUATION_EVENT_MSG,
          type: "evacuation",
          createdBy: user2.id,
          status: "in-progress",
          groupId: group.id
        }
      });
      const evacuationEventEnded = await prisma.evacuationEvent.create({
        data: {
          startTime: EVACUATION_EVENT_START_TIME,
          endTime: EVACUATION_EVENT_START_TIME,
          message: EVACUATION_EVENT_MSG,
          type: "evacuation",
          createdBy: user2.id,
          status: "ended",
          groupId: group.id
        }
      });
      const result = await server_1.server.executeOperation(
        {
          query: evacuationEvents_1.GET_EVACUATION_EVENTS,
          variables: {
            groupId: group.id
          }
        },
        { req: { headers: { authorization: `Bearer ${token1}` } } }
      );
      expect((_a = result.errors) === null || _a === void 0 ? void 0 : _a.length).toEqual(1);
      expect(
        (_c = (_b = result.errors) === null || _b === void 0 ? void 0 : _b[0]) === null ||
          _c === void 0
          ? void 0
          : _c.message
      ).toEqual("Not Authorised!");
    });
    it("non org/group admin should be able to in progress evacuation events", async () => {
      var _a;
      const { user: user1, token: token1 } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
      const { user: user2, token: token2 } = await (0, dbUtil_1.setupUser)(testData_1.USER2);
      const org = await (0, dbUtil_1.createOrg)(prisma);
      const nonAdminOrgMember = await (0, dbUtil_1.createNonAdminOrgMember)(prisma, user1, org);
      const adminOrgMember = await (0, dbUtil_1.createAdminOrgMember)(prisma, user2, org);
      const group = await (0, dbUtil_2.createGroup)({
        db: prisma,
        org
      });
      const nonAdminGroupMember1 = await (0, dbUtil_2.createNonAdminGroupMember)(
        prisma,
        user1,
        org,
        group
      );
      const nonAdminGroupMember2 = await (0, dbUtil_2.createNonAdminGroupMember)(
        prisma,
        user2,
        org,
        group
      );
      const EVACUATION_EVENT_START_TIME = new Date().toISOString();
      const evacuationEventInProgress = await prisma.evacuationEvent.create({
        data: {
          startTime: EVACUATION_EVENT_START_TIME,
          message: EVACUATION_EVENT_MSG,
          type: "evacuation",
          createdBy: user2.id,
          status: "in-progress",
          groupId: group.id
        }
      });
      const evacuationEventEnded = await prisma.evacuationEvent.create({
        data: {
          startTime: EVACUATION_EVENT_START_TIME,
          endTime: EVACUATION_EVENT_START_TIME,
          message: EVACUATION_EVENT_MSG,
          type: "evacuation",
          createdBy: user2.id,
          status: "ended",
          groupId: group.id
        }
      });
      const result = await server_1.server.executeOperation(
        {
          query: evacuationEvents_1.GET_IN_PROGRESS_EVACUATION_EVENTS
        },
        { req: { headers: { authorization: `Bearer ${token1}` } } }
      );
      expect(
        (_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0
          ? void 0
          : _a.getInProgressEvacuationEvents
      ).toEqual([
        {
          createdBy: user2.id,
          endTime: null,
          groupId: group.id,
          id: expect.any(Number),
          message: EVACUATION_EVENT_MSG,
          startTime: EVACUATION_EVENT_START_TIME,
          status: "in-progress"
        }
      ]);
    });
    it("group admin should be able to retrieve all evacuation events", async () => {
      var _a;
      const { user: user1, token: token1 } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
      const org = await (0, dbUtil_1.createOrg)(prisma);
      const nonAdminOrgMember = await (0, dbUtil_1.createNonAdminOrgMember)(prisma, user1, org);
      const group = await (0, dbUtil_2.createGroup)({
        db: prisma,
        org
      });
      const adminGroupMember1 = await (0, dbUtil_2.createAdminGroupMember)(
        prisma,
        user1,
        org,
        group
      );
      const EVACUATION_EVENT_START_TIME = new Date().toISOString();
      const evacuationEventInProgress = await prisma.evacuationEvent.create({
        data: {
          startTime: EVACUATION_EVENT_START_TIME,
          message: EVACUATION_EVENT_MSG,
          type: "evacuation",
          createdBy: user1.id,
          status: "in-progress",
          groupId: group.id
        }
      });
      const evacuationEventEnded = await prisma.evacuationEvent.create({
        data: {
          startTime: EVACUATION_EVENT_START_TIME,
          endTime: EVACUATION_EVENT_START_TIME,
          message: EVACUATION_EVENT_MSG,
          type: "evacuation",
          createdBy: user1.id,
          status: "ended",
          groupId: group.id
        }
      });
      const result = await server_1.server.executeOperation(
        {
          query: evacuationEvents_1.GET_EVACUATION_EVENTS,
          variables: {
            groupId: group.id
          }
        },
        { req: { headers: { authorization: `Bearer ${token1}` } } }
      );
      expect(
        (_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0
          ? void 0
          : _a.getEvacuationEvents
      ).toEqual({
        cursor: expect.any(Number),
        data: [
          {
            createdBy: user1.id,
            endTime: null,
            groupId: group.id,
            id: evacuationEventInProgress.id,
            message: EVACUATION_EVENT_MSG,
            startTime: EVACUATION_EVENT_START_TIME,
            status: "in-progress"
          },
          {
            createdBy: user1.id,
            endTime: EVACUATION_EVENT_START_TIME,
            groupId: group.id,
            id: evacuationEventEnded.id,
            message: EVACUATION_EVENT_MSG,
            startTime: EVACUATION_EVENT_START_TIME,
            status: "ended"
          }
        ]
      });
    });
    it("org admin should be able to retrieve all evacuation events", async () => {
      var _a;
      const { user: user1, token: token1 } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
      const org = await (0, dbUtil_1.createOrg)(prisma);
      const adminOrgMember = await (0, dbUtil_1.createAdminOrgMember)(prisma, user1, org);
      const group = await (0, dbUtil_2.createGroup)({
        db: prisma,
        org
      });
      const adminGroupMember1 = await (0, dbUtil_2.createNonAdminGroupMember)(
        prisma,
        user1,
        org,
        group
      );
      const EVACUATION_EVENT_START_TIME = new Date().toISOString();
      const evacuationEventInProgress = await prisma.evacuationEvent.create({
        data: {
          startTime: EVACUATION_EVENT_START_TIME,
          message: EVACUATION_EVENT_MSG,
          type: "evacuation",
          createdBy: user1.id,
          status: "in-progress",
          groupId: group.id
        }
      });
      const evacuationEventEnded = await prisma.evacuationEvent.create({
        data: {
          startTime: EVACUATION_EVENT_START_TIME,
          endTime: EVACUATION_EVENT_START_TIME,
          message: EVACUATION_EVENT_MSG,
          type: "evacuation",
          createdBy: user1.id,
          status: "ended",
          groupId: group.id
        }
      });
      const result = await server_1.server.executeOperation(
        {
          query: evacuationEvents_1.GET_EVACUATION_EVENTS,
          variables: {
            groupId: group.id
          }
        },
        { req: { headers: { authorization: `Bearer ${token1}` } } }
      );
      expect(
        (_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0
          ? void 0
          : _a.getEvacuationEvents
      ).toEqual({
        cursor: expect.any(Number),
        data: [
          {
            createdBy: user1.id,
            endTime: null,
            groupId: group.id,
            id: evacuationEventInProgress.id,
            message: EVACUATION_EVENT_MSG,
            startTime: EVACUATION_EVENT_START_TIME,
            status: "in-progress"
          },
          {
            createdBy: user1.id,
            endTime: EVACUATION_EVENT_START_TIME,
            groupId: group.id,
            id: evacuationEventEnded.id,
            message: EVACUATION_EVENT_MSG,
            startTime: EVACUATION_EVENT_START_TIME,
            status: "ended"
          }
        ]
      });
    });
    // it("non org/group admin should not be able to retrieve responses", async () => {
    //   const EVACUATION_RESPONSE_MSG = "safe";
    //   const { user: nonAdminUser, token: nonAdminToken } = await setupUser(USER1);
    //   const { user: adminUser, token: adminToken } = await setupUser(USER2);
    //   const org = await createOrg({db: prisma});
    //   const nonAdminOrgMember = await createNonAdminOrgMember(prisma, nonAdminUser, org);
    //   const adminOrgMember = await createAdminOrgMember(prisma, adminUser, org);
    //   const group = await createGroup({
    //     db: prisma,
    //     org
    //   });
    //   const nonAdminGroupMember1 = await createNonAdminGroupMember(prisma, adminUser, org, group);
    //   const nonAdminGroupMember2 = await createNonAdminGroupMember(
    //     prisma,
    //     nonAdminUser,
    //     org,
    //     group
    //   );
    //   const EVACUATION_EVENT_START_TIME = new Date().toISOString();
    //   const evacuationEventInProgress = await prisma.evacuationEvent.create({
    //     data: {
    //       startTime: EVACUATION_EVENT_START_TIME,
    //       message: EVACUATION_EVENT_MSG,
    //       type: "evacuation",
    //       createdBy: adminUser.id,
    //       status: "in-progress",
    //       groupId: group.id
    //     }
    //   });
    //   const evacuationResponse = await prisma.evacuationResponse.create({
    //     data: {
    //       response: EVACUATION_RESPONSE_MSG,
    //       userId: adminUser.id,
    //       time: EVACUATION_EVENT_START_TIME,
    //       evacuationId: evacuationEventInProgress.id
    //     }
    //   });
    //   const result = await server.executeOperation(
    //     {
    //       query: GET_EVACUATION_EVENT,
    //       variables: {
    //         evacuationId: evacuationEventInProgress.id
    //       }
    //     },
    //     { req: { headers: { authorization: `Bearer ${nonAdminToken}` } } } as any
    //   );
    //   expect(result?.data?.getEvacuationEvent).toEqual({
    //     id: evacuationEventInProgress.id,
    //     startTime: EVACUATION_EVENT_START_TIME,
    //     endTime: null,
    //     message: EVACUATION_EVENT_MSG,
    //     createdBy: adminUser.id,
    //     status: "in-progress",
    //     groupId: group.id,
    //     responses: null
    //   });
    // });
    // it("org admin should be able to retrieve responses", async () => {})
    // it("group admin should be able to retrieve responses", async () => {})
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXZhY3VhdGlvbkV2ZW50LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdGVzdHMvRXZhY3VhdGlvbkV2ZW50LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwwQ0FNdUI7QUFDdkIsNkRBQXFDO0FBQ3JDLDJDQUE4QztBQUM5Qyw4Q0FBc0Q7QUFDdEQsMENBQStGO0FBQy9GLHNDQUFtQztBQUVuQyxrRUFHcUM7QUFDckMsa0VBSXFDO0FBRXJDLE1BQU0sTUFBTSxHQUFHLElBQUkscUJBQVksRUFBRSxDQUFDO0FBQ2xDLE1BQU0sT0FBTyxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO0FBRTlCLE1BQU0sb0JBQW9CLEdBQUcsWUFBWSxDQUFDO0FBRTFDLFFBQVEsQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLEVBQUU7SUFDdEMsVUFBVSxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ3BCLE1BQU0sSUFBQSxpQkFBUSxHQUFFLENBQUM7UUFDakIsTUFBTSxPQUFPLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDbEMsQ0FBQyxDQUFDLENBQUM7SUFDSCxRQUFRLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO1FBQ3hDLEVBQUUsQ0FBQyx1R0FBdUcsRUFBRSxLQUFLLElBQUksRUFBRTtZQUNySCxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsTUFBTSxJQUFBLGtCQUFTLEVBQUMsZ0JBQUssQ0FBQyxDQUFDO1lBQzlELE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxNQUFNLElBQUEsa0JBQVMsRUFBQyxnQkFBSyxDQUFDLENBQUM7WUFDOUQsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLE1BQU0sSUFBQSxrQkFBUyxFQUFDLGdCQUFLLENBQUMsQ0FBQztZQUM5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
