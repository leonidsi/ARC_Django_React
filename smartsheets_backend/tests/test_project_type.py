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

class Test_ProjectTypeList(APITestCase):
	url = reverse('project_types_list')
	client = APIClient()

	def test_project_types_list(self):
		token = get_token()
		headers={
			'HTTP_AUTHORIZATION': 'Bearer '+ token
		}
		response = self.client.get(self.url, **headers)
		assert response.status_code == status.HTTP_200_OK

	def test_project_types_create(self):
		token = get_token()
		headers={
			'HTTP_AUTHORIZATION': 'Bearer '+ token
		}
		data = {
			"name": "test_project_types_create"
		}
		response = self.client.post(self.url, data, **headers)
		assert response.status_code == status.HTTP_201_CREATED

class Test_ProjectTypeDetailView(APITestCase):
	client = APIClient()	
	url = reverse('project_types_detail', kwargs={'pk': 1})

	def test_project_types_view(self):
		token = get_token()
		headers={
			'HTTP_AUTHORIZATION': 'Bearer '+ token
		}
		response = self.client.get(self.url, **headers)
		if response.status_code == status.HTTP_404_NOT_FOUND:
			assert response.status_code == status.HTTP_404_NOT_FOUND
		else:
			assert response.status_code == status.HTTP_200_OK

	def test_project_types_update(self):
		token = get_token()
		headers={
			'HTTP_AUTHORIZATION': 'Bearer '+ token
		}
		update_data = {
			"name": "test_project_types_update"
		}
		response = self.client.put(self.url, update_data, **headers, format="json")
		if response.status_code == status.HTTP_404_NOT_FOUND:
			assert response.status_code == status.HTTP_404_NOT_FOUND
		else:
			assert response.status_code == status.HTTP_200_OK

	def test_project_types_delete(self):
		token = get_token()
		headers={
			'HTTP_AUTHORIZATION': 'Bearer '+ token
		}
		response = self.client.delete(self.url, **headers)
		if response.status_code == status.HTTP_404_NOT_FOUND:
			assert response.status_code == status.HTTP_404_NOT_FOUND
		else:
			assert response.status_code == status.HTTP_204_NO_CONTENT
