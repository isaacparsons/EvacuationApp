"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = exports.typeDefs = void 0;
const apollo_server_1 = require("apollo-server");
const Auth_1 = __importDefault(require("./resolvers/Auth"));
const EvacuationEvent_1 = __importDefault(require("./resolvers/EvacuationEvent"));
const Group_1 = __importDefault(require("./resolvers/Group"));
const merge_1 = require("@graphql-tools/merge");
const Organization_1 = __importDefault(require("./resolvers/Organization"));
exports.typeDefs = (0, apollo_server_1.gql) `
  # directive @requiredScopes(scopes: [Scopes]) on FIELD_DEFINITION
  # directive @auth on FIELD_DEFINITION

  type Query {
    getOrganizations: [OrganizationMember]
    getOrganization(organizationId: Int!): Organization
    getOrganizationForUser(organizationId: Int!): UserOrganization
    getGroup(groupId: Int!): Group
    getGroupForUser(groupId: Int!): UserGroup
    getEvacuationEvent(evacuationId: Int!): EvacuationEvent
    getInProgressEvacuationEvents: [EvacuationEvent]
    getJoinedEntities: User
  }
  type Mutation {
    resetPassword(email: String!): User
    login(email: String!, password: String!): Auth
    signup(
      email: String!
      phoneNumber: String!
      password: String!
      firstName: String!
      lastName: String!
    ): Auth
    deleteUser: User
    updateUser(
      phoneNumber: String
      password: String
      firstName: String!
      lastName: String!
    ): User
    createGroup(
      organizationId: Int!
      name: String!
      groupNotificationSetting: GroupNotificationSettingInput!
    ): Group
    deleteGroup(groupId: Int!): Group
    updateGroupNotificationOptions(
      groupId: Int!
      groupNotificationSetting: GroupNotificationSettingInput!
    ): GroupNotificationSetting
    inviteUsers(groupId: Int!, users: [InvitedGroupUser]): [GroupMember]
    updateInvite(groupId: Int!, response: String!): GroupMember
    removeMembers(memberIds: [Int]): [GroupMember]
    createEvacuationEvent(groupId: Int!, msg: String!): EvacuationEvent
    updateEvacuationEvent(evacuationId: Int!, status: String!): EvacuationEvent
    createEvacuationEventResponse(
      evacuationId: Int!
      response: String!
    ): EvacuationResponse
    createOrganization(name: String!): Organization
    deleteOrganization(organizationId: Int!): Organization
    inviteToOrganization(
      organizationId: Int!
      users: [InvitedOrganizationUser]
    ): [OrganizationMember]
    updateOrgInvite(organizationId: Int!, status: String!): OrganizationMember

    removeFromOrganization(
      organizationId: Int!
      userIds: [Int]
    ): [OrganizationMember]
    createOrganizationAnnouncement(
      organizationId: Int!
      title: String!
      description: String
    ): Announcement
    deleteOrganizationAnnouncement(announcementId: Int!): Announcement
  }

  type Auth {
    token: String!
    user: User!
  }

  type UserOrganization {
    id: Int!
    name: String!
    members: [OrganizationMember]
    groups: [GroupMember]
  }

  type Organization {
    id: Int!
    name: String!

    members: [OrganizationMember]
    announcements: [Announcement]
    groups: [Group]
  }

  type OrganizationMember {
    id: Int!
    userId: Int!
    organizationId: Int!
    status: String!
    admin: Boolean!

    user: User
    organization: Organization
  }

  type Announcement {
    id: Int!
    title: String!
    date: String!
    description: String
    organizationId: Int!
    createdBy: Int!

    organization: Organization
  }

  type User {
    id: Int!
    email: String!
    phoneNumber: String
    firstName: String
    lastName: String
    passwordHash: String
    accountCreated: Boolean!

    organizations: [OrganizationMember]
    groups: [GroupMember]
    evacuationResponses: [EvacuationResponse]
  }

  input InvitedGroupUser {
    admin: Boolean!
    email: String!
  }

  input InvitedOrganizationUser {
    admin: Boolean!
    email: String!
  }

  type Group {
    id: Int!
    name: String!
    notificationSetting: GroupNotificationSetting

    members: [GroupMember]
    evacuationEvents: [EvacuationEvent]
  }

  type UserGroup {
    id: Int!
    name: String!
    members: [GroupMember]
    evacuationEvents: [EvacuationEvent]
  }

  type GroupMember {
    id: Int!
    userId: Int!
    groupId: Int!
    status: String!
    admin: Boolean!

    group: Group
    user: User
  }
  type GroupNotificationSetting {
    id: Int!
    groupId: Int!
    emailEnabled: Boolean!
    pushEnabled: Boolean!
    smsEnabled: Boolean!
  }
  input GroupNotificationSettingInput {
    emailEnabled: Boolean!
    pushEnabled: Boolean!
    smsEnabled: Boolean!
  }
  type EvacuationEvent {
    id: Int!
    startTime: String!
    endTime: String
    createdBy: Int!
    status: String!
    groupId: Int!
    message: String

    responses: [EvacuationResponse]
  }
  type EvacuationResponse {
    id: Int!
    response: String!
    userId: Int!
    time: String!
    evacuationId: Int!

    user: User
  }

  enum Scopes {
    GROUP_ADMIN
    ORG_ADMIN
  }

  enum MemberInviteStatus {
    ACCEPTED
    PENDING
    DECLINED
  }
`;
exports.resolvers = (0, merge_1.mergeResolvers)([
    Auth_1.default,
    Group_1.default,
    EvacuationEvent_1.default,
    Organization_1.default
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcmVzb2x2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsaURBQW9DO0FBQ3BDLDREQUE0QztBQUM1QyxrRkFBa0U7QUFDbEUsOERBQThDO0FBRTlDLGdEQUFzRDtBQUN0RCw0RUFBNEQ7QUFFL0MsUUFBQSxRQUFRLEdBQUcsSUFBQSxtQkFBRyxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQThNMUIsQ0FBQztBQUVXLFFBQUEsU0FBUyxHQUFHLElBQUEsc0JBQWMsRUFBQztJQUN0QyxjQUFZO0lBQ1osZUFBYTtJQUNiLHlCQUF1QjtJQUN2QixzQkFBb0I7Q0FDckIsQ0FBQyxDQUFDIn0=