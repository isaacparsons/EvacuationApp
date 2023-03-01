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
        getEvacuationEvents: rules_1.isAuthenticated,
        getEvacuationEvent: rules_1.isAuthenticated,
        getInProgressEvacuationEvents: rules_1.isAuthenticated,
        getJoinedEntities: rules_1.isAuthenticated
    },
    Mutation: {
        resetPassword: rules_1.isAuthenticated,
        deleteUser: rules_1.isAuthenticated,
        updateUser: rules_1.isAuthenticated,
        createGroup: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, rules_1.isOrgAdmin),
        deleteGroup: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, (0, graphql_shield_1.race)(rules_1.isGroupAdmin, rules_1.isOrgAdmin)),
        updateGroupNotificationOptions: (0, graphql_shield_1.chain)(rules_1.isAuthenticated, (0, graphql_shield_1.race)(rules_1.isGroupAdmin, rules_1.isOrgAdmin)),
        // inviteUsers: chain(isAuthenticated, or(isGroupAdmin, isOrgAdmin)),
        // updateInvite: isAuthenticated,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGVybWlzc2lvbnMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbURBQXlEO0FBQ3pELG1DQUFvRTtBQUV2RCxRQUFBLFdBQVcsR0FBRyxJQUFBLHVCQUFNLEVBQy9CO0lBQ0UsS0FBSyxFQUFFO1FBQ0wsZ0JBQWdCLEVBQUUsdUJBQWU7UUFDakMsZUFBZSxFQUFFLElBQUEsc0JBQUssRUFBQyx1QkFBZSxFQUFFLGtCQUFVLENBQUM7UUFDbkQsc0JBQXNCLEVBQUUsdUJBQWU7UUFDdkMsc0JBQXNCLEVBQUUsdUJBQWU7UUFDdkMsZ0JBQWdCLEVBQUUsdUJBQWU7UUFDakMsUUFBUSxFQUFFLElBQUEsc0JBQUssRUFBQyx1QkFBZSxFQUFFLElBQUEscUJBQUksRUFBQyxvQkFBWSxFQUFFLGtCQUFVLENBQUMsQ0FBQztRQUNoRSxlQUFlLEVBQUUsdUJBQWU7UUFDaEMsZUFBZSxFQUFFLHVCQUFlO1FBQ2hDLG1CQUFtQixFQUFFLHVCQUFlO1FBQ3BDLGtCQUFrQixFQUFFLHVCQUFlO1FBQ25DLDZCQUE2QixFQUFFLHVCQUFlO1FBQzlDLGlCQUFpQixFQUFFLHVCQUFlO0tBQ25DO0lBQ0QsUUFBUSxFQUFFO1FBQ1IsYUFBYSxFQUFFLHVCQUFlO1FBQzlCLFVBQVUsRUFBRSx1QkFBZTtRQUMzQixVQUFVLEVBQUUsdUJBQWU7UUFDM0IsV0FBVyxFQUFFLElBQUEsc0JBQUssRUFBQyx1QkFBZSxFQUFFLGtCQUFVLENBQUM7UUFDL0MsV0FBVyxFQUFFLElBQUEsc0JBQUssRUFBQyx1QkFBZSxFQUFFLElBQUEscUJBQUksRUFBQyxvQkFBWSxFQUFFLGtCQUFVLENBQUMsQ0FBQztRQUNuRSw4QkFBOEIsRUFBRSxJQUFBLHNCQUFLLEVBQUMsdUJBQWUsRUFBRSxJQUFBLHFCQUFJLEVBQUMsb0JBQVksRUFBRSxrQkFBVSxDQUFDLENBQUM7UUFDdEYscUVBQXFFO1FBQ3JFLGlDQUFpQztRQUNqQyxpQkFBaUIsRUFBRSxJQUFBLHNCQUFLLEVBQUMsdUJBQWUsRUFBRSxrQkFBVSxDQUFDO1FBQ3JELHFDQUFxQyxFQUFFLElBQUEsc0JBQUssRUFBQyx1QkFBZSxFQUFFLGtCQUFVLENBQUM7UUFDekUsYUFBYSxFQUFFLElBQUEsc0JBQUssRUFBQyx1QkFBZSxFQUFFLElBQUEscUJBQUksRUFBQyxvQkFBWSxFQUFFLGtCQUFVLENBQUMsQ0FBQztRQUNyRSxxQkFBcUIsRUFBRSxJQUFBLHNCQUFLLEVBQUMsdUJBQWUsRUFBRSxJQUFBLHFCQUFJLEVBQUMsb0JBQVksRUFBRSxrQkFBVSxDQUFDLENBQUM7UUFDN0UscUJBQXFCLEVBQUUsSUFBQSxzQkFBSyxFQUFDLHVCQUFlLEVBQUUsSUFBQSxxQkFBSSxFQUFDLG9CQUFZLEVBQUUsa0JBQVUsQ0FBQyxDQUFDO1FBQzdFLDZCQUE2QixFQUFFLHVCQUFlO1FBQzlDLGtCQUFrQixFQUFFLHVCQUFlO1FBQ25DLGtCQUFrQixFQUFFLElBQUEsc0JBQUssRUFBQyx1QkFBZSxFQUFFLGtCQUFVLENBQUM7UUFDdEQsb0JBQW9CLEVBQUUsSUFBQSxzQkFBSyxFQUFDLHVCQUFlLEVBQUUsa0JBQVUsQ0FBQztRQUN4RCxlQUFlLEVBQUUsdUJBQWU7UUFDaEMsZUFBZSxFQUFFLElBQUEsc0JBQUssRUFBQyx1QkFBZSxFQUFFLElBQUEscUJBQUksRUFBQyxvQkFBWSxFQUFFLGtCQUFVLENBQUMsQ0FBQztRQUN2RSxzQkFBc0IsRUFBRSxJQUFBLHNCQUFLLEVBQUMsdUJBQWUsRUFBRSxrQkFBVSxDQUFDO1FBQzFELDhCQUE4QixFQUFFLElBQUEsc0JBQUssRUFBQyx1QkFBZSxFQUFFLGtCQUFVLENBQUM7UUFDbEUsOEJBQThCLEVBQUUsSUFBQSxzQkFBSyxFQUFDLHVCQUFlLEVBQUUsa0JBQVUsQ0FBQztLQUNuRTtDQUNGLEVBQ0QsRUFBRSxtQkFBbUIsRUFBRSxJQUFJLEVBQUUsQ0FDOUIsQ0FBQyJ9