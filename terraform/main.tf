terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.0.0"
    }
  }

  # required_version = "~> 1.2.9"
}

provider "aws" {
  region = var.aws_region
}


module "pipeline" {
  source       = "./modules/pipeline"
  ec2_tag_name = module.server.ec2_tag_name


  deployment_group_name = "TestCodedeployDeploymentGroup"
  codedeploy_name       = "TestCodedeployApplication"

  codebuild_project_name = "TestCodebuildProject"
  codepipeline_name      = "TestPipeline"

  repository_id = "isaacparsons/EvacuationApp"
  branch_name   = "master"
}

module "server" {
  source = "./modules/server"
}


# module "frontend" {
#   bucket_name = "kiwetinohk-evacuation-app"
#   source      = "./modules/frontend"
# }
