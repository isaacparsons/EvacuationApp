#!/bin/bash
cd /home/ubuntu/server/
pm2 start npm --name "app" -- run start 