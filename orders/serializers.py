from rest_framework.serializers import ModelSerializer

from orders.models import Order, OrderItem


class OrderViewSerializer(ModelSerializer):
    class Meta:
        model = Order
        fields = ['user', 'first_name', 'last_name', 'email', 'phone', 'city', 'paid', 'done']


class OrderItemSerializer(ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['order', 'vehicle', 'quantity', 'price']
