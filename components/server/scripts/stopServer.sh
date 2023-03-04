#!/bin/bash
cd /home/ubuntu/server/
# pm2 delete --silent all
pm2 delete all 2> /dev/null
