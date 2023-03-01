"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE_ANNOUNCEMENT = exports.GET_ANNOUNCEMENTS = exports.GET_ORGANIZATION_MEMBERS = exports.UPDATE_ORGANIZATION_NOTIFICATION_SETTINGS = exports.CREATE_ORGANIZATION_ANNOUNCEMENT = exports.CREATE_ORG = exports.DELETE_ORG = exports.INVITE_TO_ORG = exports.UPDATE_ORG_INVITE = exports.REMOVE_FROM_ORG = exports.GET_ORGANIZATION_FOR_USER = exports.GET_ORGANIZATION = exports.GET_ORGANIZATIONS = void 0;
const apollo_server_core_1 = require("apollo-server-core");
// import {gql} from '@apollo/client';
exports.GET_ORGANIZATIONS = (0, apollo_server_core_1.gql) `
  query getOrganizations {
    getOrganizations {
      id
      organizationId
      userId
      organization {
        id
        name
        members {
          admin
          id
          organizationId
          status
          userId
        }
      }
      status
      admin
    }
  }
`;
exports.GET_ORGANIZATION = (0, apollo_server_core_1.gql) `
  query GetOrganization($organizationId: Int!) {
    getOrganization(organizationId: $organizationId) {
      id
      name
      groups {
        organizationId
        id
        name
      }
      notificationSetting {
        emailEnabled
        id
        organizationId
        pushEnabled
        smsEnabled
      }
    }
  }
`;
exports.GET_ORGANIZATION_FOR_USER = (0, apollo_server_core_1.gql) `
  query GetOrganizationForUser($organizationId: Int!) {
    getOrganizationForUser(organizationId: $organizationId) {
      id
      name
      groups {
        id
        userId
        groupId
        organizationMemberId
        organizationMember {
          id
          status
          userId
          admin
          organizationId
        }
        admin
        group {
          organizationId
          id
          name
        }
      }
      notificationSetting {
        emailEnabled
        id
        organizationId
        pushEnabled
        smsEnabled
      }
    }
  }
`;
exports.REMOVE_FROM_ORG = (0, apollo_server_core_1.gql) `
  mutation RemoveFromOrganization($organizationId: Int!, $userIds: [Int!]!) {
    removeFromOrganization(organizationId: $organizationId, userIds: $userIds) {
      id
      organizationId
      user {
        email
        firstName
        lastName
        id
      }
    }
  }
`;
exports.UPDATE_ORG_INVITE = (0, apollo_server_core_1.gql) `
  mutation UpdateOrgInvite($organizationId: Int!, $status: String!) {
    updateOrgInvite(organizationId: $organizationId, status: $status) {
      id
      userId
      organizationId
      status
      admin
    }
  }
`;
exports.INVITE_TO_ORG = (0, apollo_server_core_1.gql) `
  mutation InviteToOrganization(
    $organizationId: Int!
    $users: [InvitedOrganizationUser!]!
    $groupIds: [Int!]
  ) {
    inviteToOrganization(organizationId: $organizationId, users: $users, groupIds: $groupIds) {
      id
      organizationId
      userId
    }
  }
`;
exports.DELETE_ORG = (0, apollo_server_core_1.gql) `
  mutation deleteOrganization($organizationId: Int!) {
    deleteOrganization(organizationId: $organizationId) {
      id
      name
    }
  }
`;
exports.CREATE_ORG = (0, apollo_server_core_1.gql) `
  mutation CreateOrg(
    $name: String!
    $organizationNotificationSetting: OrganizationNotificationSettingInput!
  ) {
    createOrganization(
      name: $name
      organizationNotificationSetting: $organizationNotificationSetting
    ) {
      announcements {
        createdBy
        date
        description
        id
        organizationId
        title
      }
      id
      members {
        admin
        id
        organizationId
        status
        userId
      }
      name
      notificationSetting {
        emailEnabled
        id
        organizationId
        pushEnabled
        smsEnabled
      }
    }
  }
`;
exports.CREATE_ORGANIZATION_ANNOUNCEMENT = (0, apollo_server_core_1.gql) `
  mutation CreateOrganizationAnnouncement(
    $organizationId: Int!
    $title: String!
    $description: String
    $groupIds: [Int!]
  ) {
    createOrganizationAnnouncement(
      organizationId: $organizationId
      title: $title
      description: $description
      groupIds: $groupIds
    ) {
      createdBy
      description
      date
      id
      organizationId
      title
    }
  }
`;
exports.UPDATE_ORGANIZATION_NOTIFICATION_SETTINGS = (0, apollo_server_core_1.gql) `
  mutation UpdateOrganizationNotificationOptions(
    $organizationId: Int!
    $organizationNotificationSetting: OrganizationNotificationSettingInput!
  ) {
    updateOrganizationNotificationOptions(
      organizationId: $organizationId
      organizationNotificationSetting: $organizationNotificationSetting
    ) {
      emailEnabled
      id
      organizationId
      pushEnabled
      smsEnabled
    }
  }
`;
exports.GET_ORGANIZATION_MEMBERS = (0, apollo_server_core_1.gql) `
  query GetOrganizationMembers($organizationId: Int!, $cursor: Int) {
    getOrganizationMembers(organizationId: $organizationId, cursor: $cursor) {
      cursor
      data {
        admin
        id
        organizationId
        status
        user {
          accountCreated
          email
          firstName
          id
          lastName
          phoneNumber
        }
        userId
      }
    }
  }
`;
exports.GET_ANNOUNCEMENTS = (0, apollo_server_core_1.gql) `
  query GetAnnouncements($organizationId: Int!, $cursor: Int) {
    getAnnouncements(organizationId: $organizationId, cursor: $cursor) {
      cursor
      data {
        createdBy
        date
        description
        id
        organizationId
        title
      }
    }
  }
`;
exports.DELETE_ANNOUNCEMENT = (0, apollo_server_core_1.gql) `
  mutation DeleteOrganizationAnnouncement($announcementId: Int!) {
    deleteOrganizationAnnouncement(announcementId: $announcementId) {
      createdBy
      date
      description
      id
      organizationId
      title
    }
  }
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JnYW5pemF0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZXYvZ3FsL29yZ2FuaXphdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkRBQXlDO0FBRXpDLHNDQUFzQztBQUV6QixRQUFBLGlCQUFpQixHQUFHLElBQUEsd0JBQUcsRUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBcUJuQyxDQUFDO0FBRVcsUUFBQSxnQkFBZ0IsR0FBRyxJQUFBLHdCQUFHLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FtQmxDLENBQUM7QUFFVyxRQUFBLHlCQUF5QixHQUFHLElBQUEsd0JBQUcsRUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBaUMzQyxDQUFDO0FBRVcsUUFBQSxlQUFlLEdBQUcsSUFBQSx3QkFBRyxFQUFBOzs7Ozs7Ozs7Ozs7O0NBYWpDLENBQUM7QUFFVyxRQUFBLGlCQUFpQixHQUFHLElBQUEsd0JBQUcsRUFBQTs7Ozs7Ozs7OztDQVVuQyxDQUFDO0FBRVcsUUFBQSxhQUFhLEdBQUcsSUFBQSx3QkFBRyxFQUFBOzs7Ozs7Ozs7Ozs7Q0FZL0IsQ0FBQztBQUVXLFFBQUEsVUFBVSxHQUFHLElBQUEsd0JBQUcsRUFBQTs7Ozs7OztDQU81QixDQUFDO0FBRVcsUUFBQSxVQUFVLEdBQUcsSUFBQSx3QkFBRyxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQW1DNUIsQ0FBQztBQUVXLFFBQUEsZ0NBQWdDLEdBQUcsSUFBQSx3QkFBRyxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FxQmxELENBQUM7QUFFVyxRQUFBLHlDQUF5QyxHQUFHLElBQUEsd0JBQUcsRUFBQTs7Ozs7Ozs7Ozs7Ozs7OztDQWdCM0QsQ0FBQztBQUVXLFFBQUEsd0JBQXdCLEdBQUcsSUFBQSx3QkFBRyxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FxQjFDLENBQUM7QUFFVyxRQUFBLGlCQUFpQixHQUFHLElBQUEsd0JBQUcsRUFBQTs7Ozs7Ozs7Ozs7Ozs7Q0FjbkMsQ0FBQztBQUVXLFFBQUEsbUJBQW1CLEdBQUcsSUFBQSx3QkFBRyxFQUFBOzs7Ozs7Ozs7OztDQVdyQyxDQUFDIn0=