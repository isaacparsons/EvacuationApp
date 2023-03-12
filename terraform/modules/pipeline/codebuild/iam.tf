data "aws_iam_policy_document" "codebuild_iam_policy_document" {
  statement {
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = [
      "${aws_cloudwatch_log_group.codebuild_terraform_pipeline_log_group.arn}",
      "${aws_cloudwatch_log_group.codebuild_terraform_pipeline_log_group.arn}:*"
    ]
    effect = "Allow"
  }

  statement {
    actions = [
      "codebuild:CreateReportGroup",
      "codebuild:CreateReport",
      "codebuild:UpdateReport",
      "codebuild:BatchPutTestCases",
      "codebuild:BatchPutCodeCoverages"
    ]
    resources = [
      "*"
    ]
    effect = "Allow"
  }

  statement {
    actions = [
      "s3:PutObject",
      "s3:GetObject",
      "s3:GetObjectVersion",
      "s3:GetBucketAcl",
      "s3:GetBucketLocation"
    ]
    resources = [
      "*"
    ]
    effect = "Allow"
  }
}

resource "aws_iam_policy" "codebuild_iam_policy" {
  name        = "CodebuildIamPolicy"
  description = "codebuild iam policy"

  policy = data.aws_iam_policy_document.codebuild_iam_policy_document.json
}

resource "aws_iam_role" "codebuild_iam_role" {
  name        = "CodebuildRole"
  description = "role for codebuild"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "codebuild.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "codebuild_iam_role_policy_attachment" {
  role       = aws_iam_role.codebuild_iam_role.name
  policy_arn = aws_iam_policy.codebuild_iam_policy.arn
}
