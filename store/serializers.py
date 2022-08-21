from rest_framework.serializers import ModelSerializer

from store.models import City, Store


class CitySerializer(ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name']


class StoreViewSerializer(ModelSerializer):
    class Meta:
        model = Store
        fields = ['id', 'city', 'vehicle', 'quantity']  # , 'city_name']
