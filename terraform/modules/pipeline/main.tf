module "codestar" {
  source = "./codestar"
}

module "codedeploy" {
  source                = "./codedeploy"
  ec2_tag_name          = var.ec2_tag_name
  deployment_group_name = var.deployment_group_name
  codedeploy_name       = var.codedeploy_name
}

module "codebuild" {
  source                 = "./codebuild"
  codebuild_project_name = var.codebuild_project_name
}

module "codepipeline" {
  source            = "./codepipeline"
  codepipeline_name = var.codepipeline_name
  codestar_arn      = module.codestar.codestar_arn
  repository_id     = var.repository_id
  branch_name       = var.branch_name

  s3_bucket_name         = aws_s3_bucket.codepipeline_terraform_s3_bucket.bucket
  codebuild_project_name = module.codebuild.codebuild_project_name

  deployment_group_name       = module.codedeploy.deployment_group_name
  codedeploy_application_name = module.codedeploy.codedeploy_application_name
}

