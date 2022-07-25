from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import SimpleRouter

from store.views import CityViewSet, StoreCreateUpdateGetSet
from vehicles.views import VehicleViewSet, TypeViewSet, VehicleFeatureViewSet, FeatureListViewSet, \
    MessurementUnitViewSet

router = SimpleRouter()

router.register(r'api/vehicle', VehicleViewSet)
router.register(r'api/type', TypeViewSet)
router.register(r'api/feature', FeatureListViewSet)
router.register(r'api/unit', MessurementUnitViewSet)
router.register(r'api/vehicle_feature', VehicleFeatureViewSet)
router.register(r'api/city', CityViewSet)
router.register(r'api/store', StoreCreateUpdateGetSet)



urlpatterns = [
    path('admin/', admin.site.urls),
    path('__debug__/', include('debug_toolbar.urls')),
    # path('', Vehicle_view.as_view()),
]

urlpatterns += router.urls