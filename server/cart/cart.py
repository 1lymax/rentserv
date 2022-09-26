from decimal import Decimal

from django.db import models
from django.http import request
from rest_framework import serializers

from rentserv import settings
from vehicles.models import Vehicle, VehicleImage


class Cart():

    def __init__(self, session):
        self.session = session
        cart = self.session.get(settings.CART_SESSION_ID)
        if not cart:
            cart = self.session[settings.CART_SESSION_ID] = {}
            print('new session')
        self.cart = cart

    def get(self):
        # if item['price'] and item
        total_items = total_price = 0
        ids = []
        try:
            for item in self.cart.values():
                if 'name' in item:
                    total_price += Decimal(item['price']) * int(item['quantity'])
                    total_items += int(item['quantity'])
        except TypeError:
            total_price = total_items = 0
        cart_with_total = self.cart
        cart_with_total.update({"total": {"quantity": total_items, "price": str(total_price)}})

        return cart_with_total

    def add(self, vehicle_id, quantity=1):

        try:
            vehicle = Vehicle.objects.get(pk=int(vehicle_id))
            # images = VehicleImage.objects.get(vehicle=int(vehicle_id))
        except models.ObjectDoesNotExist:
            raise serializers.ValidationError("Vehicle not found")
        is_in_cart = False
        for vehicle_in_cart in self.cart:
            if vehicle_in_cart == vehicle.id:
                is_in_cart = True
                self.cart[self.cart.index(vehicle_in_cart)] = {
                    str(vehicle.id):
                        {"id": vehicle.id, "name": vehicle.name, "image": "", "quantity": quantity, "price": float(vehicle.price_region)}}

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
        if id in self.cart:
            del self.cart[id]
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


    def clear(self):
        del self.session[settings.CART_SESSION_ID]
        self.session.modified = True
