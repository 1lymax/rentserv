import json
import os

from django.contrib.auth.models import User
from django.db import connection
from django.db.models import F
from django.test.utils import CaptureQueriesContext
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from store.models import City, Store
from vehicles.models import Vehicle, Type, MessurementUnit, FeatureList, VehicleFeature
from vehicles.serializers import VehicleSerializer
from vehicles.tests import test_get_token

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "rentserv.settings")


class VehiclesApiTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='test_user')
        self.staff_user = User.objects.create_user(username='staff_user', is_staff=True)
        self.type_1 = Type.objects.create(name='Манипулятор')
        self.type_2 = Type.objects.create(name='Экскаватор')
        self.vehicle_1 = Vehicle.objects.create(name='Hyundai 100',
                                                price_cap=500, price_region=600, vehicle_type=self.type_1)
        self.vehicle_2 = Vehicle.objects.create(name='Isuzu Forward 12.0',
                                                price_cap=600, price_region=700, vehicle_type=self.type_1)
        self.vehicle_3 = Vehicle.objects.create(name='КамАЗ 65115',
                                                price_cap=700, price_region=800, vehicle_type=self.type_2)
        self.unit = MessurementUnit.objects.create(name='т')
        self.feature = FeatureList.objects.create(name='Грузоподъемность борта')
        self.feature_2 = FeatureList.objects.create(name='Грузоподъемность стрелы')
        self.vehicle_feature = VehicleFeature.objects.create(feature=self.feature, unit=self.unit, value='5',
                                                             vehicle=self.vehicle_1)
        self.vehicle_feature_2 = VehicleFeature.objects.create(feature=self.feature_2, unit=self.unit, value='10',
                                                               vehicle=self.vehicle_1)
        self.city_1 = City.objects.create(name='Kiev')
        self.city_2 = City.objects.create(name='Odessa')
        self.store_1 = Store.objects.create(vehicle=self.vehicle_1, quantity=3, city=self.city_1)
        self.store_2 = Store.objects.create(vehicle=self.vehicle_1, quantity=5, city=self.city_2)
        self.store_3 = Store.objects.create(vehicle=self.vehicle_2, quantity=4, city=self.city_1)

        self.qs = Vehicle.objects.all().annotate(
            vehicle_type_name=F('vehicle_type__name')
        ).prefetch_related('images').prefetch_related('features').prefetch_related('store').distinct()

        token = test_get_token(self.client)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)

    def test_get(self):
        url = reverse('vehicle-list')
        with CaptureQueriesContext(connection) as queries:
            response = self.client.get(url)
            self.assertEqual(7, len(queries))

        serializer_data = VehicleSerializer(self.qs, many=True).data
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(serializer_data, response.data['results'])

    def test_filter(self):
        url = reverse('vehicle-list')
        response = self.client.get(url, data={'vehicle_type': 1})
        vehicles = self.qs.filter(vehicle_type=1)
        serializer_data = VehicleSerializer(vehicles, many=True).data
        self.assertEqual(len(serializer_data), len(response.data['results']))
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(serializer_data, response.data['results'])

    def test_filter_price_cap_min_max(self):
        url = reverse('vehicle-list')
        response = self.client.get(url, data={'min_price_cap': 600, 'max_price_cap': 650})
        vehicles = self.qs.filter(price_cap__gte=600).filter(price_cap__lte=650)
        serializer_data = VehicleSerializer(vehicles, many=True).data
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(len(serializer_data), len(response.data['results']))
        self.assertEqual(1, vehicles.count())
        self.assertEqual(serializer_data, response.data['results'])

    def test_filter_price_region_min_max(self):
        url = reverse('vehicle-list')
        response = self.client.get(url, data={'min_price_region': 600, 'max_price_region': 700})
        vehicles = self.qs.filter(price_region__gte=600).filter(price_region__lte=700)
        serializer_data = VehicleSerializer(vehicles, many=True).data
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(serializer_data, response.data['results'])
        self.assertEqual(2, vehicles.count())

    def test_filter_feature_value(self):
        url = reverse('vehicle-list')
        response = self.client.get(url, data={'features__value': 5})
        vehicles = self.qs.filter(features__value=5)
        serializer_data = VehicleSerializer(vehicles, many=True).data
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(serializer_data, response.data['results'])
        self.assertEqual(1, vehicles.count(), response.data)

    def test_filter_feature_min_max(self):
        url = reverse('vehicle-list')
        response = self.client.get(url, data={'min_features__value': 5, 'max_features__value': 7})
        vehicles = self.qs.filter(features__value__gte=5).filter(features__value__lte=5)
        serializer_data = VehicleSerializer(vehicles, many=True).data
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(serializer_data, response.data['results'])
        self.assertEqual(1, vehicles.count(), response.data)

    def test_order_asc(self):
        url = reverse('vehicle-list')
        response = self.client.get(url, data={'ordering': 'name'})
        vehicles = self.qs.order_by('name')
        serializer_data = VehicleSerializer(vehicles, many=True).data
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(serializer_data, response.data['results'])

    def test_order_desc(self):
        url = reverse('vehicle-list')
        response = self.client.get(url, data={'ordering': '-vehicle_type_name'})
        vehicles = self.qs.order_by('-vehicle_type_name')
        serializer_data = VehicleSerializer(vehicles, many=True).data
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(serializer_data, response.data['results'])

    def test_create(self):
        self.assertEqual(3, Vehicle.objects.all().count())
        url = reverse('vehicle-list')
        data = {
            'name': 'Programming in Python 3',
            'type': self.type_1.id,
        }
        json_data = json.dumps(data)
        self.client.force_login(self.staff_user)
        response = self.client.post(url, data=json_data,
                                    content_type='application/json')
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(4, Vehicle.objects.all().count())

    def test_create_not_staff(self):
        self.assertEqual(3, Vehicle.objects.all().count())
        url = reverse('vehicle-list')
        data = {
            'name': 'Programming in Python 3',
            'type': self.type_1.id,
        }
        json_data = json.dumps(data)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer')
        self.client.force_login(self.user)
        response = self.client.post(url, data=json_data,
                                    content_type='application/json')
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)
        self.assertEqual(3, Vehicle.objects.all().count())

    def test_delete(self):
        self.assertEqual(3, Vehicle.objects.all().count())
        url = reverse('vehicle-detail', args=(self.vehicle_1.id,))

        self.client.force_login(self.staff_user)
        response = self.client.delete(url)
        self.assertEqual(status.HTTP_204_NO_CONTENT, response.status_code)
        self.assertEqual(2, Vehicle.objects.all().count())

    def test_delete_not_staff(self):
        self.assertEqual(3, Vehicle.objects.all().count())
        url = reverse('vehicle-detail', args=(self.vehicle_1.id,))

        self.client.credentials(HTTP_AUTHORIZATION='Bearer')
        self.client.force_login(self.user)
        response = self.client.delete(url)
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)
        self.assertEqual(3, Vehicle.objects.all().count())

    def test_update(self):
        url = reverse('vehicle-detail', args=(self.vehicle_1.id,))
        data = {
            "name": "Isuzu 12345",
        }
        json_data = json.dumps(data)
        # self.client.force_login(self.staff_user)
        response = self.client.put(url, data=json_data,
                                   content_type='application/json')
        self.assertEqual(status.HTTP_200_OK, response.status_code, response.data)
        self.vehicle_1.refresh_from_db()
        self.assertEqual('Isuzu 12345', self.vehicle_1.name)

    def test_update_not_staff(self):
        url = reverse('vehicle-detail', args=(self.vehicle_1.id,))
        data = {
            "name": "Isuzu 12345",
        }
        json_data = json.dumps(data)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer')
        self.client.force_login(self.user)
        response = self.client.put(url, data=json_data,
                                   content_type='application/json')
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)
        self.vehicle_1.refresh_from_db()
        self.assertEqual('Hyundai 100', self.vehicle_1.name)
