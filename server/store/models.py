from django.db import models

from vehicles.models import Vehicle


class City(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Store(models.Model):
    city = models.ForeignKey(City, on_delete=models.CASCADE)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='store')
    quantity = models.PositiveSmallIntegerField()

    def __str__(self):
        return f'{self.city}: {self.vehicle.name} -- {self.quantity}'
