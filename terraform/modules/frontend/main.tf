resource "aws_s3_bucket" "frontend" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_website_configuration" "website_config" {
  bucket = aws_s3_bucket.frontend.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_policy" "policy" {
  bucket     = aws_s3_bucket.frontend.id
  depends_on = [aws_s3_bucket_acl.krc_bucket_acl]
  policy     = <<EOF
{
  "Id": "bucket_policy_site",
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "bucket_policy_site_main",
      "Action": [
        "s3:GetObject"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::${var.bucket_name}/*",
      "Principal": "*"
    }
  ]
}
EOF
}

resource "aws_s3_bucket_public_access_block" "krc_public_access_block" {
  bucket = aws_s3_bucket.frontend.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_ownership_controls" "krc_bucket_ownership_controls" {
  bucket = aws_s3_bucket.frontend.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "krc_bucket_acl" {
  depends_on = [
    aws_s3_bucket_public_access_block.krc_public_access_block,
    aws_s3_bucket_ownership_controls.krc_bucket_ownership_controls,
  ]

  bucket = aws_s3_bucket.frontend.id
  acl    = "public-read"
}
