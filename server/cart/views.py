from rest_framework import serializers as s
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from rentserv import settings
from .cart import Cart


class CartViewSet(GenericAPIView):
    permission_classes = [AllowAny, ]

    def get(self, request):
        return Response(data={settings.CART_SESSION_ID: Cart(request.session).get()})

    def post(self, request, *args, **kwargs):
        cart = Cart(request.session)
        print(request.data)
        if not request.data.get('id') or not request.data.get('quantity'):
            raise s.ValidationError("Some parameters are missed")
        cart = cart.add(request.data['id'], request.data['quantity'])
        return Response(data={settings.CART_SESSION_ID: cart})

    def delete(self, request, *args, **kwargs):
        cart = Cart(request.session)
        cart = cart.remove(kwargs['id'])
        return Response(data={settings.CART_SESSION_ID: cart})