# ops_api

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

- Or you can run it by using gunicorn

gunicorn --bind 0.0.0.0:8000 -k gevent ops_api.wsgi
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

- Update values with proper values (based on dev_env.list file)

You should replace `ONELOGIN_CLIENT_ID`, `ONELOGIN_CLIENT_SECRET`, `ONELOGIN_REGION` and `ONELOGIN_CLIENT_SUBDOMAIN`  variables from onelongin admin account.

`FRONTEND_URL` is used for setting frontend url of the app for redirection when login with onelogin saml.

### Running with Docker Compose

- In order to build and run both containers execute:

```
docker-compose up --build -d
```

This will bring up _ops_api_ and _ops_db_.

- Check the status of all containers

```
docker-compose ps
```

This will show something similar to the following:

```
Name                      Command               State           Ports
-------------------------------------------------------------------------------------
ops_api       /usr/src/app/local_entrypo...    Up      0.0.0.0:8000->8000/tcp
ops_db        docker-entrypoint.sh postgres    Up      0.0.0.0:5432->5432/tcp
```


- In order to check the logs you can use *docker-compose logs [ container ]* where container is optional:

```
docker-compose logs ops_api               # check only ops_api logs
docker-compose logs                      # check all containers logs
```

- Once you are done, just stop all containers

```
docker-compose down
```

