#!/bin/sh

echo "Running migrations"
sh migration.sh
echo "Creating roles"
python manage.py loaddata apps/role/fixtures/role.json
echo "Creating users"
python manage.py loaddata apps/authentication/fixtures/authentication.json
echo "Collecting static files"
python manage.py collectstatic --noinput
echo "Running server"
gunicorn --reload --workers=4 --worker-class gevent --bind=0.0.0.0:8000 smartsheets_api.wsgi
