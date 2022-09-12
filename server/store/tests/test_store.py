import json

from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.exceptions import ErrorDetail
from rest_framework.test import APITestCase

from store.models import Store, City
from store.serializers import StoreViewSerializer
from store.tests import test_get_token, bad_token
from vehicles.models import Type, Vehicle


class StoreApiTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='test_user')
        self.staff_user = User.objects.create_user(username='staff_user', is_staff=True)
        self.type_1 = Type.objects.create(name='Manipulator')
        self.type_2 = Type.objects.create(name='Excavator')
        self.vehicle_1 = Vehicle.objects.create(name='Hyundai 100', vehicle_type=self.type_1, price_cap=500,
                                                price_region=1000)
        self.vehicle_2 = Vehicle.objects.create(name='65115', vehicle_type=self.type_2, price_cap=1500,
                                                price_region=2000)

        self.city_1 = City.objects.create(name='Odessa')
        self.city_2 = City.objects.create(name='Kiev')
        self.store_1 = Store.objects.create(city=self.city_1, vehicle=self.vehicle_1, quantity=5)
        self.store_2 = Store.objects.create(city=self.city_2, vehicle=self.vehicle_2, quantity=10)

        token = test_get_token(self.client)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)

    def test_get(self):
        url = reverse('store-list')
        response = self.client.get(url)
        messure = Store.objects.all()
        serializer_data = StoreViewSerializer(messure, many=True).data
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(serializer_data, response.data['results'])

    def test_create(self):
        self.assertEqual(2, Store.objects.all().count())
        url = reverse('store-list')
        data = {
            'city': self.city_2.id,
            'vehicle': self.vehicle_1.id,
            'quantity': 3
        }
        json_data = json.dumps(data)
        self.client.force_login(self.staff_user)
        response = self.client.post(url, data=json_data,
                                    content_type='application/json')
        self.assertEqual(status.HTTP_201_CREATED, response.status_code, response.data)
        self.assertEqual(3, Store.objects.all().count())

    def test_create_same_record(self):
        self.assertEqual(2, Store.objects.all().count())
        url = reverse('store-list')
        data = {
            'city': self.city_2.id,
            'vehicle': self.vehicle_2.id,
            'quantity': 3
        }
        json_data = json.dumps(data)
        self.client.force_login(self.staff_user)
        response = self.client.post(url, data=json_data,
                                    content_type='application/json')
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code, response.data)
        self.assertEqual(2, Store.objects.all().count())
        self.assertEqual([ErrorDetail(string='This name is already exists', code='invalid')], response.data)

    def test_create_not_staff(self):
        self.assertEqual(2, Store.objects.all().count())
        url = reverse('store-list')
        data = {
            'city': self.city_2.id,
            'vehicle': self.vehicle_1.id,
            'quantity': 3
        }
        json_data = json.dumps(data)
        self.client.credentials(HTTP_AUTHORIZATION=bad_token())
        self.client.force_login(self.user)
        response = self.client.post(url, data=json_data,
                                    content_type='application/json')
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)
        self.assertEqual(2, Store.objects.all().count())

    def test_delete(self):
        self.assertEqual(2, Store.objects.all().count())
        url = reverse('store-detail', args=(self.store_1.id,))

        self.client.force_login(self.staff_user)
        response = self.client.delete(url)
        self.assertEqual(status.HTTP_204_NO_CONTENT, response.status_code)
        self.assertEqual(1, Store.objects.all().count())

    def test_delete_not_staff(self):
        self.assertEqual(2, Store.objects.all().count())
        url = reverse('store-detail', args=(self.store_1.id,))
        self.client.credentials(HTTP_AUTHORIZATION=bad_token())
        self.client.force_login(self.user)
        response = self.client.delete(url)
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)
        self.assertEqual(2, Store.objects.all().count())

    def test_update(self):
        url = reverse('store-detail', args=(self.store_1.id,))
        data = {
            'city': self.city_2.id,
            'vehicle': self.vehicle_1.id,
            'quantity': 3
        }
        json_data = json.dumps(data)
        self.client.force_login(self.staff_user)
        response = self.client.put(url, data=json_data,
                                   content_type='application/json')
        self.assertEqual(status.HTTP_200_OK, response.status_code, response.data)
        self.store_1.refresh_from_db()
        self.assertEqual(3, self.store_1.quantity)

    def test_update_not_staff(self):
        url = reverse('store-detail', args=(self.store_1.id,))
        data = {
            'quantity': 7
        }
        json_data = json.dumps(data)
        self.client.credentials(HTTP_AUTHORIZATION=bad_token())
        self.client.force_login(self.user)
        response = self.client.put(url, data=json_data,
                                   content_type='application/json')
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)
        self.store_1.refresh_from_db()
        self.assertEqual(5, self.store_1.quantity)