from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import serializers
from rest_framework.filters import OrderingFilter
from rest_framework.viewsets import ModelViewSet

from store.models import City, Store
from store.pagination import PaginationVehicleWithAggregates
from store.serializers import CitySerializer, StoreViewSerializer
from vehicles.pagination import SetPagination
from vehicles.permissions import IsStaffOrReadOnly


class CityViewSet(ModelViewSet):
    queryset = City.objects.all().order_by('id')
    serializer_class = CitySerializer
    permission_classes = [IsStaffOrReadOnly]
    pagination_class = SetPagination
    filter_backends = [DjangoFilterBackend,]
    filterset_fields = ['id',]

    def filter_queryset(self, request):
        self.queryset = super().filter_queryset(request)
        predicate = self.request.query_params
        if predicate.get('name', None) is not None:
            self.queryset = self.queryset.filter(name__icontains=predicate['name'])

        return self.queryset

    def perform_create(self, serializer):
        # Check for existence of the record with the same feature name
        data = serializer.validated_data
        qs = City.objects.all().filter(name=data['name'])
        if (len(qs)) == 0:
            serializer.save()
        else:
            raise serializers.ValidationError("This name is already exists")

class StoreCreateUpdateGetSet(ModelViewSet):
    queryset = Store.objects.all().order_by('id')
    serializer_class = StoreViewSerializer
    permission_classes = [IsStaffOrReadOnly]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    pagination_class = PaginationVehicleWithAggregates
    filterset_fields = ['id', 'city', 'vehicle']


    def perform_create(self, serializer):
        # Check for existence of the record with the same feature name
        data = serializer.validated_data
        qs = Store.objects.all().filter(vehicle=data['vehicle'], city=data['city'])
        if (len(qs)) == 0:
            serializer.save()
        else:
            raise serializers.ValidationError("This name is already exists")
