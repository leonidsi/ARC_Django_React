import psycopg2
from decouple import config


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG', True)

ALLOWED_HOSTS = [
    os.environ.get('HOST_NAME', 'smartsheets.apps.pyx-int.com')
]

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': os.environ.get('DB_NAME', 'smartsheets'),
        'USER': os.environ.get('DB_USER', 'admin'),
        'PASSWORD': os.environ.get('DB_PASSWORD', ''),
        'HOST': os.environ.get('DB_HOST', ''),
        'PORT': os.environ.get('DB_PORT', 5432),
    }
}

CORS_ORIGIN_WHITELIST = (
    os.environ.get('HOST_NAME', 'smartsheets.apps.pyx-int.com')
)
CORS_ORIGIN_REGEX_WHITELIST = (
    os.environ.get('HOST_NAME', 'smartsheets.apps.pyx-int.com')
)

ONELOGIN_CLIENT_ID = os.environ.get('ONELOGIN_CLIENT_ID', '')

ONELOGIN_CLIENT_SECRET = os.environ.get('ONELOGIN_CLIENT_SECRET', '')

SUBDOMAIN = os.environ.get('SUBDOMAIN', '')