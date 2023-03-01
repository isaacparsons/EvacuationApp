// import {gql} from '../__generated__/gql';
// // import {gql} from '@apollo/client';
// export const GET_EVACUATION_EVENTS = gql(/* GraphQL */ `
//   query GetEvacuationEvents($groupId: Int!, $cursor: Int) {
//     getEvacuationEvents(groupId: $groupId, cursor: $cursor) {
//       cursor
//       data {
//         createdBy
//         endTime
//         groupId
//         id
//         message
//         startTime
//         status
//       }
//     }
//   }
// `);
// export const GET_EVACUATION_EVENT = gql(/* GraphQL */ `
//   query getEvacuationEvent($evacuationId: Int!) {
//     getEvacuationEvent(evacuationId: $evacuationId) {
//       id
//       startTime
//       endTime
//       message
//       createdBy
//       status
//       groupId
//       responses {
//         id
//         evacuationId
//         response
//         userId
//         time
//         user {
//           id
//           accountCreated
//           email
//           firstName
//           lastName
//         }
//       }
//     }
//   }
// `);
// export const GET_IN_PROGRESS_EVACUATION_EVENTS = gql(/* GraphQL */ `
//   query GetInProgressEvacuationEvents {
//     getInProgressEvacuationEvents {
//       createdBy
//       endTime
//       groupId
//       id
//       message
//       startTime
//       status
//     }
//   }
// `);
// export const CREATE_EVACUATION_EVENT = gql(/* GraphQL */ `
//   mutation createEvacuationEvent($groupId: Int!, $msg: String!) {
//     createEvacuationEvent(groupId: $groupId, msg: $msg) {
//       id
//       startTime
//       createdBy
//       endTime
//       message
//       status
//       groupId
//     }
//   }
// `);
// export const CREATE_EVACUATION_EVENT_RESPONSE = gql(/* GraphQL */ `
//   mutation createEvacuationEventResponse(
//     $evacuationId: Int!
//     $response: String!
//   ) {
//     createEvacuationEventResponse(
//       evacuationId: $evacuationId
//       response: $response
//     ) {
//       id
//       response
//       userId
//       time
//       evacuationId
//     }
//   }
// `);
// export const UPDATE_EVACUATION_EVENT = gql(/* GraphQL */ `
//   mutation updateEvacuationEvent($evacuationId: Int!, $status: String!) {
//     updateEvacuationEvent(evacuationId: $evacuationId, status: $status) {
//       id
//       startTime
//       createdBy
//       status
//       groupId
//     }
//   }
// `);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZhY3VhdGlvbkV2ZW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZXYvZ3FsL2V2YWN1YXRpb25FdmVudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsNENBQTRDO0FBRTVDLHlDQUF5QztBQUV6QywyREFBMkQ7QUFDM0QsOERBQThEO0FBQzlELGdFQUFnRTtBQUNoRSxlQUFlO0FBQ2YsZUFBZTtBQUNmLG9CQUFvQjtBQUNwQixrQkFBa0I7QUFDbEIsa0JBQWtCO0FBQ2xCLGFBQWE7QUFDYixrQkFBa0I7QUFDbEIsb0JBQW9CO0FBQ3BCLGlCQUFpQjtBQUNqQixVQUFVO0FBQ1YsUUFBUTtBQUNSLE1BQU07QUFDTixNQUFNO0FBRU4sMERBQTBEO0FBQzFELG9EQUFvRDtBQUNwRCx3REFBd0Q7QUFDeEQsV0FBVztBQUNYLGtCQUFrQjtBQUNsQixnQkFBZ0I7QUFDaEIsZ0JBQWdCO0FBQ2hCLGtCQUFrQjtBQUNsQixlQUFlO0FBQ2YsZ0JBQWdCO0FBQ2hCLG9CQUFvQjtBQUNwQixhQUFhO0FBQ2IsdUJBQXVCO0FBQ3ZCLG1CQUFtQjtBQUNuQixpQkFBaUI7QUFDakIsZUFBZTtBQUNmLGlCQUFpQjtBQUNqQixlQUFlO0FBQ2YsMkJBQTJCO0FBQzNCLGtCQUFrQjtBQUNsQixzQkFBc0I7QUFDdEIscUJBQXFCO0FBQ3JCLFlBQVk7QUFDWixVQUFVO0FBQ1YsUUFBUTtBQUNSLE1BQU07QUFDTixNQUFNO0FBRU4sdUVBQXVFO0FBQ3ZFLDBDQUEwQztBQUMxQyxzQ0FBc0M7QUFDdEMsa0JBQWtCO0FBQ2xCLGdCQUFnQjtBQUNoQixnQkFBZ0I7QUFDaEIsV0FBVztBQUNYLGdCQUFnQjtBQUNoQixrQkFBa0I7QUFDbEIsZUFBZTtBQUNmLFFBQVE7QUFDUixNQUFNO0FBQ04sTUFBTTtBQUVOLDZEQUE2RDtBQUM3RCxvRUFBb0U7QUFDcEUsNERBQTREO0FBQzVELFdBQVc7QUFDWCxrQkFBa0I7QUFDbEIsa0JBQWtCO0FBQ2xCLGdCQUFnQjtBQUNoQixnQkFBZ0I7QUFDaEIsZUFBZTtBQUNmLGdCQUFnQjtBQUNoQixRQUFRO0FBQ1IsTUFBTTtBQUNOLE1BQU07QUFFTixzRUFBc0U7QUFDdEUsNENBQTRDO0FBQzVDLDBCQUEwQjtBQUMxQix5QkFBeUI7QUFDekIsUUFBUTtBQUNSLHFDQUFxQztBQUNyQyxvQ0FBb0M7QUFDcEMsNEJBQTRCO0FBQzVCLFVBQVU7QUFDVixXQUFXO0FBQ1gsaUJBQWlCO0FBQ2pCLGVBQWU7QUFDZixhQUFhO0FBQ2IscUJBQXFCO0FBQ3JCLFFBQVE7QUFDUixNQUFNO0FBQ04sTUFBTTtBQUVOLDZEQUE2RDtBQUM3RCw0RUFBNEU7QUFDNUUsNEVBQTRFO0FBQzVFLFdBQVc7QUFDWCxrQkFBa0I7QUFDbEIsa0JBQWtCO0FBQ2xCLGVBQWU7QUFDZixnQkFBZ0I7QUFDaEIsUUFBUTtBQUNSLE1BQU07QUFDTixNQUFNIn0=