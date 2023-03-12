
resource "aws_cloudwatch_log_group" "codebuild_terraform_pipeline_log_group" {
  name = "codebuild"
}

resource "aws_cloudwatch_log_stream" "codebuild_terraform_pipeline_stream" {
  name           = "codebuild"
  log_group_name = aws_cloudwatch_log_group.codebuild_terraform_pipeline_log_group.name
}
