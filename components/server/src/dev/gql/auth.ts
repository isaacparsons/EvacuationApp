import { gql } from "apollo-server-core";

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        accountCreated
        email
        phoneNumber
        firstName
        lastName
        id
      }
    }
  }
`;
export const RESET_PASSWORD = gql`
  mutation ResetPassword($email: String!) {
    resetPassword(email: $email) {
      accountCreated
      email
      phoneNumber
      firstName
      lastName
      id
    }
  }
`;

export const SIGNUP = gql`
  mutation Signup(
    $email: String!
    $phoneNumber: String!
    $password: String!
    $firstName: String!
    $lastName: String!
  ) {
    signup(
      email: $email
      phoneNumber: $phoneNumber
      password: $password
      firstName: $firstName
      lastName: $lastName
    ) {
      token
      user {
        email
        accountCreated
        phoneNumber
        firstName
        lastName
        id
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $phoneNumber: String
    $password: String
    $firstName: String
    $lastName: String
  ) {
    updateUser(
      phoneNumber: $phoneNumber
      password: $password
      firstName: $firstName
      lastName: $lastName
    ) {
      id
      email
      phoneNumber
      firstName
      lastName
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser {
    deleteUser {
      id
      email
      phoneNumber
      accountCreated
      firstName
      lastName
    }
  }
`;

export const GET_JOINED_ENTITIES = gql`
  query GetJoinedEntities {
    getJoinedEntities {
      groups {
        admin
        group {
          id
          name
        }
        groupId
        id
        organizationMemberId
        userId
      }
      organizations {
        admin
        id
        organization {
          id
          name
        }
        organizationId
        status
      }
    }
  }
`;
