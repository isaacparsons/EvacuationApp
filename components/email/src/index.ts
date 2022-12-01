import { Context, SQSBatchResponse, SQSEvent, SQSBatchItemFailure } from "aws-lambda";
import EmailService from "./EmailService";

export const handler = async (event: SQSEvent, context: Context): Promise<SQSBatchResponse> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  const emailService = new EmailService();
  const batchItemFailures: SQSBatchItemFailure[] = [];
  await Promise.all(
    event.Records.map(async (record) => {
      try {
        const { email, subject, message } = JSON.parse(record.body);
        await emailService.sendEmail(email, subject, message);
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
