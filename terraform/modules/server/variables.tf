

variable "vpc_cidr_block" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "subnet_count" {
  description = "Number of subnets"
  type        = map(number)
  default = {
    public  = 1,
    private = 2
  }
}

variable "settings" {
  description = "Configuration settings"
  type        = map(any)
  default = {
    "database" = {
      allocated_storage   = 20            // storage in gigabytes
      engine              = "postgres"    // engine type
      engine_version      = "13"          // engine version
      instance_class      = "db.t3.micro" // rds instance type
      db_name             = "evacuation"  // database name
      skip_final_snapshot = true
    },
    "backend" = {
      count         = 1          // the number of EC2 instances
      instance_type = "t2.micro" // the EC2 instance
    }
  }
}

variable "public_subnet_cidr_blocks" {
  description = "Available CIDR blocks for public subnets"
  type        = list(string)
  default = [
    "10.0.1.0/24",
    "10.0.2.0/24",
    "10.0.3.0/24",
    "10.0.4.0/24"
  ]
}

variable "private_subnet_cidr_blocks" {
  description = "Available CIDR blocks for private subnets"
  type        = list(string)
  default = [
    "10.0.101.0/24",
    "10.0.102.0/24",
    "10.0.103.0/24",
    "10.0.104.0/24",
  ]
}

variable "my_ip" {
  description = "Your IP address"
  type        = string
  # sensitive   = true
  default = "184.64.114.95"
}


variable "db_username" {
  description = "Database master user"
  type        = string
  # sensitive   = true
  default = "username"
}

variable "db_password" {
  description = "Database master user password"
  type        = string
  # sensitive   = true
  default = "password"
}
