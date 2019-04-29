import psycopg2
from decouple import config


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG', default=False, cast=bool)

ALLOWED_HOSTS = [
    config('<HOST_NAME>')
]

# Database

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': config('<DATABASE_NAME>'),
        'USER': config('<DATABASE_USERNAME>'),
        'PASSWORD': config('DATABASE_PASSWORD'),
        'HOST': config('DATABASE_HOSTNAME'),
        'PORT': config('DATABASE_PORTNUMBER'),
    }
}

CORS_ORIGIN_WHITELIST = (
    config('<HOST_NAME>')
)
CORS_ORIGIN_REGEX_WHITELIST = (
    config('<HOST_NAME>')
)

ONELOGIN_CLIENT_ID = config('ONELOGIN_CLIENT_ID')

ONELOGIN_CLIENT_SECRET = config('ONELOGIN_CLIENT_SECRET')

SUBDOMAIN = config('SUBDOMAIN')