import json

from django.contrib.auth.models import User
from django.db import connection
from django.test.utils import CaptureQueriesContext
from django.urls import reverse
from rest_framework import status
from rest_framework.exceptions import ErrorDetail
from rest_framework.test import APITestCase

from vehicles.models import FeatureList
from vehicles.serializers import FeatureListSerializer
from vehicles.tests import test_get_token


class VehicleFeaturesApiTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='test_user')
        self.staff_user = User.objects.create_user(username='staff_user', is_staff=True)
        self.feature_1 = FeatureList.objects.create(name='Грузоподъемность борта')
        self.feature_2 = FeatureList.objects.create(name='Грузоподъемность стрелы')
        token = test_get_token(self.client)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)

    def test_get(self):
        url = reverse('featurelist-list')
        with CaptureQueriesContext(connection) as queries:
            response = self.client.get(url)
            self.assertEqual(2, len(queries))
        features = FeatureList.objects.all()
        serializer_data = FeatureListSerializer(features, many=True).data
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(serializer_data, response.data)

    def test_create(self):
        self.assertEqual(2, FeatureList.objects.all().count())
        url = reverse('featurelist-list')
        data = {
            'name': "Weight",
        }
        json_data = json.dumps(data)
        self.client.force_login(self.staff_user)
        response = self.client.post(url, data=json_data,
                                    content_type='application/json')
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(3, FeatureList.objects.all().count())

    def test_create_same_record(self):
        self.assertEqual(2, FeatureList.objects.all().count())
        url = reverse('featurelist-list')
        data = {
            'name': 'Грузоподъемность борта',
        }
        json_data = json.dumps(data)
        self.client.force_login(self.staff_user)
        response = self.client.post(url, data=json_data,
                                    content_type='application/json')
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual(2, FeatureList.objects.all().count())
        self.assertEqual([ErrorDetail(string='This name is already exists', code='invalid')], response.data)

    def test_create_not_staff(self):
        self.assertEqual(2, FeatureList.objects.all().count())
        url = reverse('featurelist-list')
        data = {
            'name': 'Weight'
        }
        json_data = json.dumps(data)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer odfgnzsodbnlkkdsbnlkjndlxkfjbnd')
        self.client.force_login(self.user)
        response = self.client.post(url, data=json_data,
                                    content_type='application/json')
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)
        self.assertEqual(2, FeatureList.objects.all().count())

    def test_delete(self):
        self.assertEqual(2, FeatureList.objects.all().count())
        url = reverse('featurelist-detail', args=(self.feature_1.id,))

        self.client.force_login(self.staff_user)
        response = self.client.delete(url)
        self.assertEqual(status.HTTP_204_NO_CONTENT, response.status_code)
        self.assertEqual(1, FeatureList.objects.all().count())

    def test_delete_not_staff(self):
        self.assertEqual(2, FeatureList.objects.all().count())
        url = reverse('featurelist-detail', args=(self.feature_1.id,))
        self.client.credentials(HTTP_AUTHORIZATION='Bearer')
        self.client.force_login(self.user)
        response = self.client.delete(url)
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)
        self.assertEqual(2, FeatureList.objects.all().count())

    def test_update(self):
        url = reverse('featurelist-detail', args=(self.feature_1.id,))
        data = {
            'name': 'Weight 2'
        }
        json_data = json.dumps(data)
        self.client.force_login(self.staff_user)
        response = self.client.put(url, data=json_data,
                                   content_type='application/json')
        self.assertEqual(status.HTTP_200_OK, response.status_code, response.data)
        self.feature_1.refresh_from_db()
        self.assertEqual('Weight 2', self.feature_1.name)

    def test_update_not_staff(self):
        url = reverse('featurelist-detail', args=(self.feature_1.id,))
        data = {
            'name': 'Weight 2'
        }
        json_data = json.dumps(data)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer')
        self.client.force_login(self.user)
        response = self.client.put(url, data=json_data,
                                   content_type='application/json')
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)
        self.feature_1.refresh_from_db()
        self.assertEqual('Грузоподъемность борта', self.feature_1.name)
