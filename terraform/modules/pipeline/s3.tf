resource "aws_s3_bucket" "codepipeline_terraform_s3_bucket" {
  bucket = "codepipeline-terraform-s3-bucket"
}
resource "aws_s3_bucket_acl" "codepipeline_terraform_bucket_acl" {
  bucket = aws_s3_bucket.codepipeline_terraform_s3_bucket.id
  acl    = "private"
}
