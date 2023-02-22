import { sendPasswordResetNotification } from "../services/NotificationService";
import { getJoinedEntities } from "../services/UserService";
import { deleteUser, login, resetPassword, signup, updateUser } from "../services/UserService";
import { Resolvers } from "../generated/graphql";

const AuthResolver: Resolvers = {
  Query: {
    getJoinedEntities: async (parent, args, context, info) => {
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
      await sendPasswordResetNotification(user);
      return user;
    },
    signup: async (parent, args, context, info) => {
      const auth = await signup({ context, ...args });
      return auth;
    },
    deleteUser: async (parent, args, context, info) => {
      const user = await deleteUser({
        context
      });
      return user;
    },
    updateUser: async (parent, args, context, info) => {
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
