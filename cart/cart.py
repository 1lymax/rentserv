from decimal import Decimal

from django.conf import settings
from django.db import models
from rest_framework import serializers

from vehicles.models import Vehicle


class Cart(object):

    def __init__(self, session):
        self.session = session
        cart = self.session.get(settings.CART_SESSION_ID)
        if not cart:
            cart = self.session[settings.CART_SESSION_ID] = {}
        self.cart = cart

    def get(self):
        total_price = (sum(Decimal(item['price']) * item['quantity'] for item in
                       self.cart.values()))
        total_items = (sum(item['quantity'] for item in
                       self.cart.values()))
        cart_with_total = self.cart
        cart_with_total.update({"total_items": total_items, "total_price": total_price})

        return cart_with_total

    def add(self, vehicle_id, quantity=1):

        try:
            vehicle = Vehicle.objects.get(pk=int(vehicle_id))
        except models.ObjectDoesNotExist:
            raise serializers.ValidationError("Vehicle not found")
        is_in_cart = False
        for vehicle_in_cart in self.cart:
            if vehicle_in_cart == vehicle.id:
                is_in_cart = True
                self.cart[self.cart.index(vehicle_in_cart)] = {
                    str(vehicle.id):
                        {"id": vehicle.id, "name": vehicle.name, "quantity": quantity, "price": float(vehicle.price_region)}}

        if not is_in_cart:
            self.cart.update(
                {
                    str(vehicle.id):
                    {"id": vehicle.id, "name": vehicle.name, "quantity": quantity, "price": float(vehicle.price_region)}})

        self.save()
        return self.cart

    def save(self):
        self.session[settings.CART_SESSION_ID] = self.cart
        self.session.modified = True

    def remove(self, id):
        vehicle_id = str(id)
        if vehicle_id in self.cart:
            del self.cart[vehicle_id]
            self.save()
        return self.cart

    def __iter__(self):
        vehicle_ids = self.cart.keys()
        vehicles = Vehicle.objects.filter(id__in=vehicle_ids)
        for vehicle in vehicles:
            self.cart[str(vehicle.id)]['vehicle'] = vehicle

        for item in self.cart.values():
            item['price'] = Decimal(item['price'])
            item['total_price'] = item['price'] * item['quantity']
            yield item

    def __len__(self):
        return len(self.cart)

    def get_total_price(self):
        return sum(Decimal(item['price']) * item['quantity'] for item in
                   self.cart.values())

    def clear(self):
        del self.session[settings.CART_SESSION_ID]
        self.session.modified = True
