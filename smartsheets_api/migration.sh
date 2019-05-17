#!/bin/sh

python /usr/src/app/manage.py makemigrations
python /usr/src/app/manage.py migrate
