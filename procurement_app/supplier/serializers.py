# serializers.py
from rest_framework import serializers
from .models import Supplier
from rest_framework.permissions import AllowAny

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'
  
