import PushNotificationService from "../PushNotificationsService";
import handler from "../index";
import { SQSEvent, Context } from "aws-lambda";

jest.mock("../PushNotificationsService");
const mockEvent: SQSEvent = {
  Records: [
    {
      messageId: "test-id",
      receiptHandle: "receiptHandle",
      attributes: {
        ApproximateReceiveCount: "1",
        SentTimestamp: "1",
        SenderId: "1",
        ApproximateFirstReceiveTimestamp: "1",
      },
      messageAttributes: {},
      md5OfBody: "md5OfBody",
      eventSource: "source",
      eventSourceARN: "source-arn",
      awsRegion: "us-east-1",
      body: '{"message":"test","userIds":[1]}',
    },
  ],
};

describe("index", () => {
  const mockPushNotificationService = PushNotificationService as jest.Mock;
  const mockSendNotifications = jest.fn();
  it("should parse event, send notification, send empty array for failures", async () => {
    mockSendNotifications.mockReturnValue("success");
    mockPushNotificationService.mockReturnValue({
      sendNotifications: mockSendNotifications,
    });
    await handler(mockEvent, {} as Context);

    expect(mockSendNotifications).toBeCalledWith([1], "test");
  });
  it("should parse event, send array of failures", async () => {
    mockSendNotifications.mockRejectedValue("failure");
    mockPushNotificationService.mockReturnValue({
      sendNotifications: mockSendNotifications,
    });
    const result = await handler(mockEvent, {} as Context);
    expect(result).toEqual({
      batchItemFailures: [{ itemIdentifier: "test-id" }],
    });
  });
});
