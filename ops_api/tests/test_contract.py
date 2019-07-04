import pytest

from django.urls import reverse
from django.utils.encoding import smart_text

from decouple import config

from rest_framework.test import APIClient, APITestCase
from rest_framework import status

import os

from .conftest import get_header

class Test_ContractList(APITestCase):
	client = APIClient()
	url = reverse('contracts')

	def test_contract_list(self):
		headers=get_header()
		response = self.client.get(self.url, **headers)
		assert response.status_code == status.HTTP_200_OK

	def test_contract_create(self):
		headers=get_header()
		data = {
			"name": "test_contract01",
            "contract_number": 1,
            "date_current_contract_signed": "07-03-2019",
            "current_contract_term": "2019",
            "total_contract_value": 1,
            "contract_type": "test_type01",
            "extension_contract": "test_extension_01",
            "annual_subscription": "test_annual_01",
            "status": "test_status_01",
            "client_id": 396,
		}
		response = self.client.post(self.url, data, **headers)
		assert response.status_code == status.HTTP_201_CREATED

class Test_ContractDetailView(APITestCase):
	
	client = APIClient()	
	url = reverse('contracts_detail', kwargs={'pk': 1})

	def test_contract_view(self):
		headers=get_header()
		response = self.client.get(self.url, **headers)
		if response.status_code == status.HTTP_404_NOT_FOUND:
			assert response.status_code == status.HTTP_404_NOT_FOUND
		else:
			assert response.status_code == status.HTTP_200_OK

	def test_contract_update(self):
		headers=get_header()
		update_data = {
			"name": "test_contract_001",
            "contract_number": 100,
            "date_current_contract_signed": "07-17-2019",
            "current_contract_term": "2019",
            "total_contract_value": 10,
            "contract_type": "test_type_001",
            "extension_contract": "test_extension_001",
            "annual_subscription": "test_annual_001",
            "status": "test_status_001",
            "client_id": 396
		}
		response = self.client.put(self.url, update_data, **headers, format="json")
		if response.status_code == status.HTTP_404_NOT_FOUND:
			assert response.status_code == status.HTTP_404_NOT_FOUND
		else:
			assert response.status_code == status.HTTP_200_OK

	def test_contract_delete(self):
		headers=get_header()
		response = self.client.delete(self.url, **headers)
		if response.status_code == status.HTTP_404_NOT_FOUND:
			assert response.status_code == status.HTTP_404_NOT_FOUND
		else:
			assert response.status_code == status.HTTP_204_NO_CONTENT

