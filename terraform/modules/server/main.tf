
# resource "aws_iam_role" "iam_for_backend" {
#   name = "iam_for_backend"

#   assume_role_policy = <<EOF
# {
#   "Version": "2012-10-17",
#   "Statement": [
#     {
#       "Action": "sts:AssumeRole",
#       "Principal": {
#         "Service": "lambda.amazonaws.com"
#       },
#       "Effect": "Allow",
#       "Sid": ""
#     }
#   ]
# }
# EOF
# }

# resource "aws_iam_role_policy_attachment" "backend" {
#   policy_arn = "${aws_iam_policy.backend.arn}"
#   role = "${aws_iam_role.iam_for_backend.name}"
# }

# resource "aws_iam_policy" "backend" {
#   policy = "${data.aws_iam_policy_document.backend.json}"
# }

# data "aws_iam_policy_document" "backend" {
#   statement {
#     sid       = "AllowSQSPermissions"
#     effect    = "Allow"
#     resources = ["arn:aws:sqs:*"]

#     actions = [
#       "sqs:GetQueueUrl",
#       "sqs:ReceiveMessage",
#       "sqs:SendMessage",
#     ]
#   }
# }

data "aws_availability_zones" "available" {
  state = "available"
}


data "aws_ami" "ubuntu" {
  most_recent = "true"

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"]
}

resource "aws_vpc" "evacuation_vpc" {
  cidr_block           = var.vpc_cidr_block
  enable_dns_hostnames = true

  tags = {
    Name = "evacuation_vpc"
  }
}

resource "aws_internet_gateway" "evacuation_igw" {
  vpc_id = aws_vpc.evacuation_vpc.id

  tags = {
    Name = "evacuation_igw"
  }
}

resource "aws_subnet" "public_subnet" {
  count = var.subnet_count.public

  vpc_id = aws_vpc.evacuation_vpc.id

  cidr_block = var.public_subnet_cidr_blocks[count.index]

  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "public_subnet_${count.index}"
  }
}

resource "aws_subnet" "private_subnet" {
  count = var.subnet_count.private

  vpc_id = aws_vpc.evacuation_vpc.id

  cidr_block = var.private_subnet_cidr_blocks[count.index]

  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "private_subnet_${count.index}"
  }
}

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.evacuation_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.evacuation_igw.id
  }
}

resource "aws_route_table_association" "public" {
  count = var.subnet_count.public

  route_table_id = aws_route_table.public_rt.id

  subnet_id = aws_subnet.public_subnet[count.index].id
}

resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.evacuation_vpc.id

}

resource "aws_route_table_association" "private" {
  count = var.subnet_count.private

  route_table_id = aws_route_table.private_rt.id

  subnet_id = aws_subnet.private_subnet[count.index].id
}

resource "aws_security_group" "backend_sg" {
  name        = "backend_sg"
  description = "Security group for backend web servers"
  vpc_id      = aws_vpc.evacuation_vpc.id

  ingress {
    description = "Allow all traffic through HTTP"
    from_port   = "80"
    to_port     = "80"
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow all traffic through HTTP to port 4000"
    from_port   = "4000"
    to_port     = "4000"
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow all traffic through HTTP to port 3000"
    from_port   = "3000"
    to_port     = "3000"
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow all traffic through HTTPs"
    from_port   = "443"
    to_port     = "443"
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow SSH from my computer"
    from_port   = "22"
    to_port     = "22"
    protocol    = "tcp"
    cidr_blocks = ["${var.my_ip}/32"]
  }

  ingress {
    description = "Allow SSH from my computer"
    from_port   = "22"
    to_port     = "22"
    protocol    = "tcp"
    cidr_blocks = ["75.155.25.250/32"]
  }



  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "backend_sg"
  }
}

resource "aws_security_group" "db_sg" {
  name        = "db_sg"
  description = "Security group for databases"
  vpc_id      = aws_vpc.evacuation_vpc.id

  ingress {
    description     = "Allow Postgres traffic from only the backend sg"
    from_port       = "5432"
    to_port         = "5432"
    protocol        = "tcp"
    security_groups = [aws_security_group.backend_sg.id]
  }

  tags = {
    Name = "db_sg"
  }
}

resource "aws_db_subnet_group" "db_subnet_group" {
  // The name and description of the db subnet group
  name        = "db_subnet_group"
  description = "DB subnet group"

  subnet_ids = [for subnet in aws_subnet.private_subnet : subnet.id]
}

resource "aws_db_instance" "database" {
  allocated_storage      = var.settings.database.allocated_storage
  engine                 = var.settings.database.engine
  engine_version         = var.settings.database.engine_version
  instance_class         = var.settings.database.instance_class
  db_name                = var.settings.database.db_name
  username               = var.db_username
  password               = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.db_subnet_group.id
  vpc_security_group_ids = [aws_security_group.db_sg.id]
  skip_final_snapshot    = var.settings.database.skip_final_snapshot
}

resource "aws_key_pair" "tutorial_kp" {
  key_name   = "tutorial_kp"
  public_key = file("${path.module}/tutorial_kp.pub")
}

data "aws_iam_policy_document" "ec2_iam_policy_document" {
  statement {
    actions = [
      "cloudwatch:PutMetricData",
      "ec2:DescribeVolumes",
      "ec2:DescribeTags",
      "logs:PutLogEvents",
      "logs:DescribeLogStreams",
      "logs:DescribeLogGroups",
      "logs:CreateLogStream",
      "logs:CreateLogGroup"
    ]
    resources = [
      "*"
    ]
    effect = "Allow"
  }

  statement {
    sid = "allowListBucket"
    actions = [
      "ssm:GetParameter"
    ]
    resources = [
      "arn:aws:ssm:*:*:parameter/AmazonCloudWatch-*"
    ]
    effect = "Allow"
  }

  statement {
    effect = "Allow"
    actions = [
      "s3:*",
      "s3-object-lambda:*"
    ]
    resources = ["*"]
  }

}

resource "aws_iam_policy" "ec2_iam_policy" {
  name        = "Ec2IamPolicy"
  description = "access to cloudwatch, s3"

  policy = data.aws_iam_policy_document.ec2_iam_policy_document.json
}

resource "aws_iam_role" "ec2_iam_role" {
  name        = "Ec2ServerRole"
  description = "access to cloudwatch, s3"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ec2_iam_role_policy_attachment" {
  role       = aws_iam_role.ec2_iam_role.name
  policy_arn = aws_iam_policy.ec2_iam_policy.arn
}


data "template_file" "user_data" {
  template = file("${path.module}/userdata.sh.tpl")
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "ec2_profile"
  role = aws_iam_role.ec2_iam_role.name
}

resource "aws_instance" "backend" {
  count = var.settings.backend.count
  ami   = data.aws_ami.ubuntu.id

  user_data = data.template_file.user_data.rendered

  iam_instance_profile = aws_iam_instance_profile.ec2_profile.name

  instance_type          = var.settings.backend.instance_type
  subnet_id              = aws_subnet.public_subnet[count.index].id
  key_name               = aws_key_pair.tutorial_kp.key_name
  vpc_security_group_ids = [aws_security_group.backend_sg.id]

  tags = {
    Name = "backend_${count.index}"
  }
}

resource "aws_eip" "backend_eip" {
  count = var.settings.backend.count

  instance = aws_instance.backend[count.index].id

  vpc = true

  tags = {
    Name = "backend_eip_${count.index}"
  }
}

