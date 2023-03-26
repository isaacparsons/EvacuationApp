import { GraphQLError } from "graphql";

export const NotFoundError = (msg: string) => {
  return new GraphQLError(msg, {
    extensions: {
      code: "NotFound",
      http: {
        status: 404
      }
    }
  });
};

export const AuthenticationError = (msg: string) => {
  new GraphQLError(msg, {
    extensions: {
      code: "UNAUTHENTICATED",
      http: {
        status: 400
      }
    }
  });
};
