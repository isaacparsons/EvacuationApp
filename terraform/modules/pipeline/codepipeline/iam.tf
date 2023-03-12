data "aws_iam_policy_document" "codepipeline_iam_policy_document" {
  statement {
    actions = [
      "iam:PassRole"
    ]
    resources = [
      "*"
    ]
    effect = "Allow"
    condition {
      test     = "StringEqualsIfExists"
      variable = "iam:PassedToService"
      values = ["cloudformation.amazonaws.com",
        "elasticbeanstalk.amazonaws.com",
        "ec2.amazonaws.com",
      "ecs-tasks.amazonaws.com"]
    }
  }

  statement {
    actions = [
      "codecommit:CancelUploadArchive",
      "codecommit:GetBranch",
      "codecommit:GetCommit",
      "codecommit:GetRepository",
      "codecommit:GetUploadArchiveStatus",
      "codecommit:UploadArchive"
    ]
    resources = [
      "*"
    ]
    effect = "Allow"
  }

  statement {
    actions = [
      "codedeploy:CreateDeployment",
      "codedeploy:GetApplication",
      "codedeploy:GetApplicationRevision",
      "codedeploy:GetDeployment",
      "codedeploy:GetDeploymentConfig",
      "codedeploy:RegisterApplicationRevision"
    ]
    resources = [
      "*"
    ]
    effect = "Allow"
  }
  statement {
    actions = [
      "codestar-connections:UseConnection"
    ]
    resources = [
      "*"
    ]
    effect = "Allow"
  }
  statement {
    actions = [
      "elasticbeanstalk:*",
      "ec2:*",
      "elasticloadbalancing:*",
      "autoscaling:*",
      "cloudwatch:*",
      "s3:*",
      "sns:*",
      "cloudformation:*",
      "rds:*",
      "sqs:*",
      "ecs:*"
    ]
    resources = [
      "*"
    ]
    effect = "Allow"
  }
  statement {
    actions = [
      "lambda:InvokeFunction",
      "lambda:ListFunctions"
    ]
    resources = [
      "*"
    ]
    effect = "Allow"
  }
  statement {
    actions = [
      "opsworks:CreateDeployment",
      "opsworks:DescribeApps",
      "opsworks:DescribeCommands",
      "opsworks:DescribeDeployments",
      "opsworks:DescribeInstances",
      "opsworks:DescribeStacks",
      "opsworks:UpdateApp",
      "opsworks:UpdateStack"
    ]
    resources = [
      "*"
    ]
    effect = "Allow"
  }
  statement {
    actions = [
      "cloudformation:CreateStack",
      "cloudformation:DeleteStack",
      "cloudformation:DescribeStacks",
      "cloudformation:UpdateStack",
      "cloudformation:CreateChangeSet",
      "cloudformation:DeleteChangeSet",
      "cloudformation:DescribeChangeSet",
      "cloudformation:ExecuteChangeSet",
      "cloudformation:SetStackPolicy",
      "cloudformation:ValidateTemplate"
    ]
    resources = [
      "*"
    ]
    effect = "Allow"
  }
  statement {
    actions = [
      "codebuild:BatchGetBuilds",
      "codebuild:StartBuild",
      "codebuild:BatchGetBuildBatches",
      "codebuild:StartBuildBatch"
    ]
    resources = [
      "*"
    ]
    effect = "Allow"
  }
  statement {
    actions = [
      "devicefarm:ListProjects",
      "devicefarm:ListDevicePools",
      "devicefarm:GetRun",
      "devicefarm:GetUpload",
      "devicefarm:CreateUpload",
      "devicefarm:ScheduleRun"
    ]
    resources = [
      "*"
    ]
    effect = "Allow"
  }
  statement {
    actions = [
      "servicecatalog:ListProvisioningArtifacts",
      "servicecatalog:CreateProvisioningArtifact",
      "servicecatalog:DescribeProvisioningArtifact",
      "servicecatalog:DeleteProvisioningArtifact",
      "servicecatalog:UpdateProduct"
    ]
    resources = [
      "*"
    ]
    effect = "Allow"
  }
  statement {
    actions = [
      "cloudformation:ValidateTemplate"
    ]
    resources = [
      "*"
    ]
    effect = "Allow"
  }
  statement {
    actions = [
      "ecr:DescribeImages"
    ]
    resources = [
      "*"
    ]
    effect = "Allow"
  }
  statement {
    actions = [
      "states:DescribeExecution",
      "states:DescribeStateMachine",
      "states:StartExecution"
    ]
    resources = [
      "*"
    ]
    effect = "Allow"
  }
  statement {
    actions = [
      "appconfig:StartDeployment",
      "appconfig:StopDeployment",
      "appconfig:GetDeployment"
    ]
    resources = [
      "*"
    ]
    effect = "Allow"
  }
}

resource "aws_iam_policy" "codepipeline_iam_policy" {
  name        = "CodepipelineIamPolicy"
  description = "codepipeline iam policy"

  policy = data.aws_iam_policy_document.codepipeline_iam_policy_document.json
}

resource "aws_iam_role" "codepipeline_iam_role" {
  name        = "CodepipelineRole"
  description = "role for codepipeline"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = ["codepipeline.amazonaws.com", "codebuild.amazonaws.com", "cloudformation.amazonaws.com", "lambda.amazonaws.com"]
        }
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "codepipeline_iam_role_policy_attachment" {
  role       = aws_iam_role.codepipeline_iam_role.name
  policy_arn = aws_iam_policy.codepipeline_iam_policy.arn
}
