import json

from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.exceptions import ErrorDetail
from rest_framework.test import APITestCase
from django.db import connection
from django.test.utils import CaptureQueriesContext

from server.store.models import City
from server.store.serializers import CitySerializer
from server.store.tests import test_get_token


class CityApiTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='test_user')
        self.staff_user = User.objects.create_user(username='staff_user', is_staff=True)
        self.unit_1 = City.objects.create(name='Odessa')
        self.unit_2 = City.objects.create(name='Kiev')

    def test_get(self):
        url = reverse('city-list')
        with CaptureQueriesContext(connection) as queries:
            response = self.client.get(url)
            self.assertEqual(2, len(queries))
        messure = City.objects.all()
        serializer_data = CitySerializer(messure, many=True).data
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(serializer_data, response.data['results'])

    def test_create(self):
        self.assertEqual(2, City.objects.all().count())
        url = reverse('city-list')
        data = {
            'name': "Kharkiv",
        }
        json_data = json.dumps(data)
        token = test_get_token(self.client, staff=True)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        response = self.client.post(url, data=json_data,
                                    content_type='application/json')
        self.assertEqual(status.HTTP_201_CREATED, response.status_code, response.data)
        self.assertEqual(3, City.objects.all().count())

    def test_create_same_record(self):
        self.assertEqual(2, City.objects.all().count())
        url = reverse('city-list')
        data = {
            'name': 'Odessa',
        }
        json_data = json.dumps(data)
        token = test_get_token(self.client, staff=True)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        response = self.client.post(url, data=json_data,
                                    content_type='application/json')
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code, response.data)
        self.assertEqual(2, City.objects.all().count())
        self.assertEqual([ErrorDetail(string='This name is already exists', code='invalid')], response.data)

    def test_create_not_staff(self):
        self.assertEqual(2, City.objects.all().count())
        url = reverse('city-list')
        data = {
            'name': 'Kiev'
        }
        json_data = json.dumps(data)
        token = test_get_token(self.client, staff=False)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        response = self.client.post(url, data=json_data,
                                    content_type='application/json')
        self.assertEqual(status.HTTP_403_FORBIDDEN, response.status_code)
        self.assertEqual({'detail': ErrorDetail(string='У вас недостаточно прав для выполнения данного действия.',
                                                code='permission_denied')}, response.data, response.data)
        self.assertEqual(2, City.objects.all().count())

    def test_delete(self):
        self.assertEqual(2, City.objects.all().count())
        url = reverse('city-detail', args=(self.unit_1.id,))

        token = test_get_token(self.client, staff=True)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        response = self.client.delete(url)
        self.assertEqual(status.HTTP_204_NO_CONTENT, response.status_code)
        self.assertEqual(1, City.objects.all().count())

    def test_delete_not_staff(self):
        self.assertEqual(2, City.objects.all().count())
        url = reverse('city-detail', args=(self.unit_1.id,))

        token = test_get_token(self.client, staff=False)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        response = self.client.delete(url)
        self.assertEqual(status.HTTP_403_FORBIDDEN, response.status_code)
        self.assertEqual({'detail': ErrorDetail(string='У вас недостаточно прав для выполнения данного действия.',
                                                code='permission_denied')}
                         , response.data)
        self.assertEqual(2, City.objects.all().count())

    def test_update(self):
        url = reverse('city-detail', args=(self.unit_1.id,))
        data = {
            'name': 'Yuzhny'
        }
        json_data = json.dumps(data)
        token = test_get_token(self.client, staff=True)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        response = self.client.put(url, data=json_data,
                                   content_type='application/json')
        self.assertEqual(status.HTTP_200_OK, response.status_code, response.data)
        self.unit_1.refresh_from_db()
        self.assertEqual('Yuzhny', self.unit_1.name)

    def test_update_not_staff(self):
        url = reverse('city-detail', args=(self.unit_1.id,))
        data = {
            'name': 'Kharkiv'
        }
        json_data = json.dumps(data)
        token = test_get_token(self.client, staff=False)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        response = self.client.put(url, data=json_data,
                                   content_type='application/json')
        self.assertEqual(status.HTTP_403_FORBIDDEN, response.status_code)
        self.unit_1.refresh_from_db()
        self.assertEqual('Odessa', self.unit_1.name)