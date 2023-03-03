"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_JOINED_ENTITIES = exports.DELETE_USER = exports.UPDATE_USER = exports.SIGNUP = exports.RESET_PASSWORD = exports.LOGIN = void 0;
const apollo_server_core_1 = require("apollo-server-core");
exports.LOGIN = (0, apollo_server_core_1.gql) `
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
exports.RESET_PASSWORD = (0, apollo_server_core_1.gql) `
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
exports.SIGNUP = (0, apollo_server_core_1.gql) `
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
exports.UPDATE_USER = (0, apollo_server_core_1.gql) `
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
exports.DELETE_USER = (0, apollo_server_core_1.gql) `
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
exports.GET_JOINED_ENTITIES = (0, apollo_server_core_1.gql) `
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZXYvZ3FsL2F1dGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkRBQXlDO0FBRTVCLFFBQUEsS0FBSyxHQUFHLElBQUEsd0JBQUcsRUFBQTs7Ozs7Ozs7Ozs7Ozs7Q0FjdkIsQ0FBQztBQUNXLFFBQUEsY0FBYyxHQUFHLElBQUEsd0JBQUcsRUFBQTs7Ozs7Ozs7Ozs7Q0FXaEMsQ0FBQztBQUVXLFFBQUEsTUFBTSxHQUFHLElBQUEsd0JBQUcsRUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0EwQnhCLENBQUM7QUFFVyxRQUFBLFdBQVcsR0FBRyxJQUFBLHdCQUFHLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBb0I3QixDQUFDO0FBRVcsUUFBQSxXQUFXLEdBQUcsSUFBQSx3QkFBRyxFQUFBOzs7Ozs7Ozs7OztDQVc3QixDQUFDO0FBRVcsUUFBQSxtQkFBbUIsR0FBRyxJQUFBLHdCQUFHLEVBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBMEJyQyxDQUFDIn0=