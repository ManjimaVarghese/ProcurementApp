from django.db import models
from supplier.models import Supplier
from item.models import Item  # Assuming the Item model is in the item app

class PurchaseOrder(models.Model):
    order_no= models.AutoField(primary_key=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    order_date = models.DateField()
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00,null=False)
    net_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00,null=False)

class OrderItem(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='order_items')
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    packing_unit = models.CharField(max_length=100, blank=True, null=True)
    order_qty = models.PositiveIntegerField(null=False)
    item_amount = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2)
    net_amount = models.DecimalField(max_digits=10, decimal_places=2)

