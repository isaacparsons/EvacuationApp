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
        createGroup: rules_1.isAuthenticated,
        deleteGroup: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, (0, graphql_shield_1.race)(rules_1.isGroupAdmin, rules_1.isOrgAdmin)),
        updateGroupNotificationOptions: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, (0, graphql_shield_1.race)(rules_1.isGroupAdmin, rules_1.isOrgAdmin)),
        inviteUsers: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, (0, graphql_shield_1.or)(rules_1.isGroupAdmin, rules_1.isOrgAdmin)),
        updateInvite: rules_1.isAuthenticated,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGVybWlzc2lvbnMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbURBQXlEO0FBQ3pELG1DQUFvRTtBQUV2RCxRQUFBLFdBQVcsR0FBRyxJQUFBLHVCQUFNLEVBQy9CO0lBQ0UsS0FBSyxFQUFFO1FBQ0wsZ0JBQWdCLEVBQUUsdUJBQWU7UUFDakMsZUFBZSxFQUFFLElBQUEsc0JBQUssRUFBQyx1QkFBZSxFQUFFLGtCQUFVLENBQUM7UUFDbkQsc0JBQXNCLEVBQUUsdUJBQWU7UUFDdkMsUUFBUSxFQUFFLElBQUEsc0JBQUssRUFBQyx1QkFBZSxFQUFFLElBQUEscUJBQUksRUFBQyxvQkFBWSxFQUFFLGtCQUFVLENBQUMsQ0FBQztRQUNoRSxlQUFlLEVBQUUsdUJBQWU7UUFDaEMsa0JBQWtCLEVBQUUsdUJBQWU7S0FDcEM7SUFDRCxRQUFRLEVBQUU7UUFDUixhQUFhLEVBQUUsdUJBQWU7UUFDOUIsVUFBVSxFQUFFLHVCQUFlO1FBQzNCLFVBQVUsRUFBRSx1QkFBZTtRQUMzQixXQUFXLEVBQUUsdUJBQWU7UUFDNUIsV0FBVyxFQUFFLElBQUEsc0JBQUssRUFBQyx1QkFBZSxFQUFFLElBQUEscUJBQUksRUFBQyxvQkFBWSxFQUFFLGtCQUFVLENBQUMsQ0FBQztRQUNuRSw4QkFBOEIsRUFBRSxJQUFBLHNCQUFLLEVBQ25DLHVCQUFlLEVBQ2YsSUFBQSxxQkFBSSxFQUFDLG9CQUFZLEVBQUUsa0JBQVUsQ0FBQyxDQUMvQjtRQUNELFdBQVcsRUFBRSxJQUFBLHNCQUFLLEVBQUMsdUJBQWUsRUFBRSxJQUFBLG1CQUFFLEVBQUMsb0JBQVksRUFBRSxrQkFBVSxDQUFDLENBQUM7UUFDakUsWUFBWSxFQUFFLHVCQUFlO1FBQzdCLGFBQWEsRUFBRSxJQUFBLHNCQUFLLEVBQUMsdUJBQWUsRUFBRSxJQUFBLHFCQUFJLEVBQUMsb0JBQVksRUFBRSxrQkFBVSxDQUFDLENBQUM7UUFDckUscUJBQXFCLEVBQUUsSUFBQSxzQkFBSyxFQUMxQix1QkFBZSxFQUNmLElBQUEscUJBQUksRUFBQyxvQkFBWSxFQUFFLGtCQUFVLENBQUMsQ0FDL0I7UUFDRCxxQkFBcUIsRUFBRSxJQUFBLHNCQUFLLEVBQzFCLHVCQUFlLEVBQ2YsSUFBQSxxQkFBSSxFQUFDLG9CQUFZLEVBQUUsa0JBQVUsQ0FBQyxDQUMvQjtRQUNELDZCQUE2QixFQUFFLHVCQUFlO1FBQzlDLGtCQUFrQixFQUFFLHVCQUFlO1FBQ25DLGtCQUFrQixFQUFFLElBQUEsc0JBQUssRUFBQyx1QkFBZSxFQUFFLGtCQUFVLENBQUM7UUFDdEQsb0JBQW9CLEVBQUUsSUFBQSxzQkFBSyxFQUFDLHVCQUFlLEVBQUUsa0JBQVUsQ0FBQztRQUN4RCxlQUFlLEVBQUUsdUJBQWU7UUFDaEMsc0JBQXNCLEVBQUUsSUFBQSxzQkFBSyxFQUFDLHVCQUFlLEVBQUUsa0JBQVUsQ0FBQztRQUMxRCw4QkFBOEIsRUFBRSxJQUFBLHNCQUFLLEVBQUMsdUJBQWUsRUFBRSxrQkFBVSxDQUFDO1FBQ2xFLDhCQUE4QixFQUFFLElBQUEsc0JBQUssRUFBQyx1QkFBZSxFQUFFLGtCQUFVLENBQUM7S0FDbkU7Q0FDRixFQUNELEVBQUUsbUJBQW1CLEVBQUUsSUFBSSxFQUFFLENBQzlCLENBQUMifQ==