
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.0.0"
    }
  }
}

provider "aws" {
  region                      = "us-east-1"
  access_key                  = "access_key"
  secret_key                  = "secret_key"
  skip_credentials_validation = true
  skip_requesting_account_id  = true
  skip_metadata_api_check     = true
  endpoints {
    lambda     = "${var.localhost}:4566"
    cloudwatch = "${var.localhost}:4566"
    iam        = "${var.localhost}:4566"
    sqs        = "${var.localhost}:4566"
  }
}



module "push_notifications" {
  source = "../../terraform/modules/pushNotifications"
  region="us-east-1"
}

module "email" {
  source = "../../terraform/modules/email"
  region="us-east-1"
}

# module "server" {
#   source = "../../terraform/modules/server"
# }