from django.conf.urls import url, include
from rest_framework import routers
from .views import ToolkitTierList, ToolkitTierDetailView

urlpatterns = [
    url(r'^toolkitTiers/(?P<pk>\d+)/', ToolkitTierDetailView.as_view(), name='toolkit_iters_detail'),
    url(r'^toolkitTiers/', ToolkitTierList.as_view(), name='toolkit_tiers_list'),
]