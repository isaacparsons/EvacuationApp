"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOrgAdmin = exports.isGroupAdmin = exports.isAuthenticated = void 0;
const graphql_shield_1 = require("graphql-shield");
const evacuationEvents_1 = __importDefault(require("../db/evacuationEvents"));
const group_1 = __importDefault(require("../db/group"));
const organization_1 = __importDefault(require("../db/organization"));
exports.isAuthenticated = (0, graphql_shield_1.rule)()(async (parent, args, ctx) => {
    if (!ctx.user) {
        return new Error("Missing access token");
    }
    return true;
});
exports.isGroupAdmin = (0, graphql_shield_1.rule)()(async (parent, args, ctx) => {
    const evacuationEventRepository = new evacuationEvents_1.default(ctx.db);
    const groupRepository = new group_1.default(ctx.db);
    let member;
    if (args.evacuationId) {
        const evacuationEvent = await evacuationEventRepository.getEvacuationEventById({
            evacuationId: args.evacuationId
        });
        if (!evacuationEvent) {
            return new Error("Evacuation event does not exist");
        }
        member = await groupRepository.getGroupMember({
            userId: ctx.user.id,
            groupId: evacuationEvent.groupId
        });
    }
    if (args.groupId) {
        member = await groupRepository.getGroupMember({
            userId: ctx.user.id,
            groupId: args.groupId
        });
    }
    if (member === null || member === void 0 ? void 0 : member.admin) {
        return true;
    }
    return false;
});
exports.isOrgAdmin = (0, graphql_shield_1.rule)()(async (parent, args, ctx) => {
    const evacuationEventRepository = new evacuationEvents_1.default(ctx.db);
    const organizationRepository = new organization_1.default(ctx.db);
    const groupRepository = new group_1.default(ctx.db);
    let member;
    if (args.announcementId) {
        const announcement = await organizationRepository.getAnnouncementById({
            announcementId: args.announcementId
        });
        if (!announcement) {
            return new Error("Announcement does not exist");
        }
        member = await organizationRepository.getOrganizationMember({
            organizationId: announcement.organizationId,
            userId: ctx.user.id
        });
    }
    if (args.evacuationId) {
        const evacuationEvent = await evacuationEventRepository.getEvacuationEventById({
            evacuationId: args.evacuationId
        });
        if (!evacuationEvent) {
            return new Error("Evacuation event does not exist");
        }
        const group = await groupRepository.getGroupById({
            groupId: evacuationEvent.groupId
        });
        if (!group) {
            return new Error("Group does not exist");
        }
        member = await organizationRepository.getOrganizationMember({
            organizationId: group.organizationId,
            userId: ctx.user.id
        });
    }
    if (args.groupId) {
        const group = await groupRepository.getGroupById({
            groupId: args.groupId
        });
        if (!group) {
            return new Error("Group does not exist");
        }
        member = await organizationRepository.getOrganizationMember({
            organizationId: group.organizationId,
            userId: ctx.user.id
        });
    }
    if (args.organizationId) {
        member = await organizationRepository.getOrganizationMember({
            organizationId: args.organizationId,
            userId: ctx.user.id
        });
    }
    if (member === null || member === void 0 ? void 0 : member.admin) {
        return true;
    }
    return false;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVsZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGVybWlzc2lvbnMvcnVsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsbURBQXNDO0FBR3RDLDhFQUErRDtBQUMvRCx3REFBMEM7QUFDMUMsc0VBQXdEO0FBRTNDLFFBQUEsZUFBZSxHQUFHLElBQUEscUJBQUksR0FBRSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQVksRUFBRSxFQUFFO0lBQ3pFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFO1FBQ2IsT0FBTyxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0tBQzFDO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDLENBQUMsQ0FBQztBQUVVLFFBQUEsWUFBWSxHQUFHLElBQUEscUJBQUksR0FBRSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQVksRUFBRSxFQUFFO0lBQ3RFLE1BQU0seUJBQXlCLEdBQUcsSUFBSSwwQkFBeUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDeEUsTUFBTSxlQUFlLEdBQUcsSUFBSSxlQUFlLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3BELElBQUksTUFBTSxDQUFDO0lBQ1gsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1FBQ3JCLE1BQU0sZUFBZSxHQUFHLE1BQU0seUJBQXlCLENBQUMsc0JBQXNCLENBQUM7WUFDN0UsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO1NBQ2hDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDcEIsT0FBTyxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1NBQ3JEO1FBRUQsTUFBTSxHQUFHLE1BQU0sZUFBZSxDQUFDLGNBQWMsQ0FBQztZQUM1QyxNQUFNLEVBQUUsR0FBRyxDQUFDLElBQUssQ0FBQyxFQUFFO1lB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