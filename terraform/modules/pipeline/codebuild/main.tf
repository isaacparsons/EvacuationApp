

resource "aws_codebuild_project" "CodeBuild_Project" {
  name         = var.codebuild_project_name
  service_role = aws_iam_role.codebuild_iam_role.arn

  artifacts {
    name                   = var.codebuild_project_name
    override_artifact_name = false
    packaging              = "NONE"
    type                   = "CODEPIPELINE"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/standard:6.0"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"
    privileged_mode             = true
  }

  logs_config {
    cloudwatch_logs {
      status      = "ENABLED"
      group_name  = aws_cloudwatch_log_group.codebuild_terraform_pipeline_log_group.name
      stream_name = aws_cloudwatch_log_stream.codebuild_terraform_pipeline_stream.name
    }
  }

  source {
    git_clone_depth = 0
    type            = "CODEPIPELINE"
    buildspec       = "components/server/buildspec.yml"
  }
}
