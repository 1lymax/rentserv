from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from store.serializers import StoreViewSerializer
from vehicles.models import Vehicle, Type, FeatureList, VehicleFeature, VehicleImage, MessurementUnit


class VehicleFeaturesCreateUpdateSerializer(ModelSerializer):
    class Meta:
        model = VehicleFeature
        fields = ('id', 'vehicle', 'value', 'feature', 'unit')



class VehicleFeaturesViewSerializer(ModelSerializer):
    class Meta:
        model = VehicleFeature
        fields = ('id', 'value', 'feature', 'unit') #, 'feature_name', 'unit_name')


class VehicleImageSerializer(ModelSerializer):
    class Meta:
        model = VehicleImage
        fields = ('id', 'vehicle', 'image')


class VehicleSerializer(ModelSerializer):
    vehicle_type_name = serializers.CharField(read_only=True)
    images = VehicleImageSerializer(many=True, read_only=True)
    features = VehicleFeaturesViewSerializer(many=True, read_only=True)
    store = StoreViewSerializer(many=True, read_only=True)

    class Meta:
        model = Vehicle
        fields = (
            'id', 'name', 'vehicle_type', 'vehicle_type_name', 'price_cap', 'price_region', 'images', 'features', 'store')


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
        fields = ['id', 'name']


class MessurementUnitSerializer(ModelSerializer):
    class Meta:
        model = MessurementUnit
        fields = ['id', 'name']


class TypeSerializer(ModelSerializer):
    class Meta:
        model = Type
        fields = ['id', 'name']

