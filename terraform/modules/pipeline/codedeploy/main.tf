resource "aws_codedeploy_app" "codedeploy_application" {
  name = var.codedeploy_name
}

resource "aws_codedeploy_deployment_group" "codedeploy_deployment_group" {
  app_name              = aws_codedeploy_app.codedeploy_application.name
  deployment_group_name = var.deployment_group_name
  service_role_arn      = aws_iam_role.codedeploy_iam_role.arn

  ec2_tag_set {
    ec2_tag_filter {
      key   = "Name"
      type  = "KEY_AND_VALUE"
      value = var.ec2_tag_name
    }
  }

  auto_rollback_configuration {
    enabled = true
    events  = ["DEPLOYMENT_FAILURE"]
  }
}
