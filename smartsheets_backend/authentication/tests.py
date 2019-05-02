from django.test import TestCase

# Create your tests here.

from .models import User, UserManager

from django.urls import include, path, reverse
from django.conf import settings

from rest_framework.test import APIClient, APITestCase, APIRequestFactory
from rest_framework import status

import requests
import json
from django.utils.encoding import smart_text

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


class Test_SSO(APITestCase):
	client = APIClient()

	def test_sso_onelogin(self):
		"""
		Ensure we can SSO via OneLogin
		"""
		url = reverse('SSOLogin')
		data = {
			'email': 'sky4goal@gmail.com',
			'password': 'MM199212345ri'
		}
		response = self.client.post(url, data, format='json')		
		self.assertEqual(response.status_code, status.HTTP_200_OK)

	def test_sso_logout(self):
		"""
		Ensure we logout
		"""
		Test_SSO.test_sso_onelogin(self)
		url = reverse('logout')
		token = get_token()
		headers={
			'HTTP_AUTHORIZATION': 'Bearer '+ smart_text(token)
		}
		response = self.client.get(url, **headers)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class Test_ListCreateUsers(APITestCase):
	

	def setUp(self):
		self.url = reverse('userlist')
		self.token = get_token()
		self.client = APIClient()

	def test_user_list(self):
		"""
		Ensure we can get all users
		"""
		headers={
			'HTTP_AUTHORIZATION': 'Bearer '+ smart_text(self.token)
		}
		response = self.client.get(self.url, **headers)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

	def test_user_create(self):
		"""
		Ensure we can create a new user
		"""
		data = {
			'email': 'test@mail.com',
			'username': 'test',
			'password': 'MM1sd99212345ri',
			'firstname': 'Nicolai', 
			'lastname': 'Popov', 
			'role': 'Not Assigned'
		}
		headers={
			'HTTP_AUTHORIZATION': 'Bearer '+ smart_text(self.token)
		}
		response = self.client.post(self.url, data, **headers, format="json")
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)




