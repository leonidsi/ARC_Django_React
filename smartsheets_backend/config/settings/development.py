import psycopg2
from decouple import config
import os

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG', default=False, cast=bool)

ALLOWED_HOSTS = [
    'localhost',
    'localhost:8000',
    '127.0.0.1:8000',
    '127.0.0.1'
    'testserver',
]

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': os.environ.get('DB_NAME', 'smartsheets'),
        'USER': os.environ.get('DB_USER', 'admin'),
        'PASSWORD': os.environ.get('DB_PASSWORD', ''),
        'HOST': '127.0.0.1',
        'PORT': os.environ.get('DB_PORT', 5432),
    }
}

CORS_ORIGIN_WHITELIST = (
    # 'localhost:8000',
    # '127.0.0.1:8000',
    # '127.0.0.1',
    # 'localhost'
)
CORS_ORIGIN_REGEX_WHITELIST = (
    'localhost:8000',
    '3f5fdd10.ngrok.io'
)
ONELOGIN_CLIENT_ID = config('ONELOGIN_CLIENT_ID')

ONELOGIN_CLIENT_SECRET = config('ONELOGIN_CLIENT_SECRET')

SUBDOMAIN = config('SUBDOMAIN')