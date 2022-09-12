from django.urls import path
from rest_framework.routers import SimpleRouter

from orders.views import OrderViewSet, OrderCreateViewSet, OrderItemCreateViewSet, OrderItemViewSet, OrderRemoveViewSet, \
    OrderItemRemoveViewSet

router = SimpleRouter()


urlpatterns = [
    path('create/', OrderCreateViewSet.as_view({'post': 'create'}), name='order_create'),
    path('remove/<pk>/', OrderRemoveViewSet.as_view({'delete': 'destroy'}), name='order_remove'),
    path('<id>/', OrderViewSet.as_view({'get': 'list'}), name='order_detail'),
    path('', OrderViewSet.as_view({'get': 'list'}), name='order_list'),
    path('item/create/', OrderItemCreateViewSet.as_view({'post': 'create'}), name='orderitem_create'),
    path('item/remove/<pk>/', OrderItemRemoveViewSet.as_view({'delete': 'destroy'}), name='orderitem_remove'),
    path('item/<id>/', OrderItemViewSet.as_view({'get': 'list'}), name='orderitem_detail'),
    path('item/', OrderItemViewSet.as_view({'get': 'list'}), name='orderitem_list'),
]
