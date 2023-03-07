"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NotificationService_1 = require("../services/NotificationService");
const UserService_1 = require("../services/UserService");
const UserService_2 = require("../services/UserService");
const AuthResolver = {
    Query: {
        getJoinedEntities: async (parent, args, context) => {
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
            const notificationDetails = (0, NotificationService_1.createPasswordResetNotification)({ user });
            const notification = {
                type: NotificationService_1.NotificationType.EMAIL,
                users: [user],
                content: notificationDetails
            };
            await (0, NotificationService_1.sendNotifications)({
                context,
                notifications: [notification]
            });
            return user;
        },
        signup: async (parent, args, context) => {
            const auth = await (0, UserService_2.signup)(Object.assign({ context }, args));
            return auth;
        },
        deleteUser: async (parent, args, context) => {
            const user = await (0, UserService_2.deleteUser)({
                context
            });
            return user;
        },
        updateUser: async (parent, args, context) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXV0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXNvbHZlcnMvQXV0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHlFQUt5QztBQUN6Qyx5REFBNEQ7QUFDNUQseURBQStGO0FBRS9GLE1BQU0sWUFBWSxHQUFjO0lBQzlCLEtBQUssRUFBRTtRQUNMLGlCQUFpQixFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFO1lBQ2pELE9BQU8sSUFBQSwrQkFBaUIsRUFBQztnQkFDdkIsT0FBTzthQUNSLENBQUMsQ0FBQztRQUNMLENBQUM7S0FDRjtJQUNELFFBQVEsRUFBRTtRQUNSLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsRUFBRTtZQUNyQyxNQUFNLElBQUksR0FBRyxNQUFNLElBQUEsbUJBQUssa0JBQUcsT0FBTyxJQUFLLElBQUksRUFBRyxDQUFDO1lBQy9DLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUNELGFBQWEsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsRUFBRTtZQUM3QyxNQUFNLElBQUksR0FBRyxNQUFNLElBQUEsMkJBQWEsa0JBQUcsT0FBTyxJQUFLLElBQUksRUFBRyxDQUFDO1lBQ3ZELE1BQU0sbUJBQW1CLEdBQUcsSUFBQSxxREFBK0IsRUFBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7WUFDdEUsTUFBTSxZQUFZLEdBQWlCO2dCQUNqQyxJQUFJLEVBQUUsc0NBQWdCLENBQUMsS0FBSztnQkFDNUIsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDO2dCQUNiLE9BQU8sRUFBRSxtQkFBbUI7YUFDN0IsQ0FBQztZQUNGLE1BQU0sSUFBQSx1Q0FBaUIsRUFBQztnQkFDdEIsT0FBTztnQkFDUCxhQUFhLEVBQUUsQ0FBQyxZQUFZLENBQUM7YUFDOUIsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBQ0QsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFO1lBQ3RDLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBQSxvQkFBTSxrQkFBRyxPQUFPLElBQUssSUFBSSxFQUFHLENBQUM7WUFDaEQsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBQ0QsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFO1lBQzFDLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBQSx3QkFBVSxFQUFDO2dCQUM1QixPQUFPO2FBQ1IsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBQ0QsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFO1lBQzFDLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBQSx3QkFBVSxFQUFDO2dCQUM1QixPQUFPO2dCQUNQLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVztnQkFDN0IsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO2dCQUN2QixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7Z0JBQ3pCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTthQUN4QixDQUFDLENBQUM7WUFDSCxPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7S0FDRjtDQUNGLENBQUM7QUFFRixrQkFBZSxZQUFZLENBQUMifQ==