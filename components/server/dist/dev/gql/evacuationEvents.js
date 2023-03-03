"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPDATE_EVACUATION_EVENT = exports.CREATE_EVACUATION_EVENT_RESPONSE = exports.CREATE_EVACUATION_EVENT = exports.GET_IN_PROGRESS_EVACUATION_EVENTS = exports.GET_EVACUATION_EVENT = exports.GET_EVACUATION_EVENTS = void 0;
const apollo_server_core_1 = require("apollo-server-core");
apollo_server_core_1.gql;
exports.GET_EVACUATION_EVENTS = (0, apollo_server_core_1.gql) `
  query GetEvacuationEvents($groupId: Int!, $cursor: Int) {
    getEvacuationEvents(groupId: $groupId, cursor: $cursor) {
      cursor
      data {
        createdBy
        endTime
        groupId
        id
        message
        startTime
        status
      }
    }
  }
`;
exports.GET_EVACUATION_EVENT = (0, apollo_server_core_1.gql) `
  query getEvacuationEvent($evacuationId: Int!) {
    getEvacuationEvent(evacuationId: $evacuationId) {
      id
      startTime
      endTime
      message
      createdBy
      status
      groupId
      responses {
        id
        evacuationId
        response
        userId
        time
        user {
          id
          accountCreated
          email
          firstName
          lastName
        }
      }
    }
  }
`;
exports.GET_IN_PROGRESS_EVACUATION_EVENTS = (0, apollo_server_core_1.gql) `
  query GetInProgressEvacuationEvents {
    getInProgressEvacuationEvents {
      createdBy
      endTime
      groupId
      id
      message
      startTime
      status
    }
  }
`;
exports.CREATE_EVACUATION_EVENT = (0, apollo_server_core_1.gql) `
  mutation createEvacuationEvent($groupId: Int!, $msg: String!) {
    createEvacuationEvent(groupId: $groupId, msg: $msg) {
      id
      startTime
      createdBy
      endTime
      message
      status
      groupId
    }
  }
`;
exports.CREATE_EVACUATION_EVENT_RESPONSE = (0, apollo_server_core_1.gql) `
  mutation createEvacuationEventResponse($evacuationId: Int!, $response: String!) {
    createEvacuationEventResponse(evacuationId: $evacuationId, response: $response) {
      id
      response
      userId
      time
      evacuationId
    }
  }
`;
exports.UPDATE_EVACUATION_EVENT = (0, apollo_server_core_1.gql) `
  mutation updateEvacuationEvent($evacuationId: Int!, $status: String!) {
    updateEvacuationEvent(evacuationId: $evacuationId, status: $status) {
      id
      startTime
      createdBy
      status
      groupId
    }
  }
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZhY3VhdGlvbkV2ZW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZXYvZ3FsL2V2YWN1YXRpb25FdmVudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkRBQXlDO0FBRXpDLHdCQUFHLENBQUM7QUFDUyxRQUFBLHFCQUFxQixHQUFHLElBQUEsd0JBQUcsRUFBQTs7Ozs7Ozs7Ozs7Ozs7O0NBZXZDLENBQUM7QUFFVyxRQUFBLG9CQUFvQixHQUFHLElBQUEsd0JBQUcsRUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0EwQnRDLENBQUM7QUFFVyxRQUFBLGlDQUFpQyxHQUFHLElBQUEsd0JBQUcsRUFBQTs7Ozs7Ozs7Ozs7O0NBWW5ELENBQUM7QUFFVyxRQUFBLHVCQUF1QixHQUFHLElBQUEsd0JBQUcsRUFBQTs7Ozs7Ozs7Ozs7O0NBWXpDLENBQUM7QUFFVyxRQUFBLGdDQUFnQyxHQUFHLElBQUEsd0JBQUcsRUFBQTs7Ozs7Ozs7OztDQVVsRCxDQUFDO0FBRVcsUUFBQSx1QkFBdUIsR0FBRyxJQUFBLHdCQUFHLEVBQUE7Ozs7Ozs7Ozs7Q0FVekMsQ0FBQyJ9