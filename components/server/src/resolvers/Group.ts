import { Group } from "@prisma/client";
import {
  addUsersToGroup,
  createGroup,
  deleteGroup,
  getGroup,
  removeMembers,
  updateGroupNotificationOptions
} from "../services/GroupService";
import { getGroupForUser, getGroupMembers, updateGroupMember } from "../services/GroupService";

import { GroupNotificationSetting, Resolvers } from "../generated/graphql";

const GroupResolver: Resolvers = {
  Query: {
    getGroup: async (parent, args, context, info) => {
      return getGroup({
        groupId: args.groupId,
        context
      });
    },
    getGroupForUser: async (parent, args, context, info) => {
      return getGroupForUser({
        groupId: args.groupId,
        context
      });
    },
    getGroupMembers: async (parent, args, context, info) => {
      return getGroupMembers({
        groupId: args.groupId,
        cursor: args.cursor!,
        context
      });
    }
  },
  Mutation: {
    createGroup: async (parent, args, context, info): Promise<Group> => {
      const group = await createGroup({
        ...args,
        context
      });
      return group;
    },
    deleteGroup: async (parent, args, context, info): Promise<Group> => {
      const group = await deleteGroup({
        ...args,
        context
      });
      return group;
    },
    updateGroupNotificationOptions: async (
      parent,
      args,
      context,
      info
    ): Promise<GroupNotificationSetting> => {
      const groupNotificationSetting = await updateGroupNotificationOptions({
        ...args,
        context
      });
      return groupNotificationSetting;
    },
    addUsersToGroup: async (parent, args, context, info) => {
      return addUsersToGroup({
        groupId: args.groupId,
        users: args.users!,
        context
      });
    },
    removeMembers: async (parent, args, context, info) => {
      const { succeeded, failed } = await removeMembers({
        groupId: args.groupId,
        userIds: args.userIds,
        context
      });
      if (failed.length > 0) {
        throw new Error("Failed to remove 1 or more members");
      }
      return succeeded;
    },
    updateGroupMember: async (parent, args, context, info) => {
      const groupMember = await updateGroupMember({
        ...args,
        context
      });
      return groupMember;
    }
  }
};

export default GroupResolver;
