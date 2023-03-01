"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPDATE_GROUP_MEMBER = exports.UPDATE_NOTIFICATION_SETTINGS = exports.REMOVE_USERS = exports.ADD_USERS_TO_GROUP = exports.DELETE_GROUP = exports.CREATE_GROUP = exports.GET_GROUP_MEMBERS = exports.GET_GROUP_FOR_USER = exports.GET_GROUP = void 0;
const apollo_server_core_1 = require("apollo-server-core");
exports.GET_GROUP = (0, apollo_server_core_1.gql) `
  query GetGroup($groupId: Int!) {
    getGroup(groupId: $groupId) {
      id
      organizationId
      name
      notificationSetting {
        id
        groupId
        emailEnabled
        pushEnabled
        smsEnabled
      }
      members {
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
        user {
          id
          accountCreated
          email
          firstName
          lastName
          phoneNumber
        }
      }
      evacuationEvents {
        id
        startTime
        endTime
        createdBy
        status
        groupId
        message
        responses {
          id
          response
          userId
          time
          evacuationId
          user {
            id
            email
            phoneNumber
            firstName
            lastName
          }
        }
      }
    }
  }
`;
exports.GET_GROUP_FOR_USER = (0, apollo_server_core_1.gql) `
  query GetGroupForUser($groupId: Int!) {
    getGroupForUser(groupId: $groupId) {
      id
      organizationId
      name
      members {
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
        user {
          id
          email
          phoneNumber
          firstName
          lastName
        }
        admin
      }
      evacuationEvents {
        id
        startTime
        endTime
        createdBy
        status
        groupId
        message
        responses {
          id
          response
          userId
          time
          evacuationId
          user {
            id
            email
            phoneNumber
            firstName
            lastName
          }
        }
      }
    }
  }
`;
exports.GET_GROUP_MEMBERS = (0, apollo_server_core_1.gql) `
  query GetGroupMembers($groupId: Int!) {
    getGroupMembers(groupId: $groupId) {
      cursor
      data {
        admin
        groupId
        id
        organizationMemberId
        userId
        user {
          accountCreated
          email
          firstName
          id
          lastName
          phoneNumber
        }
        organizationMember {
          id
          status
          userId
          admin
          organizationId
        }
      }
    }
  }
`;
exports.CREATE_GROUP = (0, apollo_server_core_1.gql) `
  mutation CreateGroup(
    $organizationId: Int!
    $name: String!
    $groupNotificationSetting: GroupNotificationSettingInput!
  ) {
    createGroup(
      organizationId: $organizationId
      name: $name
      groupNotificationSetting: $groupNotificationSetting
    ) {
      id
      organizationId
      name
      notificationSetting {
        id
        emailEnabled
        groupId
        pushEnabled
        smsEnabled
      }
    }
  }
`;
exports.DELETE_GROUP = (0, apollo_server_core_1.gql) `
  mutation deleteGroup($groupId: Int!) {
    deleteGroup(groupId: $groupId) {
      id
      name
    }
  }
`;
exports.ADD_USERS_TO_GROUP = (0, apollo_server_core_1.gql) `
  mutation addUsersToGroup($groupId: Int!, $users: [AddGroupUser!]!) {
    addUsersToGroup(groupId: $groupId, users: $users) {
      id
      userId
      groupId
      organizationMemberId
      admin
    }
  }
`;
exports.REMOVE_USERS = (0, apollo_server_core_1.gql) `
  mutation removeMembers($groupId: Int!, $userIds: [Int!]!) {
    removeMembers(groupId: $groupId, userIds: $userIds) {
      id
      groupId
      userId
      organizationMemberId
      admin
    }
  }
`;
exports.UPDATE_NOTIFICATION_SETTINGS = (0, apollo_server_core_1.gql) `
  mutation UpdateGroupNotificationOptions(
    $groupId: Int!
    $groupNotificationSetting: GroupNotificationSettingInput!
  ) {
    updateGroupNotificationOptions(
      groupId: $groupId
      groupNotificationSetting: $groupNotificationSetting
    ) {
      id
      groupId
      emailEnabled
      pushEnabled
      smsEnabled
    }
  }
`;
exports.UPDATE_GROUP_MEMBER = (0, apollo_server_core_1.gql) `
  mutation UpdateGroupMember($userId: Int!, $groupId: Int!, $admin: Boolean!) {
    updateGroupMember(userId: $userId, groupId: $groupId, admin: $admin) {
      admin
      groupId
      id
      organizationMemberId
      userId
    }
  }
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvdXBzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2Rldi9ncWwvZ3JvdXBzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJEQUF5QztBQUU1QixRQUFBLFNBQVMsR0FBRyxJQUFBLHdCQUFHLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQTREM0IsQ0FBQztBQUVXLFFBQUEsa0JBQWtCLEdBQUcsSUFBQSx3QkFBRyxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBb0RwQyxDQUFDO0FBRVcsUUFBQSxpQkFBaUIsR0FBRyxJQUFBLHdCQUFHLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0E0Qm5DLENBQUM7QUFFVyxRQUFBLFlBQVksR0FBRyxJQUFBLHdCQUFHLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBdUI5QixDQUFDO0FBRVcsUUFBQSxZQUFZLEdBQUcsSUFBQSx3QkFBRyxFQUFBOzs7Ozs7O0NBTzlCLENBQUM7QUFFVyxRQUFBLGtCQUFrQixHQUFHLElBQUEsd0JBQUcsRUFBQTs7Ozs7Ozs7OztDQVVwQyxDQUFDO0FBRVcsUUFBQSxZQUFZLEdBQUcsSUFBQSx3QkFBRyxFQUFBOzs7Ozs7Ozs7O0NBVTlCLENBQUM7QUFFVyxRQUFBLDRCQUE0QixHQUFHLElBQUEsd0JBQUcsRUFBQTs7Ozs7Ozs7Ozs7Ozs7OztDQWdCOUMsQ0FBQztBQUVXLFFBQUEsbUJBQW1CLEdBQUcsSUFBQSx3QkFBRyxFQUFBOzs7Ozs7Ozs7O0NBVXJDLENBQUMifQ==