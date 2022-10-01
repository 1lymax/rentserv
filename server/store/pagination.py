from django.db.models import Min, Max
from rest_framework.pagination import PageNumberPagination


class SetPagination(PageNumberPagination):
    page_size = 1000
    page_size_query_param = 'page_size'
    max_page_size = 1000


class PaginationVehicleWithAggregates(SetPagination):
    aggregate = {}

    def paginate_queryset(self, queryset, request, view=None):
        self.aggregate = queryset.aggregate(
            min_quantity=Min('quantity'),
            max_quantity=Max('quantity'),
        )
        return super(PaginationVehicleWithAggregates, self).paginate_queryset(queryset, request, view)

    def get_paginated_response(self, data):
        paginated_response = super(PaginationVehicleWithAggregates, self).get_paginated_response(data)
        paginated_response.data['aggregate'] = self.aggregate
        return paginated_response
