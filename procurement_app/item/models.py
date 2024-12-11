from django.db import models
from supplier.models import Supplier

class Item(models.Model):
    item_no = models.AutoField(primary_key=True)
    item_name = models.CharField(max_length=255)
    inventory_location = models.CharField(max_length=255)
    brand = models.CharField(max_length=50)
    category = models.CharField(max_length=50)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE,null=True,blank=True)
    stock_unit = models.CharField(max_length=50)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    item_images = models.ImageField(upload_to='item_images/', blank=True)
    STATUS_CHOICES = [
        ('Enabled', 'Enabled'),
        ('Disabled', 'Disabled'),
    ]
    status = models.CharField(max_length=8, choices=STATUS_CHOICES, default='Enabled')

    def __str__(self):
     if self.supplier:
        return f"{self.item_name} ({self.supplier.supplier_name})"
     return self.item_name


