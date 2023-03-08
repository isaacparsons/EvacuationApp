#!/bin/bash
cd /home/ubuntu/server/
npm install -g prisma
npm run migrate-prod

cd /home/ubuntu/server/client
aws s3 cp build s3://kiwetinohk-evacuation-app --recursive