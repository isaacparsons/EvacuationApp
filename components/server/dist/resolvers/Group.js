"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const group_1 = __importDefault(require("../db/group"));
const GroupService_1 = require("../services/GroupService");
const GroupResolver = {
    Query: {
        getGroup: async (parent, args, context) => {
            const groupRepository = new group_1.default(context.db);
            const { groupId } = args;
            const group = await groupRepository.getGroupById({ groupId: args.groupId });
            if (!group) {
                throw new Error(`Group does not exist with id: ${groupId}`);
            }
            return group;
        },
        getGroupForUser: async (parent, args, context) => {
            const groupRepository = new group_1.default(context.db);
            const { groupId } = args;
            const userId = context.user.id;
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
            const groupRepository = new group_1.default(context.db);
            const groupMembers = await groupRepository.getGroupMembers({
                groupId,
                cursor
            });
            return groupMembers;
        }
    },
    Mutation: {
        createGroup: async (parent, args, context) => {
            const { name, groupNotificationSetting, organizationId } = args;
            const groupRepository = new group_1.default(context.db);
            return groupRepository.createGroup({
                name,
                userId: context.user.id,
                groupNotificationSetting,
                organizationId
            });
        },
        deleteGroup: async (parent, args, context) => {
            const { groupId } = args;
            const groupRepository = new group_1.default(context.db);
            return groupRepository.deleteGroup({
                groupId
            });
        },
        updateGroupNotificationOptions: async (parent, args, context, info) => {
            const { groupId, groupNotificationSetting } = args;
            const groupRepository = new group_1.default(context.db);
            return groupRepository.updateGroupNotificationOptions({
                groupId,
                groupNotificationSetting
            });
        },
        addUsersToGroup: async (parent, args, context) => {
            const { users, groupId } = args;
            const groupRepository = new group_1.default(context.db);
            const group = await groupRepository.getGroupById({ groupId });
            if (!group) {
                throw new Error(`No group with id: ${groupId}`);
            }
            const { succeeded, failed } = await (0, GroupService_1.addUsersToGroup)({
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
            const groupRepository = new group_1.default(context.db);
            const { succeeded, failed } = await (0, GroupService_1.removeUsersFromGroup)({
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
            const groupRepository = new group_1.default(context.db);
            if (context.user.id === userId) {
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
exports.default = GroupResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVzb2x2ZXJzL0dyb3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBRUEsd0RBQTBDO0FBQzFDLDJEQUFpRjtBQUVqRixNQUFNLGFBQWEsR0FBYztJQUMvQixLQUFLLEVBQUU7UUFDTCxRQUFRLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUU7WUFDeEMsTUFBTSxlQUFlLEdBQUcsSUFBSSxlQUFlLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRXhELE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUM7WUFDekIsTUFBTSxLQUFLLEdBQUcsTUFBTSxlQUFlLENBQUMsWUFBWSxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBQzVFLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ1YsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsT0FBTyxFQUFFLENBQUMsQ0FBQzthQUM3RDtZQUNELE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUNELGVBQWUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsRUFBRTtZQUMvQyxNQUFNLGVBQWUsR0FBRyxJQUFJLGVBQWUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDeEQsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQztZQUV6QixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsSUFBSyxDQUFDLEVBQUUsQ0FBQztZQUNoQyxNQUFNLEtBQUssR0FBRyxNQUFNLGVBQWUsQ0FBQyxlQUFlLENBQUM7Z0JBQ2xELE1BQU07Z0JBQ04sT0FBTzthQUNSLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ1YsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFB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