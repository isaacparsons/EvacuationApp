resource "aws_sqs_queue" "email_sqs" {
  name = "email_sqs"
}


resource "aws_lambda_event_source_mapping" "email_lambda_trigger" {
  event_source_arn = "${aws_sqs_queue.email_sqs.arn}"
  function_name    = aws_lambda_function.email_lambda.arn
  enabled          = true
  batch_size       = 10
}
