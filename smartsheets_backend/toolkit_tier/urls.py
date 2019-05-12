from django.conf.urls import url, include
from rest_framework import routers
from .views import ToolkitTierList, ToolkitTierDetailView

urlpatterns = [
    url(r'^toolkitTiers/(?P<pk>\d+)/', ToolkitTierDetailView.as_view()),
    url(r'^toolkitTiers/', ToolkitTierList.as_view()),
]