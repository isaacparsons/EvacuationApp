#!/bin/bash

cd ../terraform

terraform init
terraform apply -auto-approve

BUCKET_NAME = "$(terraform output -raw bucket_name)"

cd ../components/server/client
npm run build


