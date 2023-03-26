import { rule } from "graphql-shield";
import { Context } from "../context";

import EvacuationEventRepository from "../db/evacuationEvents";
import GroupRepository from "../db/group";
import OrganizationRepository from "../db/organization";

export const isAuthenticated = rule()(async (parent, args, ctx: Context) => {
  if (!ctx.user) {
    return new Error("Missing access token");
  }
  return true;
});

export const isGroupAdmin = rule()(async (parent, args, ctx: Context) => {
  const evacuationEventRepository = new EvacuationEventRepository(ctx.db);
  const groupRepository = new GroupRepository(ctx.db);
  let member;
  if (args.evacuationId) {
    const evacuationEvent = await evacuationEventRepository.getEvacuationEventById({
      evacuationId: args.evacuationId
    });
    if (!evacuationEvent) {
      return new Error("Evacuation event does not exist");
    }

    member = await groupRepository.getGroupMember({
      userId: ctx.user!.id,
      groupId: evacuationEvent.groupId
    });
  }

  if (args.groupId) {
    member = await groupRepository.getGroupMember({
      userId: ctx.user!.id,
      groupId: args.groupId
    });
  }
  if (member?.admin) {
    return true;
  }

  return false;
});

export const isOrgAdmin = rule()(async (parent, args, ctx: Context) => {
  const evacuationEventRepository = new EvacuationEventRepository(ctx.db);
  const organizationRepository = new OrganizationRepository(ctx.db);
  const groupRepository = new GroupRepository(ctx.db);
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
      userId: ctx.user!.id
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
      userId: ctx.user!.id
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
      userId: ctx.user!.id
    });
  }
  if (args.organizationId) {
    member = await organizationRepository.getOrganizationMember({
      organizationId: args.organizationId,
      userId: ctx.user!.id
    });
  }
  if (member?.admin) {
    return true;
  }
  return false;
});
