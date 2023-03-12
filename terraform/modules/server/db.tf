
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
