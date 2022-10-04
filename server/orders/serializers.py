from rest_framework.serializers import ModelSerializer

from orders.models import Order, OrderItem


class OrderViewSerializer(ModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'user', 'first_name', 'last_name', 'email', 'phone', 'city', 'paid', 'done']


class OrderItemSerializer(ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'vehicle', 'quantity', 'price']
