import os
from .common import *
from decouple import config

DJANGO_MODULE_STR = os.environ.get('DJANGO_MODULE_STR', '')
 
if DJANGO_MODULE_STR.lower() == 'development':
    from .development import*
else:
    from .production import*