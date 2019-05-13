# import pytest
# from django.urls import reverse
# from django.utils.encoding import smart_text

# from rest_framework.test import APIClient, APITestCase
# from rest_framework import status

# import os

# @pytest.mark.django_db
# def get_token():
# 	client = APIClient()
# 	url = reverse('SSOLogin')
# 	data = {
# 		'email': os.environ.get('ONELOGIN_EMAIL', ''),				#use onelogin email
# 		'password': os.environ.get('ONELOGIN_PASSWORD', '')			#use onelogin password
# 	}
# 	response = client.post(url, data, format='json')
# 	token = smart_text(response.data['token'])
# 	return token

# @pytest.mark.django_db
# class Test_SSO(APITestCase):
# 	client = APIClient()

# 	def test_sso_onelogin(self):
# 		"""
# 		Ensure we can SSO via OneLogin
# 		"""
# 		url = reverse('SSOLogin')
# 		data = {
# 			'email': os.environ.get('ONELOGIN_EMAIL', ''),
# 			'password': os.environ.get('ONELOGIN_PASSWORD', '')
# 		}
# 		response = self.client.post(url, data, format='json')		
# 		assert response.status_code == 200

# 	def test_sso_logout(self):
# 		"""
# 		Ensure we logout
# 		"""
# 		Test_SSO.test_sso_onelogin(self)
# 		url = reverse('logout')
# 		token = get_token()
# 		headers={
# 			'HTTP_AUTHORIZATION': 'Bearer '+ smart_text(token)
# 		}
# 		response = self.client.get(url, **headers)
# 		assert response.status_code == 201

# # @pytest.mark.django_db
# # class Test_ListCreateUsers(APITestCase):

# # 	url = reverse('userlist')	
# # 	client = APIClient()

# # 	def test_user_list(self):
# # 		"""
# # 		Ensure we can get all users
# # 		"""
# # 		token = get_token()
# # 		headers={
# # 			'HTTP_AUTHORIZATION': 'Bearer '+ token
# # 		}
# # 		response = self.client.get(self.url, **headers)
# # 		assert response.status_code == status.HTTP_200_OK

# # 	def test_user_create(self):
# # 		"""
# # 		Ensure we can create a new user
# # 		"""
# # 		data = {
# # 			'email': 'test@mail.com',
# # 			'username': 'test',
# # 			'password': 'MM1sd99212345ri',
# # 			'firstname': 'Nicolai', 
# # 			'lastname': 'Popov', 
# # 			'role': 'Not Assigned'
# # 		}
# # 		token = get_token()
# # 		headers={
# # 			'HTTP_AUTHORIZATION': 'Bearer '+ token
# # 		}
# # 		response = self.client.post(self.url, data, **headers, format="json")
# # 		assert response.status_code == status.HTTP_201_CREATED

