import { gql } from '@apollo/client';

export const UPDATE_USER = gql`
  mutation Mutation(
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
