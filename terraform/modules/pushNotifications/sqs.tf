resource "aws_sqs_queue" "push_notifications_sqs" {
  name = "push_notifications_sqs"
}


resource "aws_lambda_event_source_mapping" "push_notifications_lambda_trigger" {
  event_source_arn = "${aws_sqs_queue.push_notifications_sqs.arn}"
  function_name    = aws_lambda_function.push_notifications_lambda.arn
  enabled          = true
  batch_size       = 10
}
