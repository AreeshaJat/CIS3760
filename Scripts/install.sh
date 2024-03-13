#!/bin/bash

sudo apt-get update
sudo apt-get upgrade
sudo apt install python3
sudo apt install pip3
sudo apt install nginx
sudo apt install nodejs
sudo apt install python3.8-venv
sudo apt install openssl
sudo apt-get install -y ca-certificates
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt
sudo openssl dhparam -out /etc/nginx/dhparam.pem 4096
