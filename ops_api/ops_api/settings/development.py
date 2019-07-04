import psycopg2
from decouple import config
import os

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG', True)

ALLOWED_HOSTS = [
    'localhost',
    'localhost:8000',
    '127.0.0.1:8000',
    '127.0.0.1',
    'testserver',
]

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': os.environ.get('DB_NAME', 'ops'),
        'USER': os.environ.get('DB_USER', ''),
        'PASSWORD': os.environ.get('DB_PASSWORD', ''),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', 5432),
    }
}

CORS_ORIGIN_ALLOW_ALL = True

CORS_ORIGIN_WHITELIST = (
    'http://localhost:8000',
    'http://127.0.0.1:8000',
)

CORS_ORIGIN_REGEX_WHITELIST = (
    'localhost:8000',
)
ONELOGIN_CLIENT_ID = os.environ.get('ONELOGIN_CLIENT_ID', '')

ONELOGIN_CLIENT_SECRET = os.environ.get('ONELOGIN_CLIENT_SECRET', '')

SUBDOMAIN = os.environ.get('ONELOGIN_CLIENT_SUBDOMAIN', '')
