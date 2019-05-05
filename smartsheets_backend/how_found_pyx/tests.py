from django.test import TestCase

# Create your tests here.
from django.urls import include, path, reverse
from django.utils.encoding import smart_text

from rest_framework.test import APIClient, APITestCase

def get_token():
	client = APIClient()
	url = reverse('SSOLogin')
	data = {
		'email': 'sky4goal@gmail.com',
		'password': 'MM199212345ri'
	}
	response = client.post(url, data, format='json')
	token = smart_text(response.data['token'])
	return token

class Test_HowFoundPyx(APITestCase):
	def setUp(self):
		self.url = reverse('how_found_pyxes')
		self.token = get_token()

	def test_pyx_get(self):
		headers={
			'HTTP_AUTHORIZATION': 'Bearer '+ self.token
		}
		response = self.client.get(self.url, **headers)
		self.assertEqual(response.status_code, status.HTTP_200_OK)