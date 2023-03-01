import { gql } from "apollo-server-core";

// import {gql} from '@apollo/client';

export const GET_ORGANIZATIONS = gql`
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

export const GET_ORGANIZATION = gql`
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

export const GET_ORGANIZATION_FOR_USER = gql`
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

export const REMOVE_FROM_ORG = gql`
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

export const UPDATE_ORG_INVITE = gql`
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

export const INVITE_TO_ORG = gql`
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

export const DELETE_ORG = gql`
  mutation deleteOrganization($organizationId: Int!) {
    deleteOrganization(organizationId: $organizationId) {
      id
      name
    }
  }
`;

export const CREATE_ORG = gql`
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

export const CREATE_ORGANIZATION_ANNOUNCEMENT = gql`
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

export const UPDATE_ORGANIZATION_NOTIFICATION_SETTINGS = gql`
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

export const GET_ORGANIZATION_MEMBERS = gql`
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

export const GET_ANNOUNCEMENTS = gql`
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

export const DELETE_ANNOUNCEMENT = gql`
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
