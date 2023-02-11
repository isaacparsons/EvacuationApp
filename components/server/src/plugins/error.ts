import {
  ApolloServerPlugin,
  BaseContext,
  GraphQLRequestListener
} from "apollo-server-plugin-base";

export const GraphQLErrorsHandler: ApolloServerPlugin<BaseContext> = {
  async requestDidStart({
    context
  }): Promise<void | GraphQLRequestListener<BaseContext>> {
    return {
      async didEncounterErrors({ errors }) {
        if (errors.length > 0) {
          errors.forEach((error) => {
            context.log.error("Unhandled error", error);
          });
        }
      }
    };
  }
};
