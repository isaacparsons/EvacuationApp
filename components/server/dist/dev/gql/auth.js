// // import {gql} from '../__generated__/gql';
// gql
// // import {gql} from '@apollo/client';
// export const LOGIN = gql(/* GraphQL */ `
//   mutation Login($email: String!, $password: String!) {
//     login(email: $email, password: $password) {
//       token
//       user {
//         accountCreated
//         email
//         phoneNumber
//         firstName
//         lastName
//         id
//       }
//     }
//   }
// `);
// export const SIGNUP = gql(/* GraphQL */ `
//   mutation Signup(
//     $email: String!
//     $phoneNumber: String!
//     $password: String!
//     $firstName: String!
//     $lastName: String!
//   ) {
//     signup(
//       email: $email
//       phoneNumber: $phoneNumber
//       password: $password
//       firstName: $firstName
//       lastName: $lastName
//     ) {
//       token
//       user {
//         email
//         accountCreated
//         phoneNumber
//         firstName
//         lastName
//         id
//       }
//     }
//   }
// `);
// export const UPDATE_USER = gql(/* GraphQL */ `
//   mutation UpdateUser(
//     $phoneNumber: String
//     $password: String
//     $firstName: String
//     $lastName: String
//   ) {
//     updateUser(
//       phoneNumber: $phoneNumber
//       password: $password
//       firstName: $firstName
//       lastName: $lastName
//     ) {
//       id
//       email
//       phoneNumber
//       firstName
//       lastName
//     }
//   }
// `);
// export const DELETE_USER = gql(/* GraphQL */ `
//   mutation DeleteUser {
//     deleteUser {
//       id
//       email
//       phoneNumber
//       accountCreated
//       firstName
//       lastName
//     }
//   }
// `);
// export const GET_JOINED_ENTITIES = gql(/* GraphQL */ `
//   query GetJoinedEntities {
//     getJoinedEntities {
//       groups {
//         admin
//         group {
//           id
//           name
//         }
//         groupId
//         id
//         organizationMemberId
//         userId
//       }
//       organizations {
//         admin
//         id
//         organization {
//           id
//           name
//         }
//         organizationId
//         status
//       }
//     }
//   }
// `);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZXYvZ3FsL2F1dGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsK0NBQStDO0FBQy9DLE1BQU07QUFFTix5Q0FBeUM7QUFFekMsMkNBQTJDO0FBQzNDLDBEQUEwRDtBQUMxRCxrREFBa0Q7QUFDbEQsY0FBYztBQUNkLGVBQWU7QUFDZix5QkFBeUI7QUFDekIsZ0JBQWdCO0FBQ2hCLHNCQUFzQjtBQUN0QixvQkFBb0I7QUFDcEIsbUJBQW1CO0FBQ25CLGFBQWE7QUFDYixVQUFVO0FBQ1YsUUFBUTtBQUNSLE1BQU07QUFDTixNQUFNO0FBRU4sNENBQTRDO0FBQzVDLHFCQUFxQjtBQUNyQixzQkFBc0I7QUFDdEIsNEJBQTRCO0FBQzVCLHlCQUF5QjtBQUN6QiwwQkFBMEI7QUFDMUIseUJBQXlCO0FBQ3pCLFFBQVE7QUFDUixjQUFjO0FBQ2Qsc0JBQXNCO0FBQ3RCLGtDQUFrQztBQUNsQyw0QkFBNEI7QUFDNUIsOEJBQThCO0FBQzlCLDRCQUE0QjtBQUM1QixVQUFVO0FBQ1YsY0FBYztBQUNkLGVBQWU7QUFDZixnQkFBZ0I7QUFDaEIseUJBQXlCO0FBQ3pCLHNCQUFzQjtBQUN0QixvQkFBb0I7QUFDcEIsbUJBQW1CO0FBQ25CLGFBQWE7QUFDYixVQUFVO0FBQ1YsUUFBUTtBQUNSLE1BQU07QUFDTixNQUFNO0FBRU4saURBQWlEO0FBQ2pELHlCQUF5QjtBQUN6QiwyQkFBMkI7QUFDM0Isd0JBQXdCO0FBQ3hCLHlCQUF5QjtBQUN6Qix3QkFBd0I7QUFDeEIsUUFBUTtBQUNSLGtCQUFrQjtBQUNsQixrQ0FBa0M7QUFDbEMsNEJBQTRCO0FBQzVCLDhCQUE4QjtBQUM5Qiw0QkFBNEI7QUFDNUIsVUFBVTtBQUNWLFdBQVc7QUFDWCxjQUFjO0FBQ2Qsb0JBQW9CO0FBQ3BCLGtCQUFrQjtBQUNsQixpQkFBaUI7QUFDakIsUUFBUTtBQUNSLE1BQU07QUFDTixNQUFNO0FBRU4saURBQWlEO0FBQ2pELDBCQUEwQjtBQUMxQixtQkFBbUI7QUFDbkIsV0FBVztBQUNYLGNBQWM7QUFDZCxvQkFBb0I7QUFDcEIsdUJBQXVCO0FBQ3ZCLGtCQUFrQjtBQUNsQixpQkFBaUI7QUFDakIsUUFBUTtBQUNSLE1BQU07QUFDTixNQUFNO0FBRU4seURBQXlEO0FBQ3pELDhCQUE4QjtBQUM5QiwwQkFBMEI7QUFDMUIsaUJBQWlCO0FBQ2pCLGdCQUFnQjtBQUNoQixrQkFBa0I7QUFDbEIsZUFBZTtBQUNmLGlCQUFpQjtBQUNqQixZQUFZO0FBQ1osa0JBQWtCO0FBQ2xCLGFBQWE7QUFDYiwrQkFBK0I7QUFDL0IsaUJBQWlCO0FBQ2pCLFVBQVU7QUFDVix3QkFBd0I7QUFDeEIsZ0JBQWdCO0FBQ2hCLGFBQWE7QUFDYix5QkFBeUI7QUFDekIsZUFBZTtBQUNmLGlCQUFpQjtBQUNqQixZQUFZO0FBQ1oseUJBQXlCO0FBQ3pCLGlCQUFpQjtBQUNqQixVQUFVO0FBQ1YsUUFBUTtBQUNSLE1BQU07QUFDTixNQUFNIn0=