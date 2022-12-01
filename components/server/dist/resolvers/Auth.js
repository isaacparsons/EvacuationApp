"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserService_1 = require("../services/UserService");
const UserService_2 = require("../services/UserService");
const AuthResolver = {
    Query: {
        getJoinedEntities: async (parent, args, context, info) => {
            return await (0, UserService_1.getJoinedEntities)({
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
            const user = await (0, UserService_2.updateUser)(Object.assign({ user: context.user }, args));
            return user;
        }
    }
};
exports.default = AuthResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXV0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXNvbHZlcnMvQXV0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlEQUE0RDtBQUU1RCx5REFNaUM7QUFFakMsTUFBTSxZQUFZLEdBQUc7SUFDbkIsS0FBSyxFQUFFO1FBQ0wsaUJBQWlCLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBZ0IsRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUNoRSxPQUFPLE1BQU0sSUFBQSwrQkFBaUIsRUFBQztnQkFDN0IsRUFBRSxFQUFFLE9BQU8sQ0FBQyxFQUFFO2dCQUNkLE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7YUFDeEIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztLQUNGO0lBQ0QsUUFBUSxFQUFFO1FBQ1IsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFO1lBQ3JDLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBQSxtQkFBSyxrQkFBRyxFQUFFLEVBQUUsT0FBTyxDQUFDLEVBQUUsSUFBSyxJQUFJLEVBQUcsQ0FBQztZQUN0RCxPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFDRCxhQUFhLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUU7WUFDN0MsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFBLDJCQUFhLGtCQUFHLEVBQUUsRUFBRSxPQUFPLENBQUMsRUFBRSxJQUFLLElBQUksRUFBRyxDQUFDO1lBQzlELE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUNELE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDNUMsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFBLG9CQUFNLGtCQUFHLEVBQUUsRUFBRSxPQUFPLENBQUMsRUFBRSxJQUFLLElBQUksRUFBRyxDQUFDO1lBQ3ZELE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUNELFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDaEQsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFBLHdCQUFVLEVBQUM7Z0JBQzVCLEVBQUUsRUFBRSxPQUFPLENBQUMsRUFBRTtnQkFDZCxLQUFLLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLO2FBQzFCLENBQUMsQ0FBQztZQUNILE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUNELFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDaEQsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFBLHdCQUFVLGtCQUMzQixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksSUFDZixJQUFJLEVBQ1AsQ0FBQztZQUNILE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztLQUNGO0NBQ0YsQ0FBQztBQUVGLGtCQUFlLFlBQVksQ0FBQyJ9