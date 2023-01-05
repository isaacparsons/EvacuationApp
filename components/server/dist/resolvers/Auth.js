"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NotificationService_1 = require("../services/NotificationService");
const UserService_1 = require("../services/UserService");
const UserService_2 = require("../services/UserService");
const AuthResolver = {
    Query: {
        getJoinedEntities: async (parent, args, context, info) => {
            return (0, UserService_1.getJoinedEntities)({
                db: context.db,
                userId: context.user.id
            });
        }
    },
    Mutation: {
        login: async (parent, args, context) => {
            const auth = await (0, UserService_2.login)(Object.assign({ db: context.db }, args));
            return auth;
        },
        resetPassword: async (parent, args, context) => {
            const user = await (0, UserService_2.resetPassword)(Object.assign({ db: context.db }, args));
            await (0, NotificationService_1.sendPasswordResetNotification)(user);
            return user;
        },
        signup: async (parent, args, context, info) => {
            const auth = await (0, UserService_2.signup)(Object.assign({ db: context.db }, args));
            return auth;
        },
        deleteUser: async (parent, args, context, info) => {
            const user = await (0, UserService_2.deleteUser)({
                db: context.db,
                email: context.user.email
            });
            return user;
        },
        updateUser: async (parent, args, context, info) => {
            const user = await (0, UserService_2.updateUser)(Object.assign({ user: context.user, db: context.db }, args));
            return user;
        }
    }
};
exports.default = AuthResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXV0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXNvbHZlcnMvQXV0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlFQUFnRjtBQUNoRix5REFBNEQ7QUFDNUQseURBTWlDO0FBR2pDLE1BQU0sWUFBWSxHQUFHO0lBQ25CLEtBQUssRUFBRTtRQUNMLGlCQUFpQixFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQWdCLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDaEUsT0FBTyxJQUFBLCtCQUFpQixFQUFDO2dCQUN2QixFQUFFLEVBQUUsT0FBTyxDQUFDLEVBQUU7Z0JBQ2QsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTthQUN4QixDQUFDLENBQUM7UUFDTCxDQUFDO0tBQ0Y7SUFDRCxRQUFRLEVBQUU7UUFDUixLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUU7WUFDckMsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFBLG1CQUFLLGtCQUFHLEVBQUUsRUFBRSxPQUFPLENBQUMsRUFBRSxJQUFLLElBQUksRUFBRyxDQUFDO1lBQ3RELE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUNELGFBQWEsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsRUFBRTtZQUM3QyxNQUFNLElBQUksR0FBRyxNQUFNLElBQUEsMkJBQWEsa0JBQUcsRUFBRSxFQUFFLE9BQU8sQ0FBQyxFQUFFLElBQUssSUFBSSxFQUFHLENBQUM7WUFDOUQsTUFBTSxJQUFBLG1EQUE2QixFQUFDLElBQUksQ0FBQyxDQUFDO1lBQzFDLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUNELE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDNUMsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFBLG9CQUFNLGtCQUFHLEVBQUUsRUFBRSxPQUFPLENBQUMsRUFBRSxJQUFLLElBQUksRUFBRyxDQUFDO1lBQ3ZELE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUNELFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDaEQsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFBLHdCQUFVLEVBQUM7Z0JBQzVCLEVBQUUsRUFBRSxPQUFPLENBQUMsRUFBRTtnQkFDZCxLQUFLLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLO2FBQzFCLENBQUMsQ0FBQztZQUNILE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUNELFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDaEQsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFBLHdCQUFVLGtCQUMzQixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksRUFDbEIsRUFBRSxFQUFFLE9BQU8sQ0FBQyxFQUFFLElBQ1gsSUFBSSxFQUNQLENBQUM7WUFDSCxPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7S0FDRjtDQUNGLENBQUM7QUFFRixrQkFBZSxZQUFZLENBQUMifQ==