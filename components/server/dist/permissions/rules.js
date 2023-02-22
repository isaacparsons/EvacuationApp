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
    if (args.announcementId) {
        member = await (0, getOrgMemberFromAnnouncementId_1.getOrgMemberFromAnnouncementId)(ctx.db, ctx.user.id, args.announcementId);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVsZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGVybWlzc2lvbnMvcnVsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbURBQTBEO0FBQzFELDJGQUF3RjtBQUN4RixpRkFBOEU7QUFDOUUsMkZBQXdGO0FBQ3hGLHVGQUFvRjtBQUNwRiw2RUFBMEU7QUFDMUUseUVBQXNFO0FBR3pELFFBQUEsZUFBZSxHQUFHLElBQUEscUJBQUksR0FBRSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQVksRUFBRSxJQUFJLEVBQUUsRUFBRTtJQUMvRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRTtRQUNiLE9BQU8sSUFBSSxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQztLQUMxQztJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQyxDQUFDLENBQUM7QUFFVSxRQUFBLFlBQVksR0FBRyxJQUFBLHFCQUFJLEdBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFZLEVBQUUsSUFBSSxFQUFFLEVBQUU7SUFDNUUsSUFBSSxNQUFNLENBQUM7SUFDWCxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7UUFDckIsTUFBTSxHQUFHLE1BQU0sSUFBQSwrREFBOEIsRUFBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxJQUFLLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUN4RjtJQUVELElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtRQUNoQixNQUFNLEdBQUcsTUFBTSxJQUFBLHFEQUF5QixFQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLElBQUssQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQzlFO0lBQ0QsSUFBSSxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsS0FBSyxFQUFFO1FBQ2pCLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFFRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUMsQ0FBQyxDQUFDO0FBRVUsUUFBQSxVQUFVLEdBQUcsSUFBQSxxQkFBSSxHQUFFLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBWSxFQUFFLElBQUksRUFBRSxFQUFFO0lBQzFFLElBQUksTUFBTSxDQUFDO0lBQ1gsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO1FBQ3ZCLE1BQU0sR0FBRyxNQUFNLElBQUEsK0RBQThCLEVBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsSUFBSyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7S0FDMUY7SUFDRCxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7UUFDckIsTUFBTSxHQUFHLE1BQU0sSUFBQSwyREFBNEIsRUFBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxJQUFLLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUN0RjtJQUNELElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtRQUNoQixNQUFNLEdBQUcsTUFBTSxJQUFBLGlEQUF1QixFQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLElBQUssQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQzVFO0lBQ0QsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO1FBQ3ZCLE1BQU0sR0FBRyxNQUFNLElBQUEsNkNBQXFCLEVBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsSUFBSyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7S0FDakY7SUFDRCxJQUFJLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxLQUFLLEVBQUU7UUFDakIsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQyxDQUFDLENBQUMifQ==