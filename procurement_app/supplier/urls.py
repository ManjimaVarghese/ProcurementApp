# supplier/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SupplierViewSet

router = DefaultRouter()
router.register(r'suppliers', SupplierViewSet)  # Register the SupplierViewSet with the router

urlpatterns = [
    path('', include(router.urls)),  # This should include the router URLs directly
]
