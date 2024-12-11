# serializers.py
from rest_framework import serializers
from .models import PurchaseOrder, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['item', 'packing_unit', 'order_qty', 'item_amount', 'discount', 'net_amount']

from rest_framework.exceptions import ValidationError

class PurchaseOrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True)

    class Meta:
        model = PurchaseOrder
        fields = ['supplier', 'order_date', 'discount', 'net_amount', 'order_items']

    def create(self, validated_data):
        order_items_data = validated_data.pop('order_items')
        try:
            purchase_order = PurchaseOrder.objects.create(**validated_data)
        except Exception as e:
            raise ValidationError(f"Error creating purchase order: {e}")

        for item_data in order_items_data:
            try:
                OrderItem.objects.create(purchase_order=purchase_order, **item_data)
            except Exception as e:
                raise ValidationError(f"Error creating order item: {e}")
        return purchase_order






