import pytest

from django.urls import reverse
from django.utils.encoding import smart_text

from decouple import config

from rest_framework.test import APIClient, APITestCase
from rest_framework import status

import os

from .conftest import get_header

class Test_ClientList(APITestCase):
	client = APIClient()
	url = reverse('clients')

	def test_client_list(self):
		headers=get_header()
		response = self.client.get(self.url, **headers)
		assert response.status_code == status.HTTP_200_OK

	def test_client_create(self):
		headers=get_header()
		data = {
			"name": "test_client_create",
	        "snp_500": True,
	        "fortune_level": 2,
	        "enterprise": False,
	        # "greatplace_mostadmired": True,
	        "date_joined_pyx": "05-12-2019",
	        "date_left_pyx": "05-15-2019",
	        "naics_code1_id": 1,
	        "naics_code2_id": 1
		}
		response = self.client.post(self.url, data, **headers)
		assert response.status_code == status.HTTP_201_CREATED

class Test_ClientDetailView(APITestCase):
	
	client = APIClient()	
	url = reverse('clients_detail', kwargs={'pk': 1})

	def test_client_view(self):
		headers=get_header()
		response = self.client.get(self.url, **headers)
		if response.status_code == status.HTTP_404_NOT_FOUND:
			assert response.status_code == status.HTTP_404_NOT_FOUND
		else:
			assert response.status_code == status.HTTP_200_OK

	def test_client_update(self):
		headers=get_header()
		update_data = {
			'name': 'test_client',
			'snp_500': True,
			'fortune_level': 5,
			'enterprise': False,
			# 'greatplace_mostadmired': True,
			'date_joined_pyx': '10-28-2018',
		}
		response = self.client.put(self.url, update_data, **headers, format="json")
		if response.status_code == status.HTTP_404_NOT_FOUND:
			assert response.status_code == status.HTTP_404_NOT_FOUND
		else:
			assert response.status_code == status.HTTP_200_OK

	def test_client_delete(self):
		headers=get_header()
		response = self.client.delete(self.url, **headers)
		if response.status_code == status.HTTP_404_NOT_FOUND:
			assert response.status_code == status.HTTP_404_NOT_FOUND
		else:
			assert response.status_code == status.HTTP_204_NO_CONTENT

