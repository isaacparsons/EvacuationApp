
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
