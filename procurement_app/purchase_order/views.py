from django.shortcuts import render

from rest_framework.response import Response
from rest_framework import status

import logging
# Create your views here.
# purchase_order/views.py
from rest_framework import viewsets
from .models import PurchaseOrder, OrderItem
from .serializers import PurchaseOrderSerializer, OrderItemSerializer

class PurchaseOrderViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrder.objects.all()
    serializer_class = PurchaseOrderSerializer
    lookup_field = 'order_no' 

    def create(self, request, *args, **kwargs):
        import logging
        logger = logging.getLogger(__name__)
        logger.debug("Received data: %s", request.data)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True) 
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    logger = logging.getLogger(__name__)
 
    def destroy(self, request, *args, **kwargs):
        order_no = kwargs.get('order_no')  # Get the order_no from URL
        logger.debug(f"Attempting to delete order with order_no: {order_no}")
    
    # Check if the order exists
        try:
            order = PurchaseOrder.objects.get(order_no=order_no)
            logger.debug(f"Found order: {order}")
        except PurchaseOrder.DoesNotExist:
            logger.error(f"Order with order_no {order_no} does not exist.")
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

    # Proceed with deletion
        return super().destroy(request, *args, **kwargs)





class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer



