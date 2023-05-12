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


  deployment_group_name = "KRCCodedeployDeploymentGroup"
  codedeploy_name       = "KRCCodedeployApplication"

  codebuild_project_name = "KRCCodebuildProject"
  codepipeline_name      = "KRCPipeline"

  repository_id = "isaacparsons/EvacuationApp"
  branch_name   = "master"
}

module "server" {
  source = "./modules/server"
}


module "frontend" {
  bucket_name = "kiwetinohk-evacuation-app"
  source      = "./modules/frontend"
}
