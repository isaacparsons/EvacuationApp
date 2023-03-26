resource "aws_cloudwatch_log_group" "krc_ec2_log_group" {
  name = "logs.log"
}

resource "aws_cloudwatch_log_stream" "krc_ec2_log_stream" {
  name           = aws_instance.backend[0].id
  log_group_name = aws_cloudwatch_log_group.krc_ec2_log_group.name
}
