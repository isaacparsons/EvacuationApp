"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissions = void 0;
const graphql_shield_1 = require("graphql-shield");
const rules_1 = require("./rules");
exports.permissions = (0, graphql_shield_1.shield)({
    Query: {
        getOrganizations: rules_1.isAuthenticated,
        getOrganization: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, rules_1.isOrgAdmin),
        getOrganizationForUser: rules_1.isAuthenticated,
        getOrganizationMembers: rules_1.isAuthenticated,
        getAnnouncements: rules_1.isAuthenticated,
        getGroup: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, (0, graphql_shield_1.race)(rules_1.isGroupAdmin, rules_1.isOrgAdmin)),
        getGroupForUser: rules_1.isAuthenticated,
        getGroupMembers: rules_1.isAuthenticated,
        getEvacuationEvents: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, (0, graphql_shield_1.race)(rules_1.isGroupAdmin, rules_1.isOrgAdmin)),
        getEvacuationEvent: rules_1.isAuthenticated,
        getInProgressEvacuationEvents: rules_1.isAuthenticated,
        getJoinedEntities: rules_1.isAuthenticated
    },
    Mutation: {
        deleteUser: rules_1.isAuthenticated,
        updateUser: rules_1.isAuthenticated,
        createGroup: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, rules_1.isOrgAdmin),
        deleteGroup: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, (0, graphql_shield_1.race)(rules_1.isGroupAdmin, rules_1.isOrgAdmin)),
        updateGroupNotificationOptions: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, (0, graphql_shield_1.race)(rules_1.isGroupAdmin, rules_1.isOrgAdmin)),
        updateGroupMember: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, rules_1.isOrgAdmin),
        updateOrganizationNotificationOptions: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, rules_1.isOrgAdmin),
        removeMembers: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, (0, graphql_shield_1.race)(rules_1.isGroupAdmin, rules_1.isOrgAdmin)),
        createEvacuationEvent: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, (0, graphql_shield_1.race)(rules_1.isGroupAdmin, rules_1.isOrgAdmin)),
        updateEvacuationEvent: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, (0, graphql_shield_1.race)(rules_1.isGroupAdmin, rules_1.isOrgAdmin)),
        createEvacuationEventResponse: rules_1.isAuthenticated,
        createOrganization: rules_1.isAuthenticated,
        deleteOrganization: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, rules_1.isOrgAdmin),
        inviteToOrganization: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, rules_1.isOrgAdmin),
        updateOrgInvite: rules_1.isAuthenticated,
        addUsersToGroup: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, (0, graphql_shield_1.race)(rules_1.isGroupAdmin, rules_1.isOrgAdmin)),
        removeFromOrganization: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, rules_1.isOrgAdmin),
        createOrganizationAnnouncement: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, rules_1.isOrgAdmin),
        deleteOrganizationAnnouncement: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, rules_1.isOrgAdmin)
    }
}, { allowExternalErrors: true });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGVybWlzc2lvbnMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbURBQXFEO0FBQ3JELG1DQUFvRTtBQUV2RCxRQUFBLFdBQVcsR0FBRyxJQUFBLHVCQUFNLEVBQy9CO0lBQ0UsS0FBSyxFQUFFO1FBQ0wsZ0JBQWdCLEVBQUUsdUJBQWU7UUFDakMsZUFBZSxFQUFFLElBQUEsc0JBQUssRUFBQyx1QkFBZSxFQUFFLGtCQUFVLENBQUM7UUFDbkQsc0JBQXNCLEVBQUUsdUJBQWU7UUFDdkMsc0JBQXNCLEVBQUUsdUJBQWU7UUFDdkMsZ0JBQWdCLEVBQUUsdUJBQWU7UUFDakMsUUFBUSxFQUFFLElBQUEsc0JBQUssRUFBQyx1QkFBZSxFQUFFLElBQUEscUJBQUksRUFBQyxvQkFBWSxFQUFFLGtCQUFVLENBQUMsQ0FBQztRQUNoRSxlQUFlLEVBQUUsdUJBQWU7UUFDaEMsZUFBZSxFQUFFLHVCQUFlO1FBQ2hDLG1CQUFtQixFQUFFLElBQUEsc0JBQUssRUFBQyx1QkFBZSxFQUFFLElBQUEscUJBQUksRUFBQyxvQkFBWSxFQUFFLGtCQUFVLENBQUMsQ0FBQztRQUMzRSxrQkFBa0IsRUFBRSx1QkFBZTtRQUNuQyw2QkFBNkIsRUFBRSx1QkFBZTtRQUM5QyxpQkFBaUIsRUFBRSx1QkFBZTtLQUNuQztJQUNELFFBQVEsRUFBRTtRQUNSLFVBQVUsRUFBRSx1QkFBZTtRQUMzQixVQUFVLEVBQUUsdUJBQWU7UUFDM0IsV0FBVyxFQUFFLElBQUEsc0JBQUssRUFBQyx1QkFBZSxFQUFFLGtCQUFVLENBQUM7UUFDL0MsV0FBVyxFQUFFLElBQUEsc0JBQUssRUFBQyx1QkFBZSxFQUFFLElBQUEscUJBQUksRUFBQyxvQkFBWSxFQUFFLGtCQUFVLENBQUMsQ0FBQztRQUNuRSw4QkFBOEIsRUFBRSxJQUFBLHNCQUFLLEVBQUMsdUJBQWUsRUFBRSxJQUFBLHFCQUFJLEVBQUMsb0JBQVksRUFBRSxrQkFBVSxDQUFDLENBQUM7UUFDdEYsaUJBQWlCLEVBQUUsSUFBQSxzQkFBSyxFQUFDLHVCQUFlLEVBQUUsa0JBQVUsQ0FBQztRQUNyRCxxQ0FBcUMsRUFBRSxJQUFBLHNCQUFLLEVBQUMsdUJBQWUsRUFBRSxrQkFBVSxDQUFDO1FBQ3pFLGFBQWEsRUFBRSxJQUFBLHNCQUFLLEVBQUMsdUJBQWUsRUFBRSxJQUFBLHFCQUFJLEVBQUMsb0JBQVksRUFBRSxrQkFBVSxDQUFDLENBQUM7UUFDckUscUJBQXFCLEVBQUUsSUFBQSxzQkFBSyxFQUFDLHVCQUFlLEVBQUUsSUFBQSxxQkFBSSxFQUFDLG9CQUFZLEVBQUUsa0JBQVUsQ0FBQyxDQUFDO1FBQzdFLHFCQUFxQixFQUFFLElBQUEsc0JBQUssRUFBQyx1QkFBZSxFQUFFLElBQUEscUJBQUksRUFBQyxvQkFBWSxFQUFFLGtCQUFVLENBQUMsQ0FBQztRQUM3RSw2QkFBNkIsRUFBRSx1QkFBZTtRQUM5QyxrQkFBa0IsRUFBRSx1QkFBZTtRQUNuQyxrQkFBa0IsRUFBRSxJQUFBLHNCQUFLLEVBQUMsdUJBQWUsRUFBRSxrQkFBVSxDQUFDO1FBQ3RELG9CQUFvQixFQUFFLElBQUEsc0JBQUssRUFBQyx1QkFBZSxFQUFFLGtCQUFVLENBQUM7UUFDeEQsZUFBZSxFQUFFLHVCQUFlO1FBQ2hDLGVBQWUsRUFBRSxJQUFBLHNCQUFLLEVBQUMsdUJBQWUsRUFBRSxJQUFBLHFCQUFJLEVBQUMsb0JBQVksRUFBRSxrQkFBVSxDQUFDLENBQUM7UUFDdkUsc0JBQXNCLEVBQUUsSUFBQSxzQkFBSyxFQUFDLHVCQUFlLEVBQUUsa0JBQVUsQ0FBQztRQUMxRCw4QkFBOEIsRUFBRSxJQUFBLHNCQUFLLEVBQUMsdUJBQWUsRUFBRSxrQkFBVSxDQUFDO1FBQ2xFLDhCQUE4QixFQUFFLElBQUEsc0JBQUssRUFBQyx1QkFBZSxFQUFFLGtCQUFVLENBQUM7S0FDbkU7Q0FDRixFQUNELEVBQUUsbUJBQW1CLEVBQUUsSUFBSSxFQUFFLENBQzlCLENBQUMifQ==