import json
import os

from django.contrib.auth.models import User
from django.db.models import F
from django.urls import reverse
from rest_framework import status
from rest_framework.exceptions import ErrorDetail
from rest_framework.test import APITestCase
from django.db import connection
from django.test.utils import CaptureQueriesContext
from vehicles.models import Vehicle, Type, MessurementUnit, FeatureList, VehicleFeature
from vehicles.serializers import VehicleFeaturesViewSerializer, VehicleFeaturesCreateUpdateSerializer

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "rentserv.settings")


class VehicleFeaturesApiTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='test_user')
        self.staff_user = User.objects.create_user(username='staff_user', is_staff=True)
        self.type_1 = Type.objects.create(name='Манипулятор')
        self.vehicle_1 = Vehicle.objects.create(name='Hyundai 100', vehicle_type=self.type_1)
        self.unit = MessurementUnit.objects.create(name='т')
        self.feature_1 = FeatureList.objects.create(name='Грузоподъемность борта')
        self.feature_2 = FeatureList.objects.create(name='Грузоподъемность стрелы')
        self.vehicle_feature = VehicleFeature.objects.create(feature=self.feature_1, unit=self.unit, value='5',
                                                             vehicle=self.vehicle_1)

    def test_get(self):
        url = reverse('vehiclefeature-list')
        with CaptureQueriesContext(connection) as queries:
            response = self.client.get(url)
            self.assertEqual(1, len(queries))
        features = VehicleFeature.objects.all()
        serializer_data = VehicleFeaturesCreateUpdateSerializer(features, many=True).data
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(serializer_data, response.data)

    def test_create(self):
        self.assertEqual(1, VehicleFeature.objects.all().count())
        url = reverse('vehiclefeature-list')
        data = {
            'feature': self.feature_2.id,
            'vehicle': self.vehicle_1.id,
            'value': 5,
            'unit': self.unit.id
        }
        json_data = json.dumps(data)
        self.client.force_login(self.staff_user)
        response = self.client.post(url, data=json_data,
                                    content_type='application/json')
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(2, VehicleFeature.objects.all().count())

    def test_create_same_vehicle_record(self):
        self.assertEqual(1, VehicleFeature.objects.all().count())
        url = reverse('vehiclefeature-list')
        data = {
            'feature': self.feature_1.id,
            'vehicle': self.vehicle_1.id,
            'value': 5,
            'unit': self.unit.id
        }
        json_data = json.dumps(data)
        self.client.force_login(self.staff_user)
        response = self.client.post(url, data=json_data,
                                    content_type='application/json')
        print(response.data)
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual(1, VehicleFeature.objects.all().count())
        self.assertEqual([ErrorDetail(string='Vehicle already has such feature', code='invalid')], response.data)

    def test_create_not_staff(self):
        self.assertEqual(1, VehicleFeature.objects.all().count())
        url = reverse('vehiclefeature-list')
        data = {
            'feature': self.feature_1.id,
            'vehicle': self.vehicle_1.id,
            'value': 5,
            'unit': self.unit.id
        }
        json_data = json.dumps(data)
        self.client.force_login(self.user)
        response = self.client.post(url, data=json_data,
                                    content_type='application/json')
        self.assertEqual(status.HTTP_403_FORBIDDEN, response.status_code)
        self.assertEqual({'detail': ErrorDetail(string='You do not have permission to perform this action.',
                                                code='permission_denied')}, response.data, response.data)
        self.assertEqual(1, VehicleFeature.objects.all().count())

    def test_delete(self):
        self.assertEqual(1, VehicleFeature.objects.all().count())
        url = reverse('vehiclefeature-detail', args=(self.vehicle_feature.id,))

        self.client.force_login(self.staff_user)
        response = self.client.delete(url)
        self.assertEqual(status.HTTP_204_NO_CONTENT, response.status_code)
        self.assertEqual(0, VehicleFeature.objects.all().count())

    def test_delete_not_staff(self):
        self.assertEqual(1, VehicleFeature.objects.all().count())
        url = reverse('vehiclefeature-detail', args=(self.vehicle_feature.id,))

        self.client.force_login(self.user)
        response = self.client.delete(url)
        self.assertEqual(status.HTTP_403_FORBIDDEN, response.status_code)
        self.assertEqual({'detail': ErrorDetail(string='You do not have permission to perform this action.',
                                                code='permission_denied')}
                         , response.data)
        self.assertEqual(1, VehicleFeature.objects.all().count())

    def test_update(self):
        url = reverse('vehiclefeature-detail', args=(self.vehicle_feature.id,))
        data = {
            'vehicle': self.vehicle_1.id,
            'feature': self.feature_1.id,
            'value': 10,
            'unit': self.unit.id
        }
        json_data = json.dumps(data)
        self.client.force_login(self.staff_user)
        response = self.client.put(url, data=json_data,
                                   content_type='application/json')
        self.assertEqual(status.HTTP_200_OK, response.status_code, response.data)
        self.vehicle_feature.refresh_from_db()
        self.assertEqual('10', self.vehicle_feature.value)

    def test_update_not_staff(self):
        url = reverse('vehiclefeature-detail', args=(self.vehicle_feature.id,))
        data = {
            'vehicle': self.vehicle_1.id,
            'feature': self.feature_1.id,
            'value': 10,
            'unit': self.unit.id
        }
        json_data = json.dumps(data)
        self.client.force_login(self.user)
        response = self.client.put(url, data=json_data,
                                   content_type='application/json')
        self.assertEqual(status.HTTP_403_FORBIDDEN, response.status_code)
        self.type_1.refresh_from_db()
        self.assertEqual('5', self.vehicle_feature.value)
