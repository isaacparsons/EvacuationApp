import { Context, SQSBatchResponse, SQSEvent, SQSBatchItemFailure } from "aws-lambda";
import PushNotificationService from "./PushNotificationsService";

const lambdaHandler = async (event: SQSEvent, context: Context): Promise<SQSBatchResponse> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  const pushNotificationService = new PushNotificationService();
  const batchItemFailures: SQSBatchItemFailure[] = [];
  await Promise.all(
    event.Records.map(async (record) => {
      try {
        const { userIds, message } = JSON.parse(record.body);
        await pushNotificationService.sendNotifications(userIds, message);
      } catch (error) {
        batchItemFailures.push({ itemIdentifier: record.messageId });
        console.log(error);
      }
    })
  );
  return {
    batchItemFailures,
  };
};

export default lambdaHandler;
