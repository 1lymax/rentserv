from django.db.models import F
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import serializers
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from vehicles.models import Vehicle, Type, VehicleFeature
from vehicles.permissions import IsStaffOrReadOnly
from vehicles.serializers import VehicleSerializer, VehicleTypeSerializer, VehicleFeaturesCreateUpdateSerializer


class TypeViewSet(ModelViewSet):
    queryset = Type.objects.all()
    serializer_class = VehicleTypeSerializer
    permission_classes = [IsStaffOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]


class VehicleViewSet(ModelViewSet):
    queryset = Vehicle.objects.all().annotate(
        vehicle_type_name=F('vehicle_type__name')
    ).prefetch_related('images').prefetch_related('features').distinct()
    serializer_class = VehicleSerializer
    permission_classes = [IsStaffOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['vehicle_type', 'name',
                        'vehicle_type__name', 'features__feature', 'features__unit', 'features__value']
    # filter_class = VehicleFilter
    ordering_fields = ['name', 'vehicle_type_name']
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

    def perform_create(self, serializer):
        # Check for existence of the record with the same feature on the same vehicle
        data = serializer.validated_data
        qs = VehicleFeature.objects.all().filter(vehicle=data['vehicle'], feature=data['feature'])
        if (len(qs)) == 0:
            serializer.save()
        else:
            raise serializers.ValidationError("Vehicle already has such feature")
