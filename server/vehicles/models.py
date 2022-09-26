import os

from PIL import Image
from django.db import models

from rentserv.settings import MEDIA_URL


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


    def __str__(self):
        return self.name

def content_file_name(instance, filename):
    ext = filename.split('.')[-1]
    filename = "%s.%s" % (instance.vehicle.name, ext)
    filename = filename.lower().replace(" ", "_")
    return os.path.join('vehicle/', filename)

def get_extra_image_name (filename, postfix):
    filename = str(filename)
    ext = filename.split('.')[-1]
    name = filename[0:len(filename) - len(ext) - 1]
    return os.path.join(MEDIA_URL, name + postfix + '.' + ext)


class VehicleImage(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to=content_file_name, blank=True, )
    main_image = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.image:
            super().save(*args, **kwargs)
            img = Image.open(self.image.path)
            output_size = (100, 100)
            img.thumbnail(output_size)
            img.save(get_extra_image_name(self.image.path, '_thumb'))



class VehicleFeature(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='features')
    feature = models.ForeignKey(FeatureList, on_delete=models.CASCADE)
    value = models.CharField(max_length=100)
    unit = models.ForeignKey(MessurementUnit, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f'{self.vehicle} -- {self.feature}, {self.value} {self.unit}'
