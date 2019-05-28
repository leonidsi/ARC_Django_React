#!/bin/sh

echo "Running migrations"
sh migration.sh
echo "Collecting static files"
python manage.py collectstatic --noinput
echo "Running server"
gunicorn --reload --workers=4 --worker-class gevent --bind=0.0.0.0:8000 smartsheets_api.wsgi
