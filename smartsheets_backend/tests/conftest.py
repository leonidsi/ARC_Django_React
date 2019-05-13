import pytest

from django.core.management import call_command

@pytest.fixture(scope='session')
def django_db_setup(django_db_setup, django_db_blocker):
    with django_db_blocker.unblock():
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
        