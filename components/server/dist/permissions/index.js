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
        getGroup: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, (0, graphql_shield_1.race)(rules_1.isGroupAdmin, rules_1.isOrgAdmin)),
        getGroupForUser: rules_1.isAuthenticated,
        getEvacuationEvent: rules_1.isAuthenticated
    },
    Mutation: {
        resetPassword: rules_1.isAuthenticated,
        deleteUser: rules_1.isAuthenticated,
        updateUser: rules_1.isAuthenticated,
        createGroup: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, rules_1.isOrgAdmin),
        deleteGroup: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, (0, graphql_shield_1.race)(rules_1.isGroupAdmin, rules_1.isOrgAdmin)),
        updateGroupNotificationOptions: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, (0, graphql_shield_1.race)(rules_1.isGroupAdmin, rules_1.isOrgAdmin)),
        inviteUsers: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, (0, graphql_shield_1.or)(rules_1.isGroupAdmin, rules_1.isOrgAdmin)),
        updateInvite: rules_1.isAuthenticated,
        updateGroupMember: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, rules_1.isOrgAdmin),
        removeMembers: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, (0, graphql_shield_1.race)(rules_1.isGroupAdmin, rules_1.isOrgAdmin)),
        createEvacuationEvent: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, (0, graphql_shield_1.race)(rules_1.isGroupAdmin, rules_1.isOrgAdmin)),
        updateEvacuationEvent: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, (0, graphql_shield_1.race)(rules_1.isGroupAdmin, rules_1.isOrgAdmin)),
        createEvacuationEventResponse: rules_1.isAuthenticated,
        createOrganization: rules_1.isAuthenticated,
        deleteOrganization: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, rules_1.isOrgAdmin),
        inviteToOrganization: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, rules_1.isOrgAdmin),
        updateOrgInvite: rules_1.isAuthenticated,
        removeFromOrganization: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, rules_1.isOrgAdmin),
        createOrganizationAnnouncement: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, rules_1.isOrgAdmin),
        deleteOrganizationAnnouncement: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, rules_1.isOrgAdmin)
    }
}, { allowExternalErrors: true });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGVybWlzc2lvbnMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbURBQXlEO0FBQ3pELG1DQUFvRTtBQUV2RCxRQUFBLFdBQVcsR0FBRyxJQUFBLHVCQUFNLEVBQy9CO0lBQ0UsS0FBSyxFQUFFO1FBQ0wsZ0JBQWdCLEVBQUUsdUJBQWU7UUFDakMsZUFBZSxFQUFFLElBQUEsc0JBQUssRUFBQyx1QkFBZSxFQUFFLGtCQUFVLENBQUM7UUFDbkQsc0JBQXNCLEVBQUUsdUJBQWU7UUFDdkMsUUFBUSxFQUFFLElBQUEsc0JBQUssRUFBQyx1QkFBZSxFQUFFLElBQUEscUJBQUksRUFBQyxvQkFBWSxFQUFFLGtCQUFVLENBQUMsQ0FBQztRQUNoRSxlQUFlLEVBQUUsdUJBQWU7UUFDaEMsa0JBQWtCLEVBQUUsdUJBQWU7S0FDcEM7SUFDRCxRQUFRLEVBQUU7UUFDUixhQUFhLEVBQUUsdUJBQWU7UUFDOUIsVUFBVSxFQUFFLHVCQUFlO1FBQzNCLFVBQVUsRUFBRSx1QkFBZTtRQUMzQixXQUFXLEVBQUUsSUFBQSxzQkFBSyxFQUFDLHVCQUFlLEVBQUUsa0JBQVUsQ0FBQztRQUMvQyxXQUFXLEVBQUUsSUFBQSxzQkFBSyxFQUFDLHVCQUFlLEVBQUUsSUFBQSxxQkFBSSxFQUFDLG9CQUFZLEVBQUUsa0JBQVUsQ0FBQyxDQUFDO1FBQ25FLDhCQUE4QixFQUFFLElBQUEsc0JBQUssRUFDbkMsdUJBQWUsRUFDZixJQUFBLHFCQUFJLEVBQUMsb0JBQVksRUFBRSxrQkFBVSxDQUFDLENBQy9CO1FBQ0QsV0FBVyxFQUFFLElBQUEsc0JBQUssRUFBQyx1QkFBZSxFQUFFLElBQUEsbUJBQUUsRUFBQyxvQkFBWSxFQUFFLGtCQUFVLENBQUMsQ0FBQztRQUNqRSxZQUFZLEVBQUUsdUJBQWU7UUFDN0IsaUJBQWlCLEVBQUUsSUFBQSxzQkFBSyxFQUFDLHVCQUFlLEVBQUUsa0JBQVUsQ0FBQztRQUNyRCxhQUFhLEVBQUUsSUFBQSxzQkFBSyxFQUFDLHVCQUFlLEVBQUUsSUFBQSxxQkFBSSxFQUFDLG9CQUFZLEVBQUUsa0JBQVUsQ0FBQyxDQUFDO1FBQ3JFLHFCQUFxQixFQUFFLElBQUEsc0JBQUssRUFDMUIsdUJBQWUsRUFDZixJQUFBLHFCQUFJLEVBQUMsb0JBQVksRUFBRSxrQkFBVSxDQUFDLENBQy9CO1FBQ0QscUJBQXFCLEVBQUUsSUFBQSxzQkFBSyxFQUMxQix1QkFBZSxFQUNmLElBQUEscUJBQUksRUFBQyxvQkFBWSxFQUFFLGtCQUFVLENBQUMsQ0FDL0I7UUFDRCw2QkFBNkIsRUFBRSx1QkFBZTtRQUM5QyxrQkFBa0IsRUFBRSx1QkFBZTtRQUNuQyxrQkFBa0IsRUFBRSxJQUFBLHNCQUFLLEVBQUMsdUJBQWUsRUFBRSxrQkFBVSxDQUFDO1FBQ3RELG9CQUFvQixFQUFFLElBQUEsc0JBQUssRUFBQyx1QkFBZSxFQUFFLGtCQUFVLENBQUM7UUFDeEQsZUFBZSxFQUFFLHVCQUFlO1FBQ2hDLHNCQUFzQixFQUFFLElBQUEsc0JBQUssRUFBQyx1QkFBZSxFQUFFLGtCQUFVLENBQUM7UUFDMUQsOEJBQThCLEVBQUUsSUFBQSxzQkFBSyxFQUFDLHVCQUFlLEVBQUUsa0JBQVUsQ0FBQztRQUNsRSw4QkFBOEIsRUFBRSxJQUFBLHNCQUFLLEVBQUMsdUJBQWUsRUFBRSxrQkFBVSxDQUFDO0tBQ25FO0NBQ0YsRUFDRCxFQUFFLG1CQUFtQixFQUFFLElBQUksRUFBRSxDQUM5QixDQUFDIn0=