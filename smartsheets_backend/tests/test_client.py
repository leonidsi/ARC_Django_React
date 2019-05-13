import pytest

from django.urls import reverse
from django.utils.encoding import smart_text

from decouple import config

from rest_framework.test import APIClient, APITestCase
from rest_framework import status

import os

@pytest.mark.django_db
def get_token():
	client = APIClient()
	url = reverse('SSOLogin')
	data = {
		'email': os.environ.get('ONELOGIN_EMAIL', ''),				#use onelogin email
		'password': os.environ.get('ONELOGIN_PASSWORD', '')			#use onelogin password
	}
	response = client.post(url, data, format='json')
	token = smart_text(response.data['token'])
	return token

class Test_ClientList(APITestCase):
	client = APIClient()
	url = reverse('clients')

	def test_client_list(self):
		token = get_token()
		headers={
			'HTTP_AUTHORIZATION': 'Bearer '+ token
		}
		response = self.client.get(self.url, **headers)
		assert response.status_code == status.HTTP_200_OK

	def test_client_create(self):
		token = get_token()
		headers={
			'HTTP_AUTHORIZATION': 'Bearer '+ token
		}
		data = {
			"name": "test_client_create",
	        "snp_500": True,
	        "fortune_level": 2,
	        "enterprise": False,
	        # "greatplace_mostadmired": True,
	        "date_joined_pyx": "2019-05-12T15:08:54.327Z",
	        "date_left_pyx": "2019-05-12T15:08:54.327Z",
	        "naics_code1_id": 1,
	        "naics_code2_id": 1,
	        "created_at": "2019-05-12T15:08:54.327Z",
	        "updated_at": "2019-05-12T15:08:54.327Z"
		}
		response = self.client.post(self.url, data, **headers)
		assert response.status_code == status.HTTP_201_CREATED

class Test_ClientDetailView(APITestCase):
	
	client = APIClient()	
	url = reverse('clients_detail', kwargs={'pk': 1})

	def test_client_view(self):
		token = get_token()
		headers={
			'HTTP_AUTHORIZATION': 'Bearer '+ token
		}
		response = self.client.get(self.url, **headers)
		if response.status_code == status.HTTP_404_NOT_FOUND:
			assert response.status_code == status.HTTP_404_NOT_FOUND
		else:
			assert response.status_code == status.HTTP_200_OK

	def test_client_update(self):
		token = get_token()
		headers={
			'HTTP_AUTHORIZATION': 'Bearer '+ token
		}
		update_data = {
			'name': 'test_client',
			'snp_500': True,
			'fortune_level': 5,
			'enterprise': False,
			'greatplace_mostadmired': True,
			'date_joined_pyx': '2015-10-28 16:09:59',
		}
		response = self.client.put(self.url, update_data, **headers, format="json")
		if response.status_code == status.HTTP_404_NOT_FOUND:
			assert response.status_code == status.HTTP_404_NOT_FOUND
		else:
			assert response.status_code == status.HTTP_200_OK

	def test_client_delete(self):
		token = get_token()
		headers={
			'HTTP_AUTHORIZATION': 'Bearer '+ token
		}
		response = self.client.delete(self.url, **headers)
		if response.status_code == status.HTTP_404_NOT_FOUND:
			assert response.status_code == status.HTTP_404_NOT_FOUND
		else:
			assert response.status_code == status.HTTP_200_OK

