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


module "server" {
  source = "./modules/server"
}

# module "frontend" {
#   source = "./modules/frontend"
# }
