from rest_framework import serializers
from .models import Item

from rest_framework import serializers
from .models import Item

from rest_framework import serializers
from .models import Item, Supplier

from rest_framework import serializers
from .models import Item, Supplier

class ItemSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source='supplier.supplier_name', read_only=True)

    class Meta:
        model = Item
        fields = [
            'item_no', 'item_name', 'inventory_location', 'brand',
            'category','supplier','supplier_name', 'stock_unit',
            'unit_price', 'item_images', 'status'
        ]




