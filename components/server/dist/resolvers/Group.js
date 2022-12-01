"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GroupService_1 = require("../services/GroupService");
const GroupService_2 = require("../services/GroupService");
const GroupResolver = {
    Query: {
        getGroup: async (parent, args, context, info) => {
            return await (0, GroupService_1.getGroup)({
                groupId: args.groupId,
                db: context.db
            });
        },
        getGroupForUser: async (parent, args, context, info) => {
            return await (0, GroupService_2.getGroupForUser)({
                userId: context.user.id,
                groupId: args.groupId,
                db: context.db
            });
        }
    },
    Mutation: {
        createGroup: async (parent, args, context, info) => {
            const group = await (0, GroupService_1.createGroup)(Object.assign(Object.assign({}, args), { userId: context.user.id, db: context.db }));
            return group;
        },
        deleteGroup: async (parent, args, context, info) => {
            const group = await (0, GroupService_1.deleteGroup)(Object.assign(Object.assign({}, args), { db: context.db }));
            return group;
        },
        updateGroupNotificationOptions: async (parent, args, context, info) => {
            const groupNotificationSetting = await (0, GroupService_1.updateGroupNotificationOptions)(Object.assign(Object.assign({}, args), { db: context.db }));
            return groupNotificationSetting;
        },
        inviteUsers: async (parent, args, context, info) => {
            return await (0, GroupService_1.inviteUsers)(Object.assign(Object.assign({}, args), { db: context.db }));
        },
        removeMembers: async (parent, args, context, info) => {
            const members = await (0, GroupService_1.removeMembers)(Object.assign(Object.assign({}, args), { db: context.db }));
            return members;
        },
        updateInvite: async (parent, args, context, info) => {
            const groupMember = await (0, GroupService_1.updateInvite)(Object.assign(Object.assign({}, args), { userId: context.user.id, db: context.db }));
            return groupMember;
        }
    }
};
exports.default = GroupResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVzb2x2ZXJzL0dyb3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsMkRBU2tDO0FBRWxDLDJEQUEyRDtBQUUzRCxNQUFNLGFBQWEsR0FBRztJQUNwQixLQUFLLEVBQUU7UUFDTCxRQUFRLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBZ0IsRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUN2RCxPQUFPLE1BQU0sSUFBQSx1QkFBUSxFQUFDO2dCQUNwQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87Z0JBQ3JCLEVBQUUsRUFBRSxPQUFPLENBQUMsRUFBRTthQUNmLENBQUMsQ0FBQztRQUNMLENBQUM7UUFDRCxlQUFlLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBZ0IsRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUM5RCxPQUFPLE1BQU0sSUFBQSw4QkFBZSxFQUFDO2dCQUMzQixNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN2QixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87Z0JBQ3JCLEVBQUUsRUFBRSxPQUFPLENBQUMsRUFBRTthQUNmLENBQUMsQ0FBQztRQUNMLENBQUM7S0FDRjtJQUNELFFBQVEsRUFBRTtRQUNSLFdBQVcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFrQixFQUFFO1lBQ2pFLE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBQSwwQkFBVyxrQ0FDMUIsSUFBSSxLQUNQLE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFDdkIsRUFBRSxFQUFFLE9BQU8sQ0FBQyxFQUFFLElBQ2QsQ0FBQztZQUNILE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUNELFdBQVcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFrQixFQUFFO1lBQ2pFLE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBQSwwQkFBVyxrQ0FDMUIsSUFBSSxLQUNQLEVBQUUsRUFBRSxPQUFPLENBQUMsRUFBRSxJQUNkLENBQUM7WUFDSCxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUM7UUFDRCw4QkFBOEIsRUFBRSxLQUFLLEVBQ25DLE1BQU0sRUFDTixJQUFJLEVBQ0osT0FBTyxFQUNQLElBQUksRUFDK0IsRUFBRTtZQUNyQyxNQUFNLHdCQUF3QixHQUFHLE1BQU0sSUFBQSw2Q0FBOEIsa0NBQ2hFLElBQUksS0FDUCxFQUFFLEVBQUUsT0FBTyxDQUFDLEVBQUUsSUFDZCxDQUFDO1lBQ0gsT0FBTyx3QkFBd0IsQ0FBQztRQUNsQyxDQUFDO1FBQ0QsV0FBVyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUNqRCxPQUFPLE1BQU0sSUFBQSwwQkFBVyxrQ0FDbkIsSUFBSSxLQUNQLEVBQUUsRUFBRSxPQUFPLENBQUMsRUFBRSxJQUNkLENBQUM7UUFDTCxDQUFDO1FBQ0QsYUFBYSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUNuRCxNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUEsNEJBQWEsa0NBQzlCLElBQUksS0FDUCxFQUFFLEVBQUUsT0FBTyxDQUFDLEVBQUUsSUFDZCxDQUFDO1lBQ0gsT0FBTyxPQUFPLENBQUM7UUFDakIsQ0FBQztRQUNELFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDbEQsTUFBTSxXQUFXLEdBQUcsTUFBTSxJQUFBLDJCQUFZLGtDQUNqQyxJQUFJLEtBQ1AsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUN2QixFQUFFLEVBQUUsT0FBTyxDQUFDLEVBQUUsSUFDZCxDQUFDO1lBQ0gsT0FBTyxXQUFXLENBQUM7UUFDckIsQ0FBQztLQUNGO0NBQ0YsQ0FBQztBQUVGLGtCQUFlLGFBQWEsQ0FBQyJ9