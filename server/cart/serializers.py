from rest_framework import serializers


class CartDetailSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255, allow_null=True)
    quantity = serializers.IntegerField(allow_null=True)
    price = serializers.DecimalField(max_digits=7, decimal_places=2, allow_null=True)

class CartSerializer(serializers.Serializer):
    id = serializers.CharField(allow_null=True)
    lines = CartDetailSerializer(allow_null=True)

