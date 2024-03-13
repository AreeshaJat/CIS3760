#!/bin/bash

cd /var/www/localAppIntegration/client-2
sudo npm run build
cd /var/www/localAppIntegration/flask-2
sudo systemctl restart nginx
gunicorn -w 3 webpage:app
