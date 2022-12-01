import { sendPasswordResetNotification } from "../services/NotificationService";
import { getJoinedEntities } from "../services/UserService";
import {
  deleteUser,
  login,
  resetPassword,
  signup,
  updateUser
} from "../services/UserService";
import { Context } from "../types";

const AuthResolver = {
  Query: {
    getJoinedEntities: async (parent, args, context: Context, info) => {
      return getJoinedEntities({
        db: context.db,
        userId: context.user.id
      });
    }
  },
  Mutation: {
    login: async (parent, args, context) => {
      const auth = await login({ db: context.db, ...args });
      return auth;
    },
    resetPassword: async (parent, args, context) => {
      const user = await resetPassword({ db: context.db, ...args });
      await sendPasswordResetNotification(user);
      return user;
    },
    signup: async (parent, args, context, info) => {
      const auth = await signup({ db: context.db, ...args });
      return auth;
    },
    deleteUser: async (parent, args, context, info) => {
      const user = await deleteUser({
        db: context.db,
        email: context.user.email
      });
      return user;
    },
    updateUser: async (parent, args, context, info) => {
      const user = await updateUser({
        user: context.user,
        ...args
      });
      return user;
    }
  }
};

export default AuthResolver;
