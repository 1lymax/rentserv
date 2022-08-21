from rest_framework import serializers, status
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from cart.cart import Cart
from orders.models import Order, OrderItem
from orders.serializers import OrderViewSerializer, OrderItemSerializer
from vehicles.models import Vehicle


class OrderViewSet(ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderViewSerializer
    permission_classes = [IsAuthenticated]

    def filter_queryset(self, request):
        self.queryset = super().filter_queryset(request)
        if self.kwargs.get('id'):
            self.queryset = self.queryset.filter(id=self.kwargs.get('id'))
        if not self.request.user.is_staff:
            return self.queryset.filter(user=self.request.user)

        return self.queryset


class OrderRemoveViewSet(ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderViewSerializer
    permission_classes = [IsAdminUser]


class OrderCreateViewSet(ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderViewSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = OrderViewSerializer(data=request.data)

        if serializer.is_valid():
            if request.user and request.user.is_authenticated:
                serializer.validated_data['user'] = self.request.user
            order = serializer.save()
            cart = Cart(request.session)
            if len(cart)==0 and not request.user.is_staff:
                raise serializers.ValidationError('Cart is empty')
            for item in cart:
                vehicle = Vehicle.objects.get(id=item['id'])
                OrderItem.objects.create(order=order, vehicle=vehicle, quantity=item['quantity'], price=vehicle.price_region)
            cart.clear()
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderItemViewSet(ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated]

    def filter_queryset(self, request):
        self.queryset = super().filter_queryset(request)
        if self.kwargs.get('id'):
            self.queryset = self.queryset.filter(id=self.kwargs.get('id'))
        if not self.request.user.is_staff:
            return self.queryset.filter(user=self.request.user)

        return self.queryset


class OrderItemCreateViewSet(ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [AllowAny]


class OrderItemRemoveViewSet(ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [IsAdminUser]