#!/bin/bash
cd /home/ubuntu/server/
# pm2 delete --silent all
pm2 delete -s app || :