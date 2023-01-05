"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOrgAdmin = exports.isGroupAdmin = exports.isAuthenticated = void 0;
const graphql_shield_1 = require("graphql-shield");
const getGroupMemberFromEvacuationId_1 = require("./utils/getGroupMemberFromEvacuationId");
const getGroupMemberFromGroupId_1 = require("./utils/getGroupMemberFromGroupId");
const getOrgMemberFromAnnouncementId_1 = require("./utils/getOrgMemberFromAnnouncementId");
const getOrgMemberFromEvacuationId_1 = require("./utils/getOrgMemberFromEvacuationId");
const getOrgMemberFromGroupId_1 = require("./utils/getOrgMemberFromGroupId");
const getOrgMemberFromOrgId_1 = require("./utils/getOrgMemberFromOrgId");
exports.isAuthenticated = (0, graphql_shield_1.rule)()(async (parent, args, ctx, info) => {
    if (!ctx.user) {
        return new Error("Missing access token");
    }
    return true;
});
exports.isGroupAdmin = (0, graphql_shield_1.rule)()(async (parent, args, ctx, info) => {
    let member;
    if (args.evacuationId) {
        member = await (0, getGroupMemberFromEvacuationId_1.getGroupMemberFromEvacuationId)(ctx.db, ctx.user.id, args.evacuationId);
    }
    if (args.groupId) {
        member = await (0, getGroupMemberFromGroupId_1.getGroupMemberFromGroupId)(ctx.db, ctx.user.id, args.groupId);
    }
    if (member === null || member === void 0 ? void 0 : member.admin) {
        return true;
    }
    return false;
});
exports.isOrgAdmin = (0, graphql_shield_1.rule)()(async (parent, args, ctx, info) => {
    let member;
    if (args.annoucementId) {
        member = await (0, getOrgMemberFromAnnouncementId_1.getOrgMemberFromAnnouncementId)(ctx.db, ctx.user.id, args.annoucementId);
    }
    if (args.evacuationId) {
        member = await (0, getOrgMemberFromEvacuationId_1.getOrgMemberFromEvacuationId)(ctx.db, ctx.user.id, args.evacuationId);
    }
    if (args.groupId) {
        member = await (0, getOrgMemberFromGroupId_1.getOrgMemberFromGroupId)(ctx.db, ctx.user.id, args.groupId);
    }
    if (args.organizationId) {
        member = await (0, getOrgMemberFromOrgId_1.getOrgMemberFromOrgId)(ctx.db, ctx.user.id, args.organizationId);
    }
    if (member === null || member === void 0 ? void 0 : member.admin) {
        return true;
    }
    return false;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVsZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGVybWlzc2lvbnMvcnVsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbURBQTBEO0FBRTFELDJGQUF3RjtBQUN4RixpRkFBOEU7QUFDOUUsMkZBQXdGO0FBQ3hGLHVGQUFvRjtBQUNwRiw2RUFBMEU7QUFDMUUseUVBQXNFO0FBRXpELFFBQUEsZUFBZSxHQUFHLElBQUEscUJBQUksR0FBRSxDQUNuQyxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFZLEVBQUUsSUFBSSxFQUFFLEVBQUU7SUFDekMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7UUFDYixPQUFPLElBQUksS0FBSyxDQUFDLHNCQUFzQixDQUFDLENBQUM7S0FDMUM7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMsQ0FDRixDQUFDO0FBRVcsUUFBQSxZQUFZLEdBQUcsSUFBQSxxQkFBSSxHQUFFLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBWSxFQUFFLElBQUksRUFBRSxFQUFFO0lBQzVFLElBQUksTUFBTSxDQUFDO0lBQ1gsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1FBQ3JCLE1BQU0sR0FBRyxNQUFNLElBQUEsK0RBQThCLEVBQzNDLEdBQUcsQ0FBQyxFQUFFLEVBQ04sR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQ1gsSUFBSSxDQUFDLFlBQVksQ0FDbEIsQ0FBQztLQUNIO0lBRUQsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1FBQ2hCLE1BQU0sR0FBRyxNQUFNLElBQUEscURBQXlCLEVBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDN0U7SUFDRCxJQUFJLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxLQUFLLEVBQUU7UUFDakIsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUVELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQyxDQUFDLENBQUM7QUFFVSxRQUFBLFVBQVUsR0FBRyxJQUFBLHFCQUFJLEdBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFZLEVBQUUsSUFBSSxFQUFFLEVBQUU7SUFDMUUsSUFBSSxNQUFNLENBQUM7SUFDWCxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7UUFDdEIsTUFBTSxHQUFHLE1BQU0sSUFBQSwrREFBOEIsRUFDM0MsR0FBRyxDQUFDLEVBQUUsRUFDTixHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFDWCxJQUFJLENBQUMsYUFBYSxDQUNuQixDQUFDO0tBQ0g7SUFDRCxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7UUFDckIsTUFBTSxHQUFHLE1BQU0sSUFBQSwyREFBNEIsRUFDekMsR0FBRyxDQUFDLEVBQUUsRUFDTixHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFDWCxJQUFJLENBQUMsWUFBWSxDQUNsQixDQUFDO0tBQ0g7SUFDRCxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7UUFDaEIsTUFBTSxHQUFHLE1BQU0sSUFBQSxpREFBdUIsRUFBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUMzRTtJQUNELElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtRQUN2QixNQUFNLEdBQUcsTUFBTSxJQUFBLDZDQUFxQixFQUNsQyxHQUFHLENBQUMsRUFBRSxFQUNOLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUNYLElBQUksQ0FBQyxjQUFjLENBQ3BCLENBQUM7S0FDSDtJQUNELElBQUksTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLEtBQUssRUFBRTtRQUNqQixPQUFPLElBQUksQ0FBQztLQUNiO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDLENBQUMsQ0FBQyJ9