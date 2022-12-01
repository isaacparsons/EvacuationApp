import { chain, or, race, shield } from "graphql-shield";
import { isAuthenticated, isGroupAdmin, isOrgAdmin } from "./rules";

export const permissions = shield(
  {
    Query: {
      getOrganizations: isAuthenticated,
      getOrganization: chain(isAuthenticated, isOrgAdmin),
      getOrganizationForUser: isAuthenticated,
      getGroup: chain(isAuthenticated, race(isGroupAdmin, isOrgAdmin)),
      getGroupForUser: isAuthenticated,
      getEvacuationEvent: isAuthenticated
    },
    Mutation: {
      resetPassword: isAuthenticated,
      deleteUser: isAuthenticated,
      updateUser: isAuthenticated,
      createGroup: isAuthenticated,
      deleteGroup: chain(isAuthenticated, race(isGroupAdmin, isOrgAdmin)),
      updateGroupNotificationOptions: chain(
        isAuthenticated,
        race(isGroupAdmin, isOrgAdmin)
      ),
      inviteUsers: chain(isAuthenticated, or(isGroupAdmin, isOrgAdmin)),
      updateInvite: isAuthenticated,
      removeMembers: chain(isAuthenticated, race(isGroupAdmin, isOrgAdmin)),
      createEvacuationEvent: chain(
        isAuthenticated,
        race(isGroupAdmin, isOrgAdmin)
      ),
      updateEvacuationEvent: chain(
        isAuthenticated,
        race(isGroupAdmin, isOrgAdmin)
      ),
      createEvacuationEventResponse: isAuthenticated,
      createOrganization: isAuthenticated,
      deleteOrganization: chain(isAuthenticated, isOrgAdmin),
      inviteToOrganization: chain(isAuthenticated, isOrgAdmin),
      updateOrgInvite: isAuthenticated,
      removeFromOrganization: chain(isAuthenticated, isOrgAdmin),
      createOrganizationAnnouncement: chain(isAuthenticated, isOrgAdmin),
      deleteOrganizationAnnouncement: chain(isAuthenticated, isOrgAdmin)
    }
  },
  { allowExternalErrors: true }
);
