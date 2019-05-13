import psycopg2
from decouple import config

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG', default=False, cast=bool)

ALLOWED_HOSTS = [
    'localhost',
    'localhost:8000',
    '127.0.0.1:8000',
    '127.0.0.1'
]

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'smartsheets',
        'USER': 'webdevstarjus730',
        'PASSWORD': '',
        'HOST': '127.0.0.1',
        'PORT': '5432',
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
)
ONELOGIN_CLIENT_ID = config('ONELOGIN_CLIENT_ID')

ONELOGIN_CLIENT_SECRET = config('ONELOGIN_CLIENT_SECRET')

SUBDOMAIN = config('SUBDOMAIN')