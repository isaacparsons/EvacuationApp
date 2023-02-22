"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GroupService_1 = require("../services/GroupService");
const GroupService_2 = require("../services/GroupService");
const GroupResolver = {
    Query: {
        getGroup: async (parent, args, context, info) => {
            return (0, GroupService_1.getGroup)({
                groupId: args.groupId,
                context
            });
        },
        getGroupForUser: async (parent, args, context, info) => {
            return (0, GroupService_2.getGroupForUser)({
                groupId: args.groupId,
                context
            });
        },
        getGroupMembers: async (parent, args, context, info) => {
            return (0, GroupService_2.getGroupMembers)({
                groupId: args.groupId,
                cursor: args.cursor,
                context
            });
        }
    },
    Mutation: {
        createGroup: async (parent, args, context, info) => {
            const group = await (0, GroupService_1.createGroup)(Object.assign(Object.assign({}, args), { context }));
            return group;
        },
        deleteGroup: async (parent, args, context, info) => {
            const group = await (0, GroupService_1.deleteGroup)(Object.assign(Object.assign({}, args), { context }));
            return group;
        },
        updateGroupNotificationOptions: async (parent, args, context, info) => {
            const groupNotificationSetting = await (0, GroupService_1.updateGroupNotificationOptions)(Object.assign(Object.assign({}, args), { context }));
            return groupNotificationSetting;
        },
        addUsersToGroup: async (parent, args, context, info) => {
            return (0, GroupService_1.addUsersToGroup)({
                groupId: args.groupId,
                users: args.users,
                context
            });
        },
        removeMembers: async (parent, args, context, info) => {
            const { succeeded, failed } = await (0, GroupService_1.removeMembers)({
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
            const groupMember = await (0, GroupService_2.updateGroupMember)(Object.assign(Object.assign({}, args), { context }));
            return groupMember;
        }
    }
};
exports.default = GroupResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVzb2x2ZXJzL0dyb3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsMkRBT2tDO0FBQ2xDLDJEQUErRjtBQUkvRixNQUFNLGFBQWEsR0FBYztJQUMvQixLQUFLLEVBQUU7UUFDTCxRQUFRLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQzlDLE9BQU8sSUFBQSx1QkFBUSxFQUFDO2dCQUNkLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztnQkFDckIsT0FBTzthQUNSLENBQUMsQ0FBQztRQUNMLENBQUM7UUFDRCxlQUFlLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQ3JELE9BQU8sSUFBQSw4QkFBZSxFQUFDO2dCQUNyQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87Z0JBQ3JCLE9BQU87YUFDUixDQUFDLENBQUM7UUFDTCxDQUFDO1FBQ0QsZUFBZSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUNyRCxPQUFPLElBQUEsOEJBQWUsRUFBQztnQkFDckIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO2dCQUNyQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU87Z0JBQ3BCLE9BQU87YUFDUixDQUFDLENBQUM7UUFDTCxDQUFDO0tBQ0Y7SUFDRCxRQUFRLEVBQUU7UUFDUixXQUFXLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBa0IsRUFBRTtZQUNqRSxNQUFNLEtBQUssR0FBRyxNQUFNLElBQUEsMEJBQVcsa0NBQzFCLElBQUksS0FDUCxPQUFPLElBQ1AsQ0FBQztZQUNILE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUNELFdBQVcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFrQixFQUFFO1lBQ2pFLE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBQSwwQkFBVyxrQ0FDMUIsSUFBSSxLQUNQLE9BQU8sSUFDUCxDQUFDO1lBQ0gsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO1FBQ0QsOEJBQThCLEVBQUUsS0FBSyxFQUNuQyxNQUFNLEVBQ04sSUFBSSxFQUNKLE9BQU8sRUFDUCxJQUFJLEVBQytCLEVBQUU7WUFDckMsTUFBTSx3QkFBd0IsR0FBRyxNQUFNLElBQUEsNkNBQThCLGtDQUNoRSxJQUFJLEtBQ1AsT0FBTyxJQUNQLENBQUM7WUFDSCxPQUFPLHdCQUF3QixDQUFDO1FBQ2xDLENBQUM7UUFDRCxlQUFlLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQ3JELE9BQU8sSUFBQSw4QkFBZSxFQUFDO2dCQUNyQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87Z0JBQ3JCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBTTtnQkFDbEIsT0FBTzthQUNSLENBQUMsQ0FBQztRQUNMLENBQUM7UUFDRCxhQUFhLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQ25ELE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLEdBQUcsTUFBTSxJQUFBLDRCQUFhLEVBQUM7Z0JBQ2hELE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztnQkFDckIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO2dCQUNyQixPQUFPO2FBQ1IsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDckIsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO2FBQ3ZEO1lBQ0QsT0FBTyxTQUFTLENBQUM7UUFDbkIsQ0FBQztRQUNELGlCQUFpQixFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUN2RCxNQUFNLFdBQVcsR0FBRyxNQUFNLElBQUEsZ0NBQWlCLGtDQUN0QyxJQUFJLEtBQ1AsT0FBTyxJQUNQLENBQUM7WUFDSCxPQUFPLFdBQVcsQ0FBQztRQUNyQixDQUFDO0tBQ0Y7Q0FDRixDQUFDO0FBRUYsa0JBQWUsYUFBYSxDQUFDIn0=