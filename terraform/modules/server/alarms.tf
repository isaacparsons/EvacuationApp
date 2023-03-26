resource "aws_cloudwatch_log_metric_filter" "krc_log_error_filter" {
  name           = "LogErrorFilter"
  pattern        = "err"
  log_group_name = aws_cloudwatch_log_group.krc_ec2_log_group.name

  metric_transformation {
    name      = "LogErrors"
    namespace = "Errors"
    value     = "1"
  }
}


resource "aws_cloudwatch_metric_alarm" "krc_logs_errors_alarm" {
  alarm_name                = "krc_log_errors_alarm"
  comparison_operator       = "GreaterThanOrEqualToThreshold"
  evaluation_periods        = 1
  metric_name               = aws_cloudwatch_log_metric_filter.krc_log_error_filter.metric_transformation[0].name
  namespace                 = aws_cloudwatch_log_metric_filter.krc_log_error_filter.metric_transformation[0].namespace
  period                    = 60
  statistic                 = "Sum"
  threshold                 = 10
  alarm_description         = "This metric ec2 logs for errors"
  insufficient_data_actions = []
  actions_enabled           = "true"
  alarm_actions             = [aws_sns_topic.default_cloudWatch_alarms_topic.arn]
}


resource "aws_sns_topic" "default_cloudWatch_alarms_topic" {
  name = "default_cloudWatch_alarms_topic"
}

resource "aws_sns_topic_subscription" "email-target" {
  topic_arn = aws_sns_topic.default_cloudWatch_alarms_topic.arn
  protocol  = "email"
  endpoint  = "isaac.2962@gmail.com"
}


resource "aws_cloudwatch_metric_alarm" "krc_ec2_cpu_alarm" {
  alarm_name                = "krc_ec2_cpu_alarm"
  comparison_operator       = "GreaterThanOrEqualToThreshold"
  evaluation_periods        = 1
  metric_name               = "CPUUtilization"
  namespace                 = "AWS/EC2"
  period                    = 60
  statistic                 = "Average"
  threshold                 = 80
  alarm_description         = "This metric monitors ec2 cpu utilization"
  insufficient_data_actions = []
  actions_enabled           = "true"
  alarm_actions             = [aws_sns_topic.default_cloudWatch_alarms_topic.arn]
}
