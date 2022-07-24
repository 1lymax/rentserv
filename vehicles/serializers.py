from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from django_filters import rest_framework as filters

from vehicles.models import Vehicle, Type, FeatureList, VehicleFeature, VehicleImage


class VehicleFeaturesCreateUpdateSerializer(ModelSerializer):
    class Meta:
        model = VehicleFeature
        fields = ('vehicle', 'value', 'feature', 'unit')


class VehicleFeaturesViewSerializer(ModelSerializer):
    class Meta:
        model = VehicleFeature
        fields = ('value', 'feature', 'unit')
        depth = 1


class VehicleImageSerializer(ModelSerializer):
    class Meta:
        model = VehicleImage
        exclude = ['vehicle']
        # fields = ('__all__')


class VehicleTypeSerializer(ModelSerializer):
    class Meta:
        model = Type
        fields = ['name']


class VehicleSerializer(ModelSerializer):
    vehicle_type_name = serializers.CharField(read_only=True)
    images = VehicleImageSerializer(many=True, read_only=True)
    features = VehicleFeaturesViewSerializer(many=True, read_only=True)

    class Meta:
        model = Vehicle
        fields = ('name', 'vehicle_type', 'vehicle_type_name', 'price_cap', 'price_region', 'images', 'features')


# class VehicleFilter(filters.FilterSet):
#     feature = filters.IntegerField(method='filter_feature')
#
#     class Meta:
#         fields = ('feature')
#
#     def filter_feature(self, queryset, name, value):
#         return queryset.filter(featureslist__fe)

class FeatureListSerializer(ModelSerializer):
    class Meta:
        model = FeatureList
        fields = ['name']

