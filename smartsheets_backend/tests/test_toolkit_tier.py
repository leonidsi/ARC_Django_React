import pytest

from django.urls import reverse
from django.utils.encoding import smart_text

from decouple import config

from rest_framework.test import APIClient, APITestCase
from rest_framework import status

import os

from .conftest import get_header

class Test_ToolkitTierList(APITestCase):
	url = reverse('toolkit_tiers_list')
	client = APIClient()

	def test_toolkit_tiers_list(self):
		headers=get_header()
		response = self.client.get(self.url, **headers)
		assert response.status_code == status.HTTP_200_OK

	def test_toolkit_tiers_create(self):
		headers=get_header()
		data = {
			"name": "test_tier_create"
		}
		response = self.client.post(self.url, data, **headers)
		assert response.status_code == status.HTTP_201_CREATED

class Test_ToolkitTierDetailView(APITestCase):
	client = APIClient()	
	url = reverse('toolkit_iters_detail', kwargs={'pk': 1})

	def test_toolkit_iters_view(self):
		headers=get_header()
		response = self.client.get(self.url, **headers)
		if response.status_code == status.HTTP_404_NOT_FOUND:
			assert response.status_code == status.HTTP_404_NOT_FOUND
		else:
			assert response.status_code == status.HTTP_200_OK

	def test_toolkit_iters_update(self):
		headers=get_header()
		update_data = {
			"name": "test_tier_update"
		}
		response = self.client.put(self.url, update_data, **headers, format="json")
		if response.status_code == status.HTTP_404_NOT_FOUND:
			assert response.status_code == status.HTTP_404_NOT_FOUND
		else:
			assert response.status_code == status.HTTP_200_OK

	def test_toolkit_iters_delete(self):
		headers=get_header()
		response = self.client.delete(self.url, **headers)
		if response.status_code == status.HTTP_404_NOT_FOUND:
			assert response.status_code == status.HTTP_404_NOT_FOUND
		else:
			assert response.status_code == status.HTTP_204_NO_CONTENT
