from django.conf.urls import url, include
from rest_framework import routers
from .views import ContractList, ContractDetailView

urlpatterns = [
    url(r'^contracts/(?P<pk>\d+)', ContractDetailView.as_view(), name='contracts_detail'),
    url(r'^contracts/', ContractList.as_view(), name='contracts'),
]