import json

from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.exceptions import ErrorDetail
from rest_framework.test import APITestCase


class AuthApiTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='test_user', password='123', email='some@google.com')
        self.staff_user = User.objects.create_user(username='staff_user', is_staff=True)

    def test_get_token(self):
        url = reverse('token_obtain_pair')
        data = {
            "username": "test_user",
            "password": "123"
        }
        json_data = json.dumps(data)
        response = self.client.post(url, data=json_data, content_type='application/json')
        self.assertEqual(status.HTTP_200_OK, response.status_code, response.data)
        return response.data['access']

    def test_get_token_wrong(self):
        url = reverse('token_obtain_pair')
        data = {
            "username": "test_usr",
            "password": "123"
        }
        json_data = json.dumps(data)
        response = self.client.post(url, data=json_data, content_type='application/json')
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code, response.data)
        self.assertEqual({'detail': ErrorDetail(string='No active account found with the given credentials',
                                                code='no_active_account')}
                         , response.data)

    def test_register(self):
        url = reverse('auth_register')
        self.assertEqual(2, User.objects.all().count())
        data = {
            "username": "test_user1",
            "password": "qwerty12356782",
            "password2": "qwerty12356782",
            "email": "some@google.com",
            "first_name": "Max",
            "last_name": "Popov",

        }
        json_data = json.dumps(data)
        response = self.client.post(url, data=json_data, content_type='application/json')
        self.assertEqual(status.HTTP_201_CREATED, response.status_code, response.data)
        self.assertEqual({'username': 'test_user1',
                          'email': 'some@google.com',
                          'first_name': 'Max',
                          'last_name': 'Popov'}
                         , response.data, response.data)

        self.assertEqual(3, User.objects.all().count())

    def test_register_fail(self):
        url = reverse('auth_register')
        self.assertEqual(2, User.objects.all().count())
        data = {
            "username": "test_user",
            "password": "123",
            "password2": "123",
            "email": "some@google.com",
            "first_name": "Max",
            "last_name": "Popov",

        }
        json_data = json.dumps(data)
        response = self.client.post(url, data=json_data, content_type='application/json')
        # serializer_data = MyTokenObtainPairSerializer(messure, many=True).data
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code, response.data)
        self.assertEqual({'username': [ErrorDetail(string='A user with that username already exists.', code='unique')],
                          'password': [
                              ErrorDetail(string='This password is too short. It must contain at least 8 characters.',
                                          code='password_too_short'),
                              ErrorDetail(string='This password is too common.', code='password_too_common'),
                              ErrorDetail(string='This password is entirely numeric.',
                                          code='password_entirely_numeric')]}
                         , response.data, response.data)

        self.assertEqual(2, User.objects.all().count())

    def test_password_change(self):
        url = reverse('change-password')
        data = {
            "old_password": "123",
            "new_password": "qwerty12356782",
        }
        json_data = json.dumps(data)
        token = self.test_get_token()
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        response = self.client.put(url, data=json_data, content_type='application/json')
        self.assertEqual(status.HTTP_200_OK, response.status_code, response.data)
        self.assertEqual({'code': 200,  'data': [],  'message': 'Password updated successfully',  'status': 'success'}
                         , response.data)

    def test_password_change_bad(self):
        url = reverse('change-password')
        data = {
            "old_password": "1234",
            "new_password": "qwerty12356782",
        }
        json_data = json.dumps(data)
        token = self.test_get_token()
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        response = self.client.put(url, data=json_data, content_type='application/json')
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code, response.data)
        self.assertEqual({'old_password': ['Wrong password.']}, response.data)

    def test_password_reset(self):
        url = reverse('reset-password-request')
        data = {
            "email": "some@google.com",
            # "new_password": "qwerty12356782",
        }
        json_data = json.dumps(data)
        token = self.test_get_token()
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        response = self.client.post(url, data=json_data, content_type='application/json')
        self.assertEqual(status.HTTP_200_OK, response.status_code, response.data)
        self.assertEqual({'status': 'OK'}, response.data)
