import { gql } from "apollo-server-core";

export const GET_GROUP = gql`
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

export const GET_GROUP_FOR_USER = gql`
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

export const GET_GROUP_MEMBERS = gql`
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

export const CREATE_GROUP = gql`
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

export const DELETE_GROUP = gql`
  mutation deleteGroup($groupId: Int!) {
    deleteGroup(groupId: $groupId) {
      id
      name
    }
  }
`;

export const ADD_USERS_TO_GROUP = gql`
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

export const REMOVE_USERS = gql`
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

export const UPDATE_NOTIFICATION_SETTINGS = gql`
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

export const UPDATE_GROUP_MEMBER = gql`
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
