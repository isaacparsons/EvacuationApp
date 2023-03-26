import { Group } from "@prisma/client";
import { GroupNotificationSetting, Resolvers } from "../generated/graphql";
import GroupRepository from "../db/group";
import { addUsersToGroup, removeUsersFromGroup } from "../services/GroupService";

const GroupResolver: Resolvers = {
  Query: {
    getGroup: async (parent, args, context) => {
      const groupRepository = new GroupRepository(context.db);

      const { groupId } = args;
      const group = await groupRepository.getGroupById({ groupId: args.groupId });
      if (!group) {
        throw new Error(`Group does not exist with id: ${groupId}`);
      }
      return group;
    },
    getGroupForUser: async (parent, args, context) => {
      const groupRepository = new GroupRepository(context.db);
      const { groupId } = args;

      const userId = context.user!.id;
      const group = await groupRepository.getGroupForUser({
        userId,
        groupId
      });

      if (!group) {
        throw new Error(`Group with id: ${groupId} does not exist`);
      }
      return group;
    },
    getGroupMembers: async (parent, args, context) => {
      const { groupId, cursor } = args;
      const groupRepository = new GroupRepository(context.db);
      const groupMembers = await groupRepository.getGroupMembers({
        groupId,
        cursor
      });
      return groupMembers;
    }
  },
  Mutation: {
    createGroup: async (parent, args, context): Promise<Group> => {
      const { name, groupNotificationSetting, organizationId } = args;
      const groupRepository = new GroupRepository(context.db);
      return groupRepository.createGroup({
        name,
        userId: context.user!.id,
        groupNotificationSetting,
        organizationId
      });
    },
    deleteGroup: async (parent, args, context): Promise<Group> => {
      const { groupId } = args;
      const groupRepository = new GroupRepository(context.db);
      return groupRepository.deleteGroup({
        groupId
      });
    },
    updateGroupNotificationOptions: async (
      parent,
      args,
      context,
      info
    ): Promise<GroupNotificationSetting> => {
      const { groupId, groupNotificationSetting } = args;

      const groupRepository = new GroupRepository(context.db);
      return groupRepository.updateGroupNotificationOptions({
        groupId,
        groupNotificationSetting
      });
    },
    addUsersToGroup: async (parent, args, context) => {
      const { users, groupId } = args;
      const groupRepository = new GroupRepository(context.db);

      const group = await groupRepository.getGroupById({ groupId });
      if (!group) {
        throw new Error(`No group with id: ${groupId}`);
      }
      const { succeeded, failed } = await addUsersToGroup({
        groupRepository,
        users,
        groupId,
        organizationId: group.organizationId,
        context
      });
      return succeeded;
    },
    removeMembers: async (parent, args, context) => {
      const { groupId, userIds } = args;
      const groupRepository = new GroupRepository(context.db);

      const { succeeded, failed } = await removeUsersFromGroup({
        groupRepository,
        groupId,
        userIds,
        context
      });
      if (failed.length > 0) {
        throw new Error("Failed to remove 1 or more members");
      }
      return succeeded;
    },
    updateGroupMember: async (parent, args, context) => {
      const { groupId, userId, admin } = args;
      const groupRepository = new GroupRepository(context.db);

      if (context.user!.id === userId) {
        throw new Error("Can't edit your own admin status");
      }
      const groupMember = await groupRepository.updateGroupMember({
        groupId,
        userId,
        admin
      });

      return groupMember;
    }
  }
};

export default GroupResolver;
