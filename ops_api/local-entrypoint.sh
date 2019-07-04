#!/bin/sh

echo "Running migrations"
sh migration.sh
echo "Running server"
gunicorn --reload --workers=4 --worker-class gevent --bind=0.0.0.0:8000 ops_api.wsgi
