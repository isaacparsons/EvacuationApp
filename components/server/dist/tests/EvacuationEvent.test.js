"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
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
        it("org admin should be able to create an evacuation event, and should send notifications to accepted users", async () => {
            const { user: user1, token: token1 } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const { user: user2 } = await (0, dbUtil_1.setupUser)(testData_1.USER2);
            const { user: user3 } = await (0, dbUtil_1.setupUser)(testData_1.USER3);
            const org = await (0, dbUtil_1.createOrg)({ db: prisma });
            await (0, dbUtil_1.createAdminOrgMember)({ db: prisma, user: user1, org });
            await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user: user2, org });
            await prisma.organizationMember.create({
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
            await (0, dbUtil_2.createNonAdminGroupMember)({ db: prisma, user: user1, org, group });
            await (0, dbUtil_2.createNonAdminGroupMember)({ db: prisma, user: user2, org, group });
            await server_1.server.executeOperation({
                query: evacuationEvents_2.CREATE_EVACUATION_EVENT,
                variables: {
                    groupId: group.id,
                    msg: EVACUATION_EVENT_MSG
                }
            }, { req: { headers: { authorization: `Bearer ${token1}` } } });
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
            const org = await (0, dbUtil_1.createOrg)({ db: prisma });
            await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user: user1, org });
            const group = await (0, dbUtil_2.createGroup)({
                db: prisma,
                org
            });
            await (0, dbUtil_2.createAdminGroupMember)({ db: prisma, user: user1, org, group });
            await server_1.server.executeOperation({
                query: evacuationEvents_2.CREATE_EVACUATION_EVENT,
                variables: {
                    groupId: group.id,
                    msg: EVACUATION_EVENT_MSG
                }
            }, { req: { headers: { authorization: `Bearer ${token1}` } } });
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
            const org = await (0, dbUtil_1.createOrg)({ db: prisma });
            await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user: user1, org });
            const group = await (0, dbUtil_2.createGroup)({
                db: prisma,
                org
            });
            await (0, dbUtil_2.createNonAdminGroupMember)({ db: prisma, user: user1, org, group });
            const EVACUATION_EVENT_MSG = "test event";
            const result = await server_1.server.executeOperation({
                query: evacuationEvents_2.CREATE_EVACUATION_EVENT,
                variables: {
                    groupId: group.id,
                    msg: EVACUATION_EVENT_MSG
                }
            }, { req: { headers: { authorization: `Bearer ${token1}` } } });
            const evacuationEventInDb = await prisma.evacuationEvent.findFirst({
                where: {
                    groupId: group.id
                }
            });
            expect(evacuationEventInDb).toBeNull();
            expect((_a = result.errors) === null || _a === void 0 ? void 0 : _a.length).toEqual(1);
            expect((_c = (_b = result.errors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message).toEqual("Not Authorised!");
        });
        it("shouldnt be able to create evacuation event if one is already in progress", async () => {
            var _a, _b, _c;
            const { user: user1, token: token1 } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const org = await (0, dbUtil_1.createOrg)({ db: prisma });
            await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user: user1, org });
            const group = await (0, dbUtil_2.createGroup)({
                db: prisma,
                org
            });
            await (0, dbUtil_2.createAdminGroupMember)({ db: prisma, user: user1, org, group });
            const EVACUATION_EVENT_START_TIME = new Date().toISOString();
            await prisma.evacuationEvent.create({
                data: {
                    startTime: EVACUATION_EVENT_START_TIME,
                    message: EVACUATION_EVENT_MSG,
                    type: "evacuation",
                    createdBy: user1.id,
                    status: "in-progress",
                    groupId: group.id
                }
            });
            const result = await server_1.server.executeOperation({
                query: evacuationEvents_2.CREATE_EVACUATION_EVENT,
                variables: {
                    groupId: group.id,
                    msg: EVACUATION_EVENT_MSG
                }
            }, { req: { headers: { authorization: `Bearer ${token1}` } } });
            const evacuationEventsInDb = await prisma.evacuationEvent.findMany({
                where: {
                    groupId: group.id
                }
            });
            expect(evacuationEventsInDb.length).toEqual(1);
            expect(evacuationEventsInDb[0].startTime).toEqual(EVACUATION_EVENT_START_TIME);
            expect((_a = result.errors) === null || _a === void 0 ? void 0 : _a.length).toEqual(1);
            expect((_c = (_b = result.errors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message).toEqual("An evacuation event is still in progress");
        });
    });
    describe("updating evacuation events", () => {
        it("ending an evacuation event should send notifications to accepted users", async () => {
            const { user: user1, token: token1 } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const { user: user2 } = await (0, dbUtil_1.setupUser)(testData_1.USER2);
            const { user: user3 } = await (0, dbUtil_1.setupUser)(testData_1.USER3);
            const org = await (0, dbUtil_1.createOrg)({ db: prisma });
            await (0, dbUtil_1.createAdminOrgMember)({ db: prisma, user: user1, org });
            await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user: user2, org });
            await prisma.organizationMember.create({
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
            await (0, dbUtil_2.createNonAdminGroupMember)({ db: prisma, user: user1, org, group });
            await (0, dbUtil_2.createNonAdminGroupMember)({ db: prisma, user: user2, org, group });
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
            await server_1.server.executeOperation({
                query: evacuationEvents_2.UPDATE_EVACUATION_EVENT,
                variables: {
                    evacuationId: evacuationEventInProgress.id,
                    status: "ended"
                }
            }, { req: { headers: { authorization: `Bearer ${token1}` } } });
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
            const org = await (0, dbUtil_1.createOrg)({ db: prisma });
            await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user: user1, org });
            const group = await (0, dbUtil_2.createGroup)({
                db: prisma,
                org
            });
            await (0, dbUtil_2.createAdminGroupMember)({ db: prisma, user: user1, org, group });
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
            await server_1.server.executeOperation({
                query: evacuationEvents_2.UPDATE_EVACUATION_EVENT,
                variables: {
                    evacuationId: evacuationEventInProgress.id,
                    status: "ended"
                }
            }, { req: { headers: { authorization: `Bearer ${token1}` } } });
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
            const org = await (0, dbUtil_1.createOrg)({ db: prisma });
            await (0, dbUtil_1.createAdminOrgMember)({ db: prisma, user: user1, org });
            const group = await (0, dbUtil_2.createGroup)({
                db: prisma,
                org
            });
            await (0, dbUtil_2.createNonAdminGroupMember)({ db: prisma, user: user1, org, group });
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
            await server_1.server.executeOperation({
                query: evacuationEvents_2.UPDATE_EVACUATION_EVENT,
                variables: {
                    evacuationId: evacuationEventInProgress.id,
                    status: "ended"
                }
            }, { req: { headers: { authorization: `Bearer ${token1}` } } });
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
            const org = await (0, dbUtil_1.createOrg)({ db: prisma });
            await (0, dbUtil_1.createAdminOrgMember)({ db: prisma, user: user1, org });
            const group = await (0, dbUtil_2.createGroup)({
                db: prisma,
                org
            });
            await (0, dbUtil_2.createNonAdminGroupMember)({ db: prisma, user: user1, org, group });
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
            const result = await server_1.server.executeOperation({
                query: evacuationEvents_2.CREATE_EVACUATION_EVENT_RESPONSE,
                variables: {
                    evacuationId: evacuationEventEnded.id,
                    response: EVACUATION_RESPONSE
                }
            }, { req: { headers: { authorization: `Bearer ${token1}` } } });
            const evacuationResponseInDb = await prisma.evacuationResponse.findFirst({
                where: {
                    evacuationId: evacuationEventEnded.id
                }
            });
            expect(evacuationResponseInDb).toBeNull();
            expect((_a = result.errors) === null || _a === void 0 ? void 0 : _a.length).toEqual(1);
            expect((_c = (_b = result.errors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message).toEqual("Event has already ended");
        });
        it("non org admin should be able to respond to evacuation event in-progress", async () => {
            const EVACUATION_RESPONSE = "safe";
            const { user: user1, token: token1 } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const org = await (0, dbUtil_1.createOrg)({ db: prisma });
            await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user: user1, org });
            const group = await (0, dbUtil_2.createGroup)({
                db: prisma,
                org
            });
            await (0, dbUtil_2.createNonAdminGroupMember)({ db: prisma, user: user1, org, group });
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
            await server_1.server.executeOperation({
                query: evacuationEvents_2.CREATE_EVACUATION_EVENT_RESPONSE,
                variables: {
                    evacuationId: evacuationEventInProgress.id,
                    response: EVACUATION_RESPONSE
                }
            }, { req: { headers: { authorization: `Bearer ${token1}` } } });
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
        it("non org/group admin should not be able to retrieve all evacuation events", async () => {
            var _a, _b, _c;
            const { user: user1, token: token1 } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const { user: user2 } = await (0, dbUtil_1.setupUser)(testData_1.USER2);
            const org = await (0, dbUtil_1.createOrg)({ db: prisma });
            await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user: user1, org });
            await (0, dbUtil_1.createAdminOrgMember)({ db: prisma, user: user2, org });
            const group = await (0, dbUtil_2.createGroup)({
                db: prisma,
                org
            });
            await (0, dbUtil_2.createNonAdminGroupMember)({ db: prisma, user: user1, org, group });
            await (0, dbUtil_2.createNonAdminGroupMember)({ db: prisma, user: user2, org, group });
            const EVACUATION_EVENT_START_TIME = new Date().toISOString();
            await prisma.evacuationEvent.create({
                data: {
                    startTime: EVACUATION_EVENT_START_TIME,
                    message: EVACUATION_EVENT_MSG,
                    type: "evacuation",
                    createdBy: user2.id,
                    status: "in-progress",
                    groupId: group.id
                }
            });
            await prisma.evacuationEvent.create({
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
            const result = await server_1.server.executeOperation({
                query: evacuationEvents_1.GET_EVACUATION_EVENTS,
                variables: {
                    groupId: group.id
                }
            }, { req: { headers: { authorization: `Bearer ${token1}` } } });
            expect((_a = result.errors) === null || _a === void 0 ? void 0 : _a.length).toEqual(1);
            expect((_c = (_b = result.errors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message).toEqual("Not Authorised!");
        });
        it("non org/group admin should be able to retrieve in progress evacuation events", async () => {
            var _a;
            const { user: user1, token: token1 } = await (0, dbUtil_1.setupUser)(testData_1.USER1);
            const { user: user2 } = await (0, dbUtil_1.setupUser)(testData_1.USER2);
            const org = await (0, dbUtil_1.createOrg)({ db: prisma });
            await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user: user1, org });
            await (0, dbUtil_1.createAdminOrgMember)({ db: prisma, user: user2, org });
            const group = await (0, dbUtil_2.createGroup)({
                db: prisma,
                org
            });
            await (0, dbUtil_2.createNonAdminGroupMember)({ db: prisma, user: user1, org, group });
            await (0, dbUtil_2.createNonAdminGroupMember)({ db: prisma, user: user2, org, group });
            const EVACUATION_EVENT_START_TIME = new Date().toISOString();
            await prisma.evacuationEvent.create({
                data: {
                    startTime: EVACUATION_EVENT_START_TIME,
                    message: EVACUATION_EVENT_MSG,
                    type: "evacuation",
                    createdBy: user2.id,
                    status: "in-progress",
                    groupId: group.id
                }
            });
            await prisma.evacuationEvent.create({
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
            const result = await server_1.server.executeOperation({
                query: evacuationEvents_1.GET_IN_PROGRESS_EVACUATION_EVENTS
            }, { req: { headers: { authorization: `Bearer ${token1}` } } });
            expect((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.getInProgressEvacuationEvents).toEqual([
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
            const org = await (0, dbUtil_1.createOrg)({ db: prisma });
            await (0, dbUtil_1.createNonAdminOrgMember)({ db: prisma, user: user1, org });
            const group = await (0, dbUtil_2.createGroup)({
                db: prisma,
                org
            });
            await (0, dbUtil_2.createAdminGroupMember)({ db: prisma, user: user1, org, group });
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
            const result = await server_1.server.executeOperation({
                query: evacuationEvents_1.GET_EVACUATION_EVENTS,
                variables: {
                    groupId: group.id
                }
            }, { req: { headers: { authorization: `Bearer ${token1}` } } });
            expect((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.getEvacuationEvents).toEqual({
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
            const org = await (0, dbUtil_1.createOrg)({ db: prisma });
            await (0, dbUtil_1.createAdminOrgMember)({ db: prisma, user: user1, org });
            const group = await (0, dbUtil_2.createGroup)({
                db: prisma,
                org
            });
            await (0, dbUtil_2.createNonAdminGroupMember)({ db: prisma, user: user1, org, group });
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
            const result = await server_1.server.executeOperation({
                query: evacuationEvents_1.GET_EVACUATION_EVENTS,
                variables: {
                    groupId: group.id
                }
            }, { req: { headers: { authorization: `Bearer ${token1}` } } });
            expect((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.getEvacuationEvents).toEqual({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXZhY3VhdGlvbkV2ZW50LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdGVzdHMvRXZhY3VhdGlvbkV2ZW50LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwwQ0FNdUI7QUFDdkIsNkRBQXFDO0FBQ3JDLDJDQUE4QztBQUM5Qyw4Q0FBc0Q7QUFDdEQsMENBQStGO0FBQy9GLHNDQUFtQztBQUNuQyxrRUFHcUM7QUFDckMsa0VBSXFDO0FBRXJDLE1BQU0sTUFBTSxHQUFHLElBQUkscUJBQVksRUFBRSxDQUFDO0FBQ2xDLE1BQU0sT0FBTyxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO0FBRTlCLE1BQU0sb0JBQW9CLEdBQUcsWUFBWSxDQUFDO0FBRTFDLFFBQVEsQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLEVBQUU7SUFDdEMsVUFBVSxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ3BCLE1BQU0sSUFBQSxpQkFBUSxHQUFFLENBQUM7UUFDakIsTUFBTSxPQUFPLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDbEMsQ0FBQyxDQUFDLENBQUM7SUFDSCxRQUFRLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO1FBQ3hDLEVBQUUsQ0FBQyx5R0FBeUcsRUFBRSxLQUFLLElBQUksRUFBRTtZQUN2SCxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsTUFBTSxJQUFBLGtCQUFTLEVBQUMsZ0JBQUssQ0FBQyxDQUFDO1lBQzlELE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsTUFBTSxJQUFBLGtCQUFTLEVBQUMsZ0JBQUssQ0FBQyxDQUFDO1lBQy9DLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsTUFBTSxJQUFBLGtCQUFTLEVBQUMsZ0JBQUssQ0FBQyxDQUFDO1lBQy9DLE1BQU0sR0FBRyxHQUFHLE1BQU0sSUFBQSxrQkFBUyxFQUFDLEVB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