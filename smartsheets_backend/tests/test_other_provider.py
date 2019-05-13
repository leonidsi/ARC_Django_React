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

class Test_OtherProviderList(APITestCase):
	url = reverse('other_providers_list')
	client = APIClient()

	def test_other_providers_list(self):
		token = get_token()
		headers={
			'HTTP_AUTHORIZATION': 'Bearer '+ token
		}
		response = self.client.get(self.url, **headers)
		assert response.status_code == status.HTTP_200_OK

	def test_other_providers_create(self):
		token = get_token()
		headers={
			'HTTP_AUTHORIZATION': 'Bearer '+ token
		}
		data = {
			"name": "test_other_provider_create"
		}
		response = self.client.post(self.url, data, **headers)
		assert response.status_code == status.HTTP_201_CREATED

class Test_OtherProviderDetailView(APITestCase):
	client = APIClient()	
	url = reverse('other_providers_detail', kwargs={'pk': 1})

	def test_other_providers_view(self):
		token = get_token()
		headers={
			'HTTP_AUTHORIZATION': 'Bearer '+ token
		}
		response = self.client.get(self.url, **headers)
		if response.status_code == status.HTTP_404_NOT_FOUND:
			assert response.status_code == status.HTTP_404_NOT_FOUND
		else:
			assert response.status_code == status.HTTP_200_OK

	def test_other_providers_update(self):
		token = get_token()
		headers={
			'HTTP_AUTHORIZATION': 'Bearer '+ token
		}
		update_data = {
			"name": "test_other_provider_update"
		}
		response = self.client.put(self.url, update_data, **headers, format="json")
		if response.status_code == status.HTTP_404_NOT_FOUND:
			assert response.status_code == status.HTTP_404_NOT_FOUND
		else:
			assert response.status_code == status.HTTP_200_OK

	def test_other_providers_delete(self):
		token = get_token()
		headers={
			'HTTP_AUTHORIZATION': 'Bearer '+ token
		}
		response = self.client.delete(self.url, **headers)
		if response.status_code == status.HTTP_404_NOT_FOUND:
			assert response.status_code == status.HTTP_404_NOT_FOUND
		else:
			assert response.status_code == status.HTTP_204_NO_CONTENT
