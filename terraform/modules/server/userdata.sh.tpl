Content-Type: multipart/mixed; boundary="==BOUNDARY=="
MIME-Version: 1.0

--==BOUNDARY==
Content-Type: text/x-shellscript; charset="us-ascii"
#!/bin/bash

# Install node
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash - &&\
sudo apt-get install -y nodejs

# Install git
sudo apt-get install git

cd /home/ubuntu/

# Install Cloudwatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb

sudo dpkg -i -E ./amazon-cloudwatch-agent.deb


# Write Cloudwatch agent configuration file
sudo chmod 777 /opt/aws/amazon-cloudwatch-agent/bin
sudo cat >> /opt/aws/amazon-cloudwatch-agent/bin/config.json <<EOF
{
  "agent": {
    "run_as_user": "cwagent"
  },
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/home/ubuntu/EvacuationApp/components/server/logs/logs.log",
            "log_group_name": "logs.log",
            "log_stream_name": "{instance_id}",
            "retention_in_days": 14
          }
        ]
      }
    }
  }
}
EOF

# Start Cloudwatch agent
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -s -c file:/opt/aws/amazon-cloudwatch-agent/bin/config.json

# Clone repo
git clone https://isaacparsons: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@github.com/isaacparsons/EvacuationApp.git

cd EvacuationApp/components/server
npm install

# Install pm2
sudo npm install pm2@latest -g

# Start server
pm2 start npm --name "app" -- run start 

--==BOUNDARY==--