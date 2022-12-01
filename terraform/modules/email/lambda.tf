
resource "aws_lambda_function" "email_lambda" {
  filename         = "${path.module}/email.zip"
  function_name    = "email_lambda"
  role             = aws_iam_role.iam_for_email_lambda.arn
  handler          = "dist/index.handler"

  source_code_hash = filebase64sha256("${path.module}/email.zip")
  runtime          = "nodejs14.x"

  environment {
    variables = {
      EMAIL="evacuationapp1@gmail.com"
      EMAIL_PASSWORD="kndkjasdixqpwwwt"
    }
  }
}

resource "aws_iam_role" "iam_for_email_lambda" {
  name = "iam_for_email_lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "email_lambda" {
  policy_arn = "${aws_iam_policy.email_lambda.arn}"
  role = "${aws_iam_role.iam_for_email_lambda.name}"
}

resource "aws_iam_policy" "email_lambda" {
  policy = "${data.aws_iam_policy_document.email_lambda.json}"
}

data "aws_iam_policy_document" "email_lambda" {
  statement {
    sid       = "AllowSQSPermissions"
    effect    = "Allow"
    resources = ["arn:aws:sqs:*"]

    actions = [
      "sqs:ChangeMessageVisibility",
      "sqs:DeleteMessage",
      "sqs:GetQueueAttributes",
      "sqs:ReceiveMessage",
    ]
  }

  statement {
    sid       = "AllowInvokingLambdas"
    effect    = "Allow"
    resources = ["arn:aws:lambda:${var.region}:*:function:*"]
    actions   = ["lambda:InvokeFunction"]
  }

  statement {
    sid       = "AllowCreatingLogGroups"
    effect    = "Allow"
    resources = ["arn:aws:logs:${var.region}:*:*"]
    actions   = ["logs:CreateLogGroup"]
  }
  statement {
    sid       = "AllowWritingLogs"
    effect    = "Allow"
    resources = ["arn:aws:logs:${var.region}:*:log-group:/aws/lambda/*:*"]

    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
  }
}