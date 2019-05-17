"""
WSGI config for config project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application
from django.core.management import call_command

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smartsheets_api.settings')

call_command(
	'loaddata', 
	'authentication.json', 
	'client.json', 
	'how_found_pyx.json',
	'naics_code.json', 
    'other_provider.json',
    'project_manager.json',
    'project_status',
	'project_type.json', 
	'role.json',
    'server.json',
    'toolkit_tier.json'
)
application = get_wsgi_application()
