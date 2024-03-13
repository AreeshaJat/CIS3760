#!/bin/bash

cd /var/www/localAppIntegration/flask-2
sudo systemctl stop nginx
pkill gunicorn
