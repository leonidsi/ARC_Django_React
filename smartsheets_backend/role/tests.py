from django.test import TestCase

from rest_framework.test import APIClient, APITestCase

class Test_role(APITestCase):
	fixtures = ['initrole.json']