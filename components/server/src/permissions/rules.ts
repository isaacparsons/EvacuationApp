import { and, not, or, race, rule } from "graphql-shield";
import { getGroupMemberFromEvacuationId } from "./utils/getGroupMemberFromEvacuationId";
import { getGroupMemberFromGroupId } from "./utils/getGroupMemberFromGroupId";
import { getOrgMemberFromAnnouncementId } from "./utils/getOrgMemberFromAnnouncementId";
import { getOrgMemberFromEvacuationId } from "./utils/getOrgMemberFromEvacuationId";
import { getOrgMemberFromGroupId } from "./utils/getOrgMemberFromGroupId";
import { getOrgMemberFromOrgId } from "./utils/getOrgMemberFromOrgId";
import { Context } from "../server";

export const isAuthenticated = rule()(async (parent, args, ctx: Context, info) => {
  if (!ctx.user) {
    return new Error("Missing access token");
  }
  return true;
});

export const isGroupAdmin = rule()(async (parent, args, ctx: Context, info) => {
  let member;
  if (args.evacuationId) {
    member = await getGroupMemberFromEvacuationId(ctx.db, ctx.user!.id, args.evacuationId);
  }

  if (args.groupId) {
    member = await getGroupMemberFromGroupId(ctx.db, ctx.user!.id, args.groupId);
  }
  if (member?.admin) {
    return true;
  }

  return false;
});

export const isOrgAdmin = rule()(async (parent, args, ctx: Context, info) => {
  let member;
  if (args.announcementId) {
    member = await getOrgMemberFromAnnouncementId(ctx.db, ctx.user!.id, args.announcementId);
  }
  if (args.evacuationId) {
    member = await getOrgMemberFromEvacuationId(ctx.db, ctx.user!.id, args.evacuationId);
  }
  if (args.groupId) {
    member = await getOrgMemberFromGroupId(ctx.db, ctx.user!.id, args.groupId);
  }
  if (args.organizationId) {
    member = await getOrgMemberFromOrgId(ctx.db, ctx.user!.id, args.organizationId);
  }
  if (member?.admin) {
    return true;
  }
  return false;
});
