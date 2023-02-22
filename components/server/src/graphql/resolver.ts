import AuthResolver from "../resolvers/Auth";
import EvacuationEventResolver from "../resolvers/EvacuationEvent";
import GroupResolver from "../resolvers/Group";

import { mergeResolvers } from "@graphql-tools/merge";
import OrganizationResolver from "../resolvers/Organization";
import { Resolvers } from "src/generated/graphql";

export const resolvers: Resolvers = mergeResolvers([
  AuthResolver,
  GroupResolver,
  EvacuationEventResolver,
  OrganizationResolver
]);
