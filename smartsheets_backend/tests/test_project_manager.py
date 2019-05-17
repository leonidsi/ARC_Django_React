import pytest

from django.urls import reverse
from django.utils.encoding import smart_text

from decouple import config

from rest_framework.test import APIClient, APITestCase
from rest_framework import status

import os

from .conftest import get_header

class Test_ProjectManagerList(APITestCase):
	url = reverse('project_managers_list')
	client = APIClient()

	def test_project_managers_list(self):
		headers=get_header()
		response = self.client.get(self.url, **headers)
		assert response.status_code == status.HTTP_200_OK

	def test_project_managers_create(self):
		headers=get_header()
		data = {
			"user_id": 2
		}
		response = self.client.post(self.url, data, **headers)
		assert response.status_code == status.HTTP_201_CREATED

class Test_ProjectManagerDetailView(APITestCase):
	client = APIClient()	
	url = reverse('project_managers_detail', kwargs={'pk': 1})

	def test_project_managers_view(self):
		headers=get_header()
		response = self.client.get(self.url, **headers)
		if response.status_code == status.HTTP_404_NOT_FOUND:
			assert response.status_code == status.HTTP_404_NOT_FOUND
		else:
			assert response.status_code == status.HTTP_200_OK


	def test_project_managers_delete(self):
		headers=get_header()
		response = self.client.delete(self.url, **headers)
		if response.status_code == status.HTTP_404_NOT_FOUND:
			assert response.status_code == status.HTTP_404_NOT_FOUND
		else:
			assert response.status_code == status.HTTP_204_NO_CONTENT
