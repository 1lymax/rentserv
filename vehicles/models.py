from django.db import models


# Create your models here.
from rest_framework.exceptions import ErrorDetail


class Type(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, default='')

    def __str__(self):
        return self.name


class FeatureList(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=200, default='')

    def __str__(self):
        return self.name


class MessurementUnit(models.Model):
    name = models.CharField(max_length=20)

    def __str__(self):
        return self.name


class Vehicle(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, default='')
    vehicle_type = models.ForeignKey(Type, null=True, on_delete=models.CASCADE)
    price_cap = models.DecimalField(max_digits=7, decimal_places=0, null=True)
    price_region = models.DecimalField(max_digits=7, decimal_places=0, null=True)

    # vehicle_feature = models.ForeignKey()

    def __str__(self):
        return self.name


class VehicleImage(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='vehicle/', blank=True)




class VehicleFeature(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='features')
    feature = models.ForeignKey(FeatureList, on_delete=models.CASCADE)
    value = models.CharField(max_length=100)
    unit = models.ForeignKey(MessurementUnit, on_delete=models.SET_NULL, null=True)


    def __str__(self):
        return f'{self.vehicle} -- {self.feature}, {self.value} {self.unit}'

