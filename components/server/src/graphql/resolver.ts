import { gql } from "apollo-server";
import AuthResolver from "../resolvers/Auth";
import EvacuationEventResolver from "../resolvers/EvacuationEvent";
import GroupResolver from "../resolvers/Group";

import { mergeResolvers } from "@graphql-tools/merge";
import OrganizationResolver from "../resolvers/Organization";

export const resolvers = mergeResolvers([
  AuthResolver,
  GroupResolver,
  EvacuationEventResolver,
  OrganizationResolver
]);
