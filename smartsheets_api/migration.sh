#!/bin/sh

python /usr/src/app/manage.py makemigrations
python /usr/src/app/manage.py migrate
echo "Creating roles"
python manage.py loaddata apps/role/fixtures/role.json
echo "Creating users"
python manage.py loaddata apps/authentication/fixtures/authentication.json
