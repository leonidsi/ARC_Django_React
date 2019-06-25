import pytest

from django.core.management import call_command
from django.urls import reverse
from django.utils.encoding import smart_text

from rest_framework.test import APIClient, APITestCase
from rest_framework import status

import os

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
            'project_status.json',
        	'project_type.json', 
        	'role.json',
            'server.json',
            'toolkit_tier.json'
    	)

@pytest.mark.django_db
def get_header():
    client = APIClient()
    url = reverse('SSOLogin')
    data = {
        'email': os.environ.get('ONELOGIN_EMAIL', ''),              #use onelogin email
        'password': os.environ.get('ONELOGIN_PASSWORD', '')         #use onelogin password
    }
    response = client.post(url, data, format='json')
    token = smart_text(response.data['token'])
    headers={
        'HTTP_AUTHORIZATION': 'Bearer '+ token
    }
    return headers