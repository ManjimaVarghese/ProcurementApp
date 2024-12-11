from django.db import models

class Supplier(models.Model):
    supplier_no = models.AutoField(primary_key=True)
    supplier_name = models.CharField(max_length=255)
    address = models.TextField()
    tax_no = models.CharField(max_length=50)
    country = models.CharField(max_length=50)
    mobile_no = models.CharField(max_length=15)
    email = models.EmailField()
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
        ('Blocked', 'Blocked'),
    ]
    status = models.CharField(max_length=8, choices=STATUS_CHOICES, default='Active')

    def __str__(self):
        return self.supplier_name
