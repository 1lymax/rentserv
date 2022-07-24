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
from vehicles.serializers import VehicleFeaturesViewSerializer, VehicleFeaturesCreateUpdateSerializer, \
    VehicleTypeSerializer

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "rentserv.settings")


class TypeApiTestCase(APITestCase):
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
        url = reverse('type-list')
        with CaptureQueriesContext(connection) as queries:
            response = self.client.get(url)
            self.assertEqual(1, len(queries))
        types = Type.objects.all()
        serializer_data = VehicleTypeSerializer(types, many=True).data
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(serializer_data, response.data)

    # def test_get_filter(self):
    #     url = reverse('vehicle-list')
    #     vehicles = Vehicle.objects.all().annotate(
    #         vehicle_type_name=F('vehicle_type__name')
    #     ).prefetch_related('images').prefetch_related('features').filter(vehicle_type=1)
    #     response = self.client.get(url, data={'vehicle_type': 1})
    #     serializer_data = VehicleSerializer(vehicles, many=True).data
    #     self.assertEqual(status.HTTP_200_OK, response.status_code)
    #     self.assertEqual(serializer_data, response.data)

    # def test_order_asc(self):
    #     url = reverse('vehicle-list')
    #     vehicles = Vehicle.objects.all().annotate(
    #         vehicle_type_name=F('vehicle_type__name')
    #     ).prefetch_related('images').prefetch_related('features').order_by('name')
    #     response = self.client.get(url, data={'ordering': 'name'})
    #     serializer_data = VehicleSerializer(vehicles, many=True).data
    #     print(response.data, sep='\n\n')
    #     self.assertEqual(status.HTTP_200_OK, response.status_code)
    #     self.assertEqual(serializer_data, response.data)

    # def test_order_desc(self):
    #     url = reverse('vehicle-list')
    #     vehicles = Vehicle.objects.all().annotate(
    #         vehicle_type_name=F('vehicle_type__name')
    #     ).prefetch_related('images').prefetch_related('features').order_by('-vehicle_type_name')
    #     response = self.client.get(url, data={'ordering': '-vehicle_type_name'})
    #     serializer_data = VehicleSerializer(vehicles, many=True).data
    #     self.assertEqual(status.HTTP_200_OK, response.status_code)
    #     self.assertEqual(serializer_data, response.data)

    def test_create(self):
        self.assertEqual(1, Type.objects.all().count())
        url = reverse('type-list')
        data = {
            'name': 'Экскаватор'
        }
        json_data = json.dumps(data)
        self.client.force_login(self.staff_user)
        response = self.client.post(url, data=json_data,
                                    content_type='application/json')
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(2, Type.objects.all().count())

    def test_create_not_staff(self):
        self.assertEqual(1, Type.objects.all().count())
        url = reverse('type-list')
        data = {
            'name': 'Экскаватор'
        }
        json_data = json.dumps(data)
        self.client.force_login(self.user)
        response = self.client.post(url, data=json_data,
                                    content_type='application/json')
        self.assertEqual(status.HTTP_403_FORBIDDEN, response.status_code)
        self.assertEqual({'detail': ErrorDetail(string='You do not have permission to perform this action.',
                                                code='permission_denied')}, response.data, response.data)
        self.assertEqual(1, Type.objects.all().count())

    def test_delete(self):
        self.assertEqual(1, Type.objects.all().count())
        url = reverse('type-detail', args=(self.type_1.id,))

        self.client.force_login(self.staff_user)
        response = self.client.delete(url)
        self.assertEqual(status.HTTP_204_NO_CONTENT, response.status_code)
        self.assertEqual(0, Type.objects.all().count())

    def test_delete_not_staff(self):
        self.assertEqual(1, Type.objects.all().count())
        url = reverse('type-detail', args=(self.type_1.id,))

        self.client.force_login(self.user)
        response = self.client.delete(url)
        self.assertEqual(status.HTTP_403_FORBIDDEN, response.status_code)
        self.assertEqual({'detail': ErrorDetail(string='You do not have permission to perform this action.',
                                                code='permission_denied')}
                         , response.data)
        self.assertEqual(1, Type.objects.all().count())

    def test_update(self):
        url = reverse('type-detail', args=(self.type_1.id,))
        data = {
            'name': "Самосвал",
        }
        json_data = json.dumps(data)
        self.client.force_login(self.staff_user)
        response = self.client.put(url, data=json_data,
                                   content_type='application/json')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.type_1.refresh_from_db()
        self.assertEqual('Самосвал', self.type_1.name)

    def test_update_not_staff(self):
        url = reverse('type-detail', args=(self.type_1.id,))
        data = {
            'name': "Самосвал",
        }
        json_data = json.dumps(data)
        self.client.force_login(self.user)
        response = self.client.put(url, data=json_data,
                                   content_type='application/json')
        self.assertEqual(status.HTTP_403_FORBIDDEN, response.status_code)
        self.type_1.refresh_from_db()
        self.assertEqual('Манипулятор', self.type_1.name)