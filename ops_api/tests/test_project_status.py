import pytest

from django.urls import reverse
from django.utils.encoding import smart_text

from decouple import config

from rest_framework.test import APIClient, APITestCase
from rest_framework import status

import os

from .conftest import get_header

class Test_ProjectStatusList(APITestCase):
	url = reverse('project_status_list')
	client = APIClient()

	def test_project_status_list(self):
		headers=get_header()
		response = self.client.get(self.url, **headers)
		assert response.status_code == status.HTTP_200_OK

	def test_project_status_create(self):
		headers=get_header()
		data = {
			"name": "test_project_status_create"
		}
		response = self.client.post(self.url, data, **headers)
		assert response.status_code == status.HTTP_201_CREATED

class Test_ProjectStatusDetailView(APITestCase):
	client = APIClient()	
	url = reverse('project_status_detail', kwargs={'pk': 1})

	def test_project_status_view(self):
		headers=get_header()
		response = self.client.get(self.url, **headers)
		if response.status_code == status.HTTP_404_NOT_FOUND:
			assert response.status_code == status.HTTP_404_NOT_FOUND
		else:
			assert response.status_code == status.HTTP_200_OK

	def test_project_status_update(self):
		headers=get_header()
		update_data = {
			"name": "test_project_status_update"
		}
		response = self.client.put(self.url, update_data, **headers, format="json")
		if response.status_code == status.HTTP_404_NOT_FOUND:
			assert response.status_code == status.HTTP_404_NOT_FOUND
		else:
			assert response.status_code == status.HTTP_200_OK

	def test_project_status_delete(self):
		headers=get_header()
		response = self.client.delete(self.url, **headers)
		if response.status_code == status.HTTP_404_NOT_FOUND:
			assert response.status_code == status.HTTP_404_NOT_FOUND
		else:
			assert response.status_code == status.HTTP_204_NO_CONTENT
