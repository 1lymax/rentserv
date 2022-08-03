from rest_framework import serializers as s
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .cart import Cart
from .serializers import CartSerializer


class CartViewSet(GenericAPIView):
    serializer_class = CartSerializer
    permission_classes = [AllowAny, ]

    def get(self, request):
        return Response(data={"cart": Cart(request.session).get()})

    def post(self, request, *args, **kwargs):
        cart = Cart(request.session)
        if not request.data.get('id') or not request.data.get('quantity'):
            raise s.ValidationError("Some parameters are missed")
        cart = cart.add(request.data['id'], request.data['quantity'])
        return Response(data={"cart": cart})
