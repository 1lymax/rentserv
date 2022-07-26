from django.db import connection
from django.db.models import F
from django.test import TestCase
from django.test.utils import CaptureQueriesContext
from rest_framework.utils import json

from store.models import City, Store
from vehicles.models import Type, Vehicle, MessurementUnit, FeatureList, VehicleFeature, VehicleImage
from vehicles.serializers import VehicleSerializer, FeatureListSerializer, MessurementUnitSerializer, \
    VehicleFeaturesViewSerializer


class VehicleSerializerTestCase(TestCase):
    def setUp(self):
        self.type_1 = Type.objects.create(name='Manipulator')
        self.type_2 = Type.objects.create(name='Excavator')
        self.vehicle_1 = Vehicle.objects.create(name='Hyundai 100', vehicle_type=self.type_1, price_cap=500,
                                                price_region=1000)
        self.vehicle_2 = Vehicle.objects.create(name='65115', vehicle_type=self.type_2, price_cap=1500,
                                                price_region=2000)
        self.unit = MessurementUnit.objects.create(name='tons')
        self.feature_1 = FeatureList.objects.create(name='Weight')
        self.feature_2 = FeatureList.objects.create(name='Weight 2')
        self.vehicle_feature_1 = VehicleFeature.objects.create(feature=self.feature_1, unit=self.unit, value='5',
                                                               vehicle=self.vehicle_1)
        self.vehicle_feature_2 = VehicleFeature.objects.create(feature=self.feature_2, unit=self.unit, value='10',
                                                               vehicle=self.vehicle_2)
        self.image_1 = VehicleImage.objects.create(vehicle=self.vehicle_1,
                                                   image="media/vehicle/hyundai-hd-120-manipulyator.png")
        self.city_1 = City.objects.create(name='Kiev')
        self.city_2 = City.objects.create(name='Odessa')
        self.store_1 = Store.objects.create(vehicle=self.vehicle_1, quantity=3, city=self.city_1)
        self.store_2 = Store.objects.create(vehicle=self.vehicle_1, quantity=5, city=self.city_2)
        self.store_3 = Store.objects.create(vehicle=self.vehicle_2, quantity=4, city=self.city_1)

    def test_vehicle(self):
        vehicles = Vehicle.objects.all().annotate(
            vehicle_type_name=F('vehicle_type__name')
        ).prefetch_related('images').prefetch_related('features').prefetch_related('store').distinct()
        with CaptureQueriesContext(connection) as queries:
            serializer_data = VehicleSerializer(vehicles, many=True).data
            self.assertEqual(4, len(queries))
        data = [
            {
                "id": 1,
                "name": "Hyundai 100",
                "vehicle_type": 1,
                "vehicle_type_name": "Manipulator",
                "price_cap": "500",
                "price_region": "1000",
                "discount": "0", "sale": False,
                "images": [{
                    "id": 1,
                    "vehicle": 1,
                    "image": "/media/media/vehicle/hyundai-hd-120-manipulyator.png"
                }],
                "features": [{
                    "id": 1,
                    "value": "5",
                    "feature": 1,
                    "unit": 1
                }],
                "store": [{
                    "id": 1,
                    "city": 1,
                    "vehicle": 1,
                    "quantity": 3},
                    {"id": 2,
                     "city": 2,
                     "vehicle": 1,
                     "quantity": 5}],
            },
            {
                "id": 2,
                "name": "65115",
                "vehicle_type": 2,
                "vehicle_type_name": "Excavator",
                "price_cap": "1500",
                "price_region": "2000",
                "discount": "0", "sale": False,
                "images": [],
                "features": [{
                    "id": 2,
                    "value": "10",
                    "feature": 2,
                    "unit": 1
                }],
                "store": [{"id": 3, "city": 1, "vehicle": 2, "quantity": 4}]
            }
        ]

        print(json.dumps(serializer_data), sep='\n\n')
        self.assertEqual(serializer_data, data, serializer_data)

    def test_feature(self):
        vehicles = FeatureList.objects.all()
        data = [
            {"id": 1, "name": "Weight"},
            {"id": 2, "name": "Weight 2"}
        ]
        serializer_data = FeatureListSerializer(vehicles, many=True).data
        self.assertEqual(serializer_data, data, serializer_data)

    def test_messure(self):
        queryset = MessurementUnit.objects.all()
        data = [
            {"id": 1, "name": "tons"}
        ]
        serializer_data = MessurementUnitSerializer(queryset, many=True).data
        self.assertEqual(serializer_data, data, serializer_data)

    def test_vehiclefeatures(self):
        queryset = VehicleFeature.objects.all()
        data = [
            {
                'id': self.vehicle_feature_1.id,
                'feature': self.feature_1.id,
                'unit': self.unit.id,
                'value': '5'
            },
            {
                'id': self.vehicle_feature_2.id,
                'feature': self.feature_2.id,
                'unit': self.unit.id,
                'value': '10'
            },
        ]
        serializer_data = VehicleFeaturesViewSerializer(queryset, many=True).data

    def test_types(self):
        queryset = Type.objects.all()
        data = [
            {"id": 1, "name": "Manipulator"},
            {"id": 2, "name": "Excavator"}
        ]
        serializer_data = FeatureListSerializer(queryset, many=True).data
        self.assertEqual(serializer_data, data, serializer_data)
