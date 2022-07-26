import json

from django.contrib.auth.models import User
from django.db import connection
from django.test.utils import CaptureQueriesContext
from django.urls import reverse
from rest_framework import status
from rest_framework.exceptions import ErrorDetail
from rest_framework.test import APITestCase

from vehicles.models import MessurementUnit as Unit
from vehicles.serializers import FeatureListSerializer
from vehicles.tests import test_get_token, bad_token


class MessurementApiTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='test_user')
        self.staff_user = User.objects.create_user(username='staff_user', is_staff=True)
        self.unit_1 = Unit.objects.create(name='metr')
        self.unit_2 = Unit.objects.create(name='kilometr')
        token = test_get_token(self.client)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)

    def test_get(self):
        url = reverse('messurementunit-list')
        with CaptureQueriesContext(connection) as queries:
            response = self.client.get(url)
            self.assertEqual(3, len(queries))
        messure = Unit.objects.all()
        serializer_data = FeatureListSerializer(messure, many=True).data
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(serializer_data, response.data['results'])

    def test_create(self):
        self.assertEqual(2, Unit.objects.all().count())
        url = reverse('messurementunit-list')
        data = {
            'name': "Weight",
        }
        json_data = json.dumps(data)
        self.client.force_login(self.staff_user)
        response = self.client.post(url, data=json_data,
                                    content_type='application/json')
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(3, Unit.objects.all().count())

    def test_create_same_record(self):
        self.assertEqual(2, Unit.objects.all().count())
        url = reverse('messurementunit-list')
        data = {
            'name': 'metr',
        }
        json_data = json.dumps(data)
        self.client.force_login(self.staff_user)
        response = self.client.post(url, data=json_data,
                                    content_type='application/json')
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code, response.data)
        self.assertEqual(2, Unit.objects.all().count())
        self.assertEqual([ErrorDetail(string='This name is already exists', code='invalid')], response.data)

    def test_create_not_staff(self):
        self.assertEqual(2, Unit.objects.all().count())
        url = reverse('messurementunit-list')
        data = {
            'name': 'Weight'
        }
        json_data = json.dumps(data)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer  dvsdvklmlvknsdfkbsnklbnfdkd')
        self.client.force_login(self.user)
        response = self.client.post(url, data=json_data,
                                    content_type='application/json')
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)
        self.assertEqual(2, Unit.objects.all().count())

    def test_delete(self):
        self.assertEqual(2, Unit.objects.all().count())
        url = reverse('messurementunit-detail', args=(self.unit_1.id,))

        self.client.force_login(self.staff_user)
        response = self.client.delete(url)
        self.assertEqual(status.HTTP_204_NO_CONTENT, response.status_code)
        self.assertEqual(1, Unit.objects.all().count())

    def test_delete_not_staff(self):
        self.assertEqual(2, Unit.objects.all().count())
        url = reverse('messurementunit-detail', args=(self.unit_1.id,))
        self.client.credentials(HTTP_AUTHORIZATION=bad_token())
        self.client.force_login(self.user)
        response = self.client.delete(url)
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)
        self.assertEqual(2, Unit.objects.all().count())

    def test_update(self):
        url = reverse('messurementunit-detail', args=(self.unit_1.id,))
        data = {
            'name': 'Weight 2'
        }
        json_data = json.dumps(data)
        self.client.force_login(self.staff_user)
        response = self.client.put(url, data=json_data,
                                   content_type='application/json')
        self.assertEqual(status.HTTP_200_OK, response.status_code, response.data)
        self.unit_1.refresh_from_db()
        self.assertEqual('Weight 2', self.unit_1.name)

    def test_update_not_staff(self):
        url = reverse('messurementunit-detail', args=(self.unit_1.id,))
        data = {
            'name': 'Weight 2'
        }
        json_data = json.dumps(data)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer')
        self.client.force_login(self.user)
        response = self.client.put(url, data=json_data,
                                   content_type='application/json')
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)
        self.unit_1.refresh_from_db()
        self.assertEqual('metr', self.unit_1.name)
