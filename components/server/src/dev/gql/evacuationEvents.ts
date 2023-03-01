import { gql } from "apollo-server-core";

gql;
export const GET_EVACUATION_EVENTS = gql`
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

export const GET_EVACUATION_EVENT = gql`
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

export const GET_IN_PROGRESS_EVACUATION_EVENTS = gql`
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

export const CREATE_EVACUATION_EVENT = gql`
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

export const CREATE_EVACUATION_EVENT_RESPONSE = gql`
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

export const UPDATE_EVACUATION_EVENT = gql`
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
