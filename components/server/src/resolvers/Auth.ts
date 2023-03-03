import { Resolvers } from "../generated/graphql";
import {
  createPasswordResetNotification,
  sendNotifications,
  Notification,
  NotificationType
} from "../services/NotificationService";
import { getJoinedEntities } from "../services/UserService";
import { deleteUser, login, resetPassword, signup, updateUser } from "../services/UserService";

const AuthResolver: Resolvers = {
  Query: {
    getJoinedEntities: async (parent, args, context) => {
      return getJoinedEntities({
        context
      });
    }
  },
  Mutation: {
    login: async (parent, args, context) => {
      const auth = await login({ context, ...args });
      return auth;
    },
    resetPassword: async (parent, args, context) => {
      const user = await resetPassword({ context, ...args });
      const notificationDetails = createPasswordResetNotification({ user });
      const notification: Notification = {
        type: NotificationType.EMAIL,
        users: [user],
        content: notificationDetails
      };
      await sendNotifications({
        context,
        notifications: [notification]
      });
      return user;
    },
    signup: async (parent, args, context) => {
      const auth = await signup({ context, ...args });
      return auth;
    },
    deleteUser: async (parent, args, context) => {
      const user = await deleteUser({
        context
      });
      return user;
    },
    updateUser: async (parent, args, context) => {
      const user = await updateUser({
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

export default AuthResolver;
