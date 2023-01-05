"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GroupService_1 = require("../services/GroupService");
const GroupService_2 = require("../services/GroupService");
const GroupResolver = {
    Query: {
        getGroup: async (parent, args, context, info) => {
            return (0, GroupService_1.getGroup)({
                groupId: args.groupId,
                db: context.db
            });
        },
        getGroupForUser: async (parent, args, context, info) => {
            return (0, GroupService_2.getGroupForUser)({
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
            return (0, GroupService_1.inviteUsers)(Object.assign(Object.assign({}, args), { db: context.db }));
        },
        removeMembers: async (parent, args, context, info) => {
            const members = await (0, GroupService_1.removeMembers)(Object.assign(Object.assign({}, args), { db: context.db }));
            return members;
        },
        updateInvite: async (parent, args, context, info) => {
            const groupMember = await (0, GroupService_1.updateInvite)(Object.assign(Object.assign({}, args), { userId: context.user.id, db: context.db }));
            return groupMember;
        },
        updateGroupMember: async (parent, args, context, info) => {
            const groupMember = await (0, GroupService_2.updateGroupMember)(Object.assign(Object.assign({}, args), { db: context.db }));
            return groupMember;
        }
    }
};
exports.default = GroupResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVzb2x2ZXJzL0dyb3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsMkRBU2tDO0FBQ2xDLDJEQUE4RTtBQUc5RSxNQUFNLGFBQWEsR0FBRztJQUNwQixLQUFLLEVBQUU7UUFDTCxRQUFRLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBZ0IsRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUN2RCxPQUFPLElBQUEsdUJBQVEsRUFBQztnQkFDZCxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87Z0JBQ3JCLEVBQUUsRUFBRSxPQUFPLENBQUMsRUFBRTthQUNmLENBQUMsQ0FBQztRQUNMLENBQUM7UUFDRCxlQUFlLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBZ0IsRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUM5RCxPQUFPLElBQUEsOEJBQWUsRUFBQztnQkFDckIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDdkIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO2dCQUNyQixFQUFFLEVBQUUsT0FBTyxDQUFDLEVBQUU7YUFDZixDQUFDLENBQUM7UUFDTCxDQUFDO0tBQ0Y7SUFDRCxRQUFRLEVBQUU7UUFDUixXQUFXLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBa0IsRUFBRTtZQUNqRSxNQUFNLEtBQUssR0FBRyxNQUFNLElBQUEsMEJBQVcsa0NBQzFCLElBQUksS0FDUCxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQ3ZCLEVBQUUsRUFBRSxPQUFPLENBQUMsRUFBRSxJQUNkLENBQUM7WUFDSCxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUM7UUFDRCxXQUFXLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBa0IsRUFBRTtZQUNqRSxNQUFNLEtBQUssR0FBRyxNQUFNLElBQUEsMEJBQVcsa0NBQzFCLElBQUksS0FDUCxFQUFFLEVBQUUsT0FBTyxDQUFDLEVBQUUsSUFDZCxDQUFDO1lBQ0gsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO1FBQ0QsOEJBQThCLEVBQUUsS0FBSyxFQUNuQyxNQUFNLEVBQ04sSUFBSSxFQUNKLE9BQU8sRUFDUCxJQUFJLEVBQytCLEVBQUU7WUFDckMsTUFBTSx3QkFBd0IsR0FBRyxNQUFNLElBQUEsNkNBQThCLGtDQUNoRSxJQUFJLEtBQ1AsRUFBRSxFQUFFLE9BQU8sQ0FBQyxFQUFFLElBQ2QsQ0FBQztZQUNILE9BQU8sd0JBQXdCLENBQUM7UUFDbEMsQ0FBQztRQUNELFdBQVcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDakQsT0FBTyxJQUFBLDBCQUFXLGtDQUNiLElBQUksS0FDUCxFQUFFLEVBQUUsT0FBTyxDQUFDLEVBQUUsSUFDZCxDQUFDO1FBQ0wsQ0FBQztRQUNELGFBQWEsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDbkQsTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFBLDRCQUFhLGtDQUM5QixJQUFJLEtBQ1AsRUFBRSxFQUFFLE9BQU8sQ0FBQyxFQUFFLElBQ2QsQ0FBQztZQUNILE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUM7UUFDRCxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQ2xELE1BQU0sV0FBVyxHQUFHLE1BQU0sSUFBQSwyQkFBWSxrQ0FDakMsSUFBSSxLQUNQLE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFDdkIsRUFBRSxFQUFFLE9BQU8sQ0FBQyxFQUFFLElBQ2QsQ0FBQztZQUNILE9BQU8sV0FBVyxDQUFDO1FBQ3JCLENBQUM7UUFDRCxpQkFBaUIsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDdkQsTUFBTSxXQUFXLEdBQUcsTUFBTSxJQUFBLGdDQUFpQixrQ0FDdEMsSUFBSSxLQUNQLEVBQUUsRUFBRSxPQUFPLENBQUMsRUFBRSxJQUNkLENBQUM7WUFDSCxPQUFPLFdBQVcsQ0FBQztRQUNyQixDQUFDO0tBQ0Y7Q0FDRixDQUFDO0FBRUYsa0JBQWUsYUFBYSxDQUFDIn0=