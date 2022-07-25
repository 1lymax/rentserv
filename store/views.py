from rest_framework.viewsets import ModelViewSet

from store.models import City, Store
from store.serializers import CitySerializer, StoreViewSerializer
from vehicles.permissions import IsStaffOrReadOnly


class CityViewSet(ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    permission_classes = [IsStaffOrReadOnly]


class StoreViewSet(ModelViewSet):
    queryset = Store.objects.all()
    serializer_class = StoreViewSerializer
    permission_classes = [IsStaffOrReadOnly]
    depth = 1
