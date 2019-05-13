from django.test import TestCase

# Create your tests here.

from rest_framework.test import APIClient, APITestCase
from rest_framework import status

from django.urls import include, path, reverse

from django.utils.encoding import smart_text

# def get_token():
# 	client = APIClient()
# 	url = reverse('SSOLogin')
# 	data = {
# 		'email': 'sky4goal@gmail.com',
# 		'password': 'MM199212345ri'
# 	}
# 	response = client.post(url, data, format='json')
# 	token = smart_text(response.data['token'])
# 	return token


# class Test_ClientDetailView(APITestCase):
# 	def setUp(self):
# 		self.client = APIClient()
# 		self.token = get_token()
# 		self.headers={
# 			'HTTP_AUTHORIZATION': 'Bearer '+ self.token
# 		}
# 		self.url = reverse('clients_detail', kwargs={'pk': 1})

# 	def test_client_view(self):
# 		response = self.client.get(self.url, **self.headers)
# 		if response.status_code == status.HTTP_404_NOT_FOUND:
# 			self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
# 		else:
# 			self.assertEqual(response.status_code, status.HTTP_200_OK)

# 	def test_client_update(self):
# 		update_data = {
# 			'name': 'test_client',
# 			'snp_500': True,
# 			'fortune_level': 5,
# 			'enterprise': False,
# 			'greatplace_mostadmired': True,
# 			'date_joined_pyx': '2015-10-28 16:09:59',
# 		}
# 		response = self.client.put(self.url, update_data, **self.headers, format="json")
# 		print(response)

# class Test_ClientView(APITestCase):
# 	def setUp(self):
# 		self.client = APIClient()
# 		self.token = get_token()
# 		self.headers={
# 			'HTTP_AUTHORIZATION': 'Bearer '+ self.token
# 		}
# 		self.url = reverse('clients')

# 	def test_client_list(self):
# 		response = self.client.get(self.url, **self.headers)
# 		print(response)
# 		print("===list===")

		