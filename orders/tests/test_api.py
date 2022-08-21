import json

from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.exceptions import ErrorDetail
from rest_framework.test import APITestCase

from orders.models import Order, OrderItem
from orders.serializers import OrderViewSerializer
from store.models import City, Store
from vehicles.models import Type, Vehicle
from vehicles.tests import test_get_token


class OrderApiTestCase(APITestCase):
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
        self.store_1 = Store.objects.create(city=self.city_1, vehicle=self.vehicle_1, quantity=5)
        self.store_2 = Store.objects.create(city=self.city_1, vehicle=self.vehicle_2, quantity=10)

        self.order_1 = Order.objects.create(user=self.user, first_name="Sergey", last_name="Ivanov",
                                            email="someone@google.com", phone="+380681587432",
                                            city=self.city_1)

        # self.orderitem_1 = OrderItem.objects.create(order=self.order_1, vehicle=self.vehicle_1,
        #                                            price=self.vehicle_1.price_region, quantity=5)
        # self.orderitem_2 = OrderItem.objects.create(order=self.order_1, vehicle=self.vehicle_2,
        #                                             price=self.vehicle_2.price_region, quantity=15)

    def test_get_not_owner(self):
        url = reverse('order_list')
        token = test_get_token(self.client)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        response = self.client.get(url)
        orders = Order.objects.all()
        serializer_data = OrderViewSerializer(orders, many=True).data
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(serializer_data, response.data)

    def test_get_owner(self):
        url = reverse('order_list')
        token = test_get_token(self.client, staff=False)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        self.order_3 = Order.objects.create(user=User.objects.get(username='test_user1'), first_name="Sergey",
                                            last_name="Ivanov",
                                            email="someone@google.com", phone="+380971587432",
                                            city=self.city_1)
        self.order_4 = Order.objects.create(user=User.objects.get(username='test_user1'), first_name="Petr",
                                            last_name="Cvetkov",
                                            email="someoneone@google.com", phone="+380971545432",
                                            city=self.city_1)
        response = self.client.get(url)
        orders = Order.objects.all().filter(user=User.objects.get(username='test_user1'))
        serializer_data = OrderViewSerializer(orders, many=True).data
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(serializer_data, response.data)

    def test_get_order_by_id(self):
        token = test_get_token(self.client, staff=False)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        self.order_3 = Order.objects.create(user=User.objects.get(username='test_user1'), first_name="Sergey",
                                            last_name="Ivanov",
                                            email="someone@google.com", phone="+380971587432",
                                            city=self.city_1)
        self.order_4 = Order.objects.create(user=User.objects.get(username='test_user1'), first_name="Petr",
                                            last_name="Cvetkov",
                                            email="someoneone@google.com", phone="+380971545432",
                                            city=self.city_1)
        url = reverse('order_detail', args=(self.order_4.id,))
        response = self.client.get(url)
        orders = Order.objects.all().filter(id=self.order_4.id)
        serializer_data = OrderViewSerializer(orders, many=True).data
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(serializer_data, response.data)

    def test_create_order(self):
        # token = test_get_token(self.client, staff=False)
        # self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        self.assertEqual(1, len(Order.objects.all()))
        self.assertEqual(0, len(OrderItem.objects.all().filter(order=2)))
        # add to cart
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
        # end add to cart

        data = {
            'first_name': 'Sergey',
            'last_name': 'Grekov',
            'email': 'someone@msn.com',
            'phone': '+380456324523',
            'city': self.city_1.id,
        }

        url = reverse('order_create')
        json_data = json.dumps(data)
        response = self.client.post(url, data=json_data, content_type='application/json')
        print(response.data)
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(2, len(Order.objects.all()))
        self.assertEqual(2, len(OrderItem.objects.all().filter(order=2)))

    def test_create_order_empty_cart_not_admin(self):
        self.assertEqual(1, len(Order.objects.all()))
        self.assertEqual(0, len(OrderItem.objects.all().filter(order=2)))
        # add to cart
        data = [
            #{"id": self.vehicle_1.id, "name": self.vehicle_1.name, "quantity": 9, "price": self.vehicle_1.price_region},
            #{"id": self.vehicle_2.id, "name": self.vehicle_2.name, "quantity": 10, "price": self.vehicle_2.price_region}
        ]
        for key in data:
            url = reverse('cart_add', args={key['id']})
            json_data = json.dumps(key)
            response = self.client.post(url, data=json_data,
                                        content_type='application/json')
            self.assertEqual(status.HTTP_200_OK, response.status_code)
        # end add to cart

        data = {
            'first_name': 'Sergey',
            'last_name': 'Grekov',
            'email': 'someone@msn.com',
            'phone': '+380456324523',
            'city': self.city_1.id,
        }

        url = reverse('order_create')
        json_data = json.dumps(data)
        response = self.client.post(url, data=json_data, content_type='application/json')
        print(response.data)
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual(2, len(Order.objects.all()))
        self.assertEqual(0, len(OrderItem.objects.all().filter(order=2)))


    def test_delete_order_not_staff(self):
        token = test_get_token(self.client, staff=False)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        self.assertEqual(1, len(Order.objects.all()))
        url = reverse('order_remove', args=(self.order_1.id,))
        response = self.client.delete(url)
        self.assertEqual(status.HTTP_403_FORBIDDEN, response.status_code)
        self.assertEqual({'detail': ErrorDetail(string='You do not have permission to perform this action.',
                                                code='permission_denied')}
                         , response.data)
        self.assertEqual(1, len(Order.objects.all()))

    def test_delete_order(self):
        token = test_get_token(self.client)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        self.assertEqual(1, len(Order.objects.all()))
        url = reverse('order_remove', args=(self.order_1.id,))
        response = self.client.delete(url)
        self.assertEqual(status.HTTP_204_NO_CONTENT, response.status_code)
        self.assertEqual(0, len(Order.objects.all()))

    def test_delete_orderitem_not_staff(self):
        token = test_get_token(self.client, staff=False)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        self.assertEqual(1, len(Order.objects.all()))
        url = reverse('orderitem_remove', args=(self.order_1.id,))
        response = self.client.delete(url)
        self.assertEqual(status.HTTP_403_FORBIDDEN, response.status_code)
        self.assertEqual({'detail': ErrorDetail(string='You do not have permission to perform this action.',
                                                code='permission_denied')}
                         , response.data)
        self.assertEqual(1, len(Order.objects.all()))

    def test_delete_orderitem(self):
        token = test_get_token(self.client)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        self.assertEqual(1, len(Order.objects.all()))
        url = reverse('orderitem_remove', args=(self.order_1.id,))
        response = self.client.delete(url)
        self.assertEqual(status.HTTP_204_NO_CONTENT, response.status_code)
        self.assertEqual(0, len(Order.objects.all()))