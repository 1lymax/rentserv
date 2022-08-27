from django.db.models import F
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import serializers
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from vehicles.models import Vehicle, Type, VehicleFeature, FeatureList, MessurementUnit
from vehicles.permissions import IsStaffOrReadOnly
from vehicles.serializers import VehicleSerializer, TypeSerializer, VehicleFeaturesCreateUpdateSerializer, \
    FeatureListSerializer, MessurementUnitSerializer


class TypeViewSet(ModelViewSet):
    queryset = Type.objects.all()
    serializer_class = TypeSerializer
    permission_classes = [IsStaffOrReadOnly]

    def perform_create(self, serializer):
        # Check for existence of the record with the same feature name
        data = serializer.validated_data
        qs = Type.objects.all().filter(name=data['name'])
        if (len(qs)) == 0:
            serializer.save()
        else:
            raise serializers.ValidationError("This name is already exists")

def get_drinks(number_of_guests: int) -> int:
    # write your code here
    number_of_drinks = 0
    for i in range(1, number_of_guests+1, 1):
        number_of_drinks += i
    return number_of_drinks
    pass

print('get_drinks(3)', get_drinks(5))




class VehicleViewSet(ModelViewSet):
    queryset = Vehicle.objects.all().annotate(
        vehicle_type_name=F('vehicle_type__name')
    ).prefetch_related('images').prefetch_related('features').prefetch_related('store').distinct()
    serializer_class = VehicleSerializer
    pagination_class = PageNumberPagination
    page_size = 2
    permission_classes = [IsStaffOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['id', 'vehicle_type', 'name',
                        'vehicle_type__name', 'features__feature', 'features__unit', 'features__value', 'store__city']
    ordering_fields = ['name', 'vehicle_type_name', 'price_cap']
    search_fields = ['name', 'vehicle_type_name']


    def filter_queryset(self, request):
        self.queryset = super().filter_queryset(request)

        predicate = self.request.query_params  # or request.data for POST
        if predicate.get('min_price_cap', None) is not None:
            self.queryset = self.queryset.filter(price_cap__gte=predicate['min_price_cap'])
        if predicate.get('max_price_cap', None) is not None:
            self.queryset = self.queryset.filter(price_cap__lte=predicate['max_price_cap'])
        if predicate.get('min_price_region', None) is not None:
            self.queryset = self.queryset.filter(price_region__gte=predicate['min_price_region'])
        if predicate.get('max_price_region', None) is not None:
            self.queryset = self.queryset.filter(price_region__lte=predicate['max_price_region'])
        if predicate.get('min_features__value', None) is not None:
            self.queryset = self.queryset.filter(features__value__gte=predicate['min_features__value'])
        if predicate.get('max_features__value', None) is not None:
            self.queryset = self.queryset.filter(features__value__lte=predicate['max_features__value'])

        return self.queryset


class VehicleFeatureViewSet(ModelViewSet):
    queryset = VehicleFeature.objects.all()
    serializer_class = VehicleFeaturesCreateUpdateSerializer
    permission_classes = [IsStaffOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['vehicle', 'feature']

    def perform_create(self, serializer):
        # Check for existence of the record with the same feature on the same vehicle
        data = serializer.validated_data
        qs = VehicleFeature.objects.all().filter(vehicle=data['vehicle'], feature=data['feature'])
        if (len(qs)) == 0:
            serializer.save()
        else:
            raise serializers.ValidationError("Vehicle already has such feature")


class FeatureListViewSet(ModelViewSet):
    queryset = FeatureList.objects.all()
    serializer_class = FeatureListSerializer
    permission_classes = [IsStaffOrReadOnly]

    def perform_create(self, serializer):
        # Check for existence of the record with the same feature name
        data = serializer.validated_data
        qs = FeatureList.objects.all().filter(name=data['name'])
        if (len(qs)) == 0:
            serializer.save()
        else:
            raise serializers.ValidationError("This name is already exists")


class MessurementUnitViewSet(ModelViewSet):
    queryset = MessurementUnit.objects.all()
    serializer_class = MessurementUnitSerializer
    permission_classes = [IsStaffOrReadOnly]

    def perform_create(self, serializer):
        # Check for existence of the record with the same feature name
        data = serializer.validated_data
        qs = MessurementUnit.objects.all().filter(name=data['name'])
        if (len(qs)) == 0:
            serializer.save()
        else:
            raise serializers.ValidationError("This name is already exists")