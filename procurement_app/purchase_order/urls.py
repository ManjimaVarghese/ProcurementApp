from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PurchaseOrderViewSet, OrderItemViewSet


router = DefaultRouter()
router.register(r'purchase-orders', PurchaseOrderViewSet, basename='purchase-order')
router.register(r'order-items', OrderItemViewSet)

urlpatterns = [
    path('', include(router.urls)), 
]


