#!/bin/sh

python /usr/src/app/manage.py makemigrations
python /usr/src/app/manage.py migrate
echo "Creating roles"
python manage.py loaddata apps/role/fixtures/role.json
echo "Creating users"
python manage.py loaddata apps/authentication/fixtures/authentication.json
echo "Creating Sales Executive"
python manage.py loaddata apps/account_manager/fixtures/account_manager.json
echo "Creating naics_code"
python manage.py loaddata apps/naics_code/fixtures/naics_code.json
echo "Creating clients"
python manage.py loaddata apps/client/fixtures/client.json
echo "Creating OtherProvider"
python manage.py loaddata apps/other_provider/fixtures/other_provider.json
echo "Creating project manager"
python manage.py loaddata apps/project_manager/fixtures/project_manager.json
echo "Creating project status"
python manage.py loaddata apps/project_status/fixtures/project_status.json
echo "Creating project types"
python manage.py loaddata apps/project_type/fixtures/project_type.json
echo "Creating server"
python manage.py loaddata apps/server/fixtures/server.json
echo "Creating toolkit tier"
python manage.py loaddata apps/toolkit_tier/fixtures/toolkit_tier.json
echo "Creating project"
python manage.py loaddata apps/project/fixtures/project.json