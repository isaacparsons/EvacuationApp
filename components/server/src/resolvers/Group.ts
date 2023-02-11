import { Group } from "@prisma/client";
import {
  addUsersToGroup,
  createGroup,
  // getGroupMembers,
  deleteGroup,
  getGroup,
  removeMembers,
  updateGroupNotificationOptions
} from "../services/GroupService";
import {
  getGroupForUser,
  updateGroupMember,
  getGroupMembers
} from "../services/GroupService";
import { Context, GroupNotificationSetting } from "../types";

const GroupResolver = {
  Query: {
    getGroup: async (parent, args, context: Context, info) => {
      return getGroup({
        groupId: args.groupId,
        db: context.db
      });
    },
    getGroupForUser: async (parent, args, context: Context, info) => {
      return getGroupForUser({
        userId: context.user.id,
        groupId: args.groupId,
        db: context.db
      });
    },
    getGroupMembers: async (parent, args, context: Context, info) => {
      return getGroupMembers({
        ...args,
        db: context.db
      });
    }
  },
  Mutation: {
    createGroup: async (parent, args, context, info): Promise<Group> => {
      const group = await createGroup({
        ...args,
        userId: context.user.id,
        db: context.db
      });
      return group;
    },
    deleteGroup: async (parent, args, context, info): Promise<Group> => {
      const group = await deleteGroup({
        ...args,
        db: context.db
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
        db: context.db
      });
      return groupNotificationSetting;
    },
    addUsersToGroup: async (parent, args, context, info) => {
      return addUsersToGroup({
        ...args,
        db: context.db
      });
    },
    removeMembers: async (parent, args, context, info) => {
      const members = await removeMembers({
        ...args,
        db: context.db
      });
      return members;
    },
    updateGroupMember: async (parent, args, context, info) => {
      const groupMember = await updateGroupMember({
        ...args,
        editorId: context.user.id,
        db: context.db
      });
      return groupMember;
    }
  }
};

export default GroupResolver;
