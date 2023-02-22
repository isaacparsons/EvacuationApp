"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NotificationService_1 = require("../services/NotificationService");
const UserService_1 = require("../services/UserService");
const UserService_2 = require("../services/UserService");
const AuthResolver = {
    Query: {
        getJoinedEntities: async (parent, args, context, info) => {
            return (0, UserService_1.getJoinedEntities)({
                context
            });
        }
    },
    Mutation: {
        login: async (parent, args, context) => {
            const auth = await (0, UserService_2.login)(Object.assign({ context }, args));
            return auth;
        },
        resetPassword: async (parent, args, context) => {
            const user = await (0, UserService_2.resetPassword)(Object.assign({ context }, args));
            await (0, NotificationService_1.sendPasswordResetNotification)(user);
            return user;
        },
        signup: async (parent, args, context, info) => {
            const auth = await (0, UserService_2.signup)(Object.assign({ context }, args));
            return auth;
        },
        deleteUser: async (parent, args, context, info) => {
            const user = await (0, UserService_2.deleteUser)({
                context
            });
            return user;
        },
        updateUser: async (parent, args, context, info) => {
            const user = await (0, UserService_2.updateUser)({
                context,
                phoneNumber: args.phoneNumber,
                password: args.password,
                firstName: args.firstName,
                lastName: args.lastName
            });
            return user;
        }
    }
};
exports.default = AuthResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXV0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXNvbHZlcnMvQXV0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlFQUFnRjtBQUNoRix5REFBNEQ7QUFDNUQseURBQStGO0FBRy9GLE1BQU0sWUFBWSxHQUFjO0lBQzlCLEtBQUssRUFBRTtRQUNMLGlCQUFpQixFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUN2RCxPQUFPLElBQUEsK0JBQWlCLEVBQUM7Z0JBQ3ZCLE9BQU87YUFDUixDQUFDLENBQUM7UUFDTCxDQUFDO0tBQ0Y7SUFDRCxRQUFRLEVBQUU7UUFDUixLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUU7WUFDckMsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFBLG1CQUFLLGtCQUFHLE9BQU8sSUFBSyxJQUFJLEVBQUcsQ0FBQztZQUMvQyxPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFDRCxhQUFhLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUU7WUFDN0MsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFBLDJCQUFhLGtCQUFHLE9BQU8sSUFBSyxJQUFJLEVBQUcsQ0FBQztZQUN2RCxNQUFNLElBQUEsbURBQTZCLEVBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUMsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBQ0QsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUM1QyxNQUFNLElBQUksR0FBRyxNQUFNLElBQUEsb0JBQU0sa0JBQUcsT0FBTyxJQUFLLElBQUksRUFBRyxDQUFDO1lBQ2hELE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUNELFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDaEQsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFBLHdCQUFVLEVBQUM7Z0JBQzVCLE9BQU87YUFDUixDQUFDLENBQUM7WUFDSCxPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFDRCxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQ2hELE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBQSx3QkFBVSxFQUFDO2dCQUM1QixPQUFPO2dCQUNQLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVztnQkFDN0IsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO2dCQUN2QixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7Z0JBQ3pCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTthQUN4QixDQUFDLENBQUM7WUFDSCxPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7S0FDRjtDQUNGLENBQUM7QUFFRixrQkFBZSxZQUFZLENBQUMifQ==