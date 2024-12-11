from rest_framework import viewsets
from .models import Item
from .serializers import ItemSerializer
from rest_framework import status
from rest_framework.response import Response
from .models import Supplier

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.select_related('supplier')
    serializer_class = ItemSerializer

    def create(self, request, *args, **kwargs):
        supplier_no = request.data.get('supplier')

        if supplier_no:  # Check if supplier_no is provided
            try:
                # Get the supplier instance by supplier_no
                supplier = Supplier.objects.get(supplier_no=supplier_no)
            except Supplier.DoesNotExist:
                return Response({"error": "Supplier does not exist."}, status=status.HTTP_400_BAD_REQUEST)

            # Assign the actual supplier instance to the supplier field (not supplier_no)
            request.data['supplier'] = supplier.pk  # Use the supplier's primary key (ID)
        else:
            # If no supplier is provided, set supplier to None (optional)
            request.data['supplier'] = None

        # Proceed with the creation of the item
        return super().create(request, *args, **kwargs)
