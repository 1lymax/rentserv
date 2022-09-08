from django.db.models import Min, Max
from rest_framework.pagination import PageNumberPagination


class SetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 1000


class PaginationWithAggregates(PageNumberPagination):
    aggregate = {}
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 1000

    def paginate_queryset(self, queryset, request, view=None):
        self.aggregate = queryset.aggregate(
            min_price_cap=Min('price_cap'),
            max_price_cap=Max('price_cap'),
            min_price_region=Min('price_region'),
            max_price_region=Max('price_region')
        )
        return super(PaginationWithAggregates, self).paginate_queryset(queryset, request, view)

    def get_paginated_response(self, data):
        paginated_response = super(PaginationWithAggregates, self).get_paginated_response(data)
        paginated_response.data['aggregate'] = self.aggregate
        return paginated_response
