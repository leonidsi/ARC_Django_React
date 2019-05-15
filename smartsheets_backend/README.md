# smartsheets_api

## Prerequisites

- django = "2.0.5"
- djangorestframework = "3.7.7"
- django-cors-headers = "*"
- psycopg2 = "*"
- pillow = "*"
- django-rest-auth = "*"
- djangorestframework-jwt = "1.11.0"
- django-developer-panel = "*"
- coreapi = "*"
- drf-yasg = "*"
- python3-saml = "*"
- python-decouple = "*"
-

- PostgreSQL(lastest version)
- ("*" means lastest version.)
-

### Installation
```
pipenv shell
pipenv install --dev  # creates virutalenv and installs packages from Pipfile.lock (including dev ones)
```

### Running
```
set -a && source dev_env.list && set +a 	#set environment variables
python manage.py runserver
```
##### Note
If you use this project at the first time, you need to execute the following commands for installation DB.
- python manage.py makemigrations
- python manage.py migrate

## Onelogin Configuration

You need to create following additional user roles.

>[https://[ONELOGIN_SERVER_URL]/api_credentials](https://[ONELOGIN_SERVER_URL]/api_credentials)

- Project Manager
- Account Manager
- Consultant

Default user role for all users is unassigned role.

## Environmental Variables and Values

- Update values with proper values (based on .env file)

You should replace `process.env.ONELOGIN_CLIENT_ID`, `process.env.ONELOGIN_CLIENT_SECRET`, `process.env.ONELOGIN_REGION` and `process.env.ONELOGIN_CLIENT_SUBDOMAIN`  variables from onelongin admin account.

`FRONTEND_URL` is used for setting frontend url of the app for redirection when login with onelogin saml.

