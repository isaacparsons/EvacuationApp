import { Context } from "../context";
export declare const getEvacuationEvents: (data: {
  context: Context;
  groupId: number;
  cursor?: number | null;
}) => Promise<{
  data: import(".prisma/client").EvacuationEvent[];
  cursor: number | null | undefined;
}>;
export declare const getEvacuationEvent: (data: {
  context: Context;
  evacuationId: number;
}) => Promise<
  import(".prisma/client").EvacuationEvent & {
    responses: (import(".prisma/client").EvacuationResponse & {
      user: import(".prisma/client").User;
    })[];
  }
>;
export declare const getInProgressEvacuationEvents: (data: {
  context: Context;
}) => Promise<import(".prisma/client").EvacuationEvent[]>;
export declare const createEvent: (data: {
  context: Context;
  groupId: number;
  msg: string;
}) => Promise<import(".prisma/client").EvacuationEvent>;
export declare const updateEvent: (event: {
  context: Context;
  evacuationId: number;
  status: string;
}) => Promise<import(".prisma/client").EvacuationEvent>;
export declare const createEventResponse: (data: {
  context: Context;
  evacuationId: number;
  response: string;
}) => Promise<import(".prisma/client").EvacuationResponse>;
