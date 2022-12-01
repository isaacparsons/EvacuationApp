import {
  ApolloServerPlugin,
  BaseContext,
  GraphQLRequestListener
} from "apollo-server-plugin-base";
import logger from "../config/logger";

const log = logger("evacuationApp");

export const GraphQLErrorsHandler: ApolloServerPlugin<BaseContext> = {
  async requestDidStart({
    context
  }): Promise<void | GraphQLRequestListener<BaseContext>> {
    return {
      async didEncounterErrors({ errors }) {
        if (errors.length > 0) {
          errors.forEach((error) => {
            log.error(error);
          });
        }
      }
    };
  }
};
