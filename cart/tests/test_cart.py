import json

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from cart.serializers import CartSerializer
from vehicles.models import Type, Vehicle


class CartApiTestCase(APITestCase):
    def setUp(self):
        self.type_1 = Type.objects.create(name='Манипулятор')
        self.type_2 = Type.objects.create(name='Экскаватор')
        self.vehicle_1 = Vehicle.objects.create(name='Hyundai 100',
                                                price_cap=500, price_region=600, vehicle_type=self.type_1)
        self.vehicle_2 = Vehicle.objects.create(name='Hyundai 200',
                                                price_cap=600, price_region=700, vehicle_type=self.type_2)

    def test_create_and_get(self):
        data = [
            {"id": self.vehicle_1.id, "name": self.vehicle_1.name, "quantity": 9, "price": self.vehicle_1.price_region},
            {"id": self.vehicle_2.id, "name": self.vehicle_2.name, "quantity": 10, "price": self.vehicle_2.price_region}
        ]
        for key in data:
            url = reverse('cart_add', args={key['id']})
            json_data = json.dumps(key)
            response = self.client.post(url, data=json_data,
                                        content_type='application/json')
            self.assertEqual(status.HTTP_200_OK, response.status_code)

        url = reverse('cart_detail')
        response = self.client.get(url)
        compare_data = {'cart': {'1': {'id': 1, 'name': 'Hyundai 100', 'quantity': 9, 'price': 600.0},
                                 '2': {'id': 2, 'name': 'Hyundai 200', 'quantity': 10, 'price': 700.0},
                                 'total_items': 19,
                                 'total_price': 12400}}
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(compare_data, response.data)
