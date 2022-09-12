from django.urls import path
from . import views
from .views import CartViewSet

urlpatterns = [
    path('', CartViewSet.as_view(), name='cart_detail'),
    path('add/<id>/', CartViewSet.as_view(), name='cart_add'),
    path('remove/<id>/', CartViewSet.as_view(), name='cart_remove'),
]
