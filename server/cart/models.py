from django.db import models

from vehicles.models import Vehicle


class Cart(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True)

    quantity = models.IntegerField(max_length=5)

    def __str__(self):
        return 'Cart {}'.format(self.id)
