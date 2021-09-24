from django.conf.urls import url, include
from rest_framework import routers

from .views import ClientList, ClientDetailView

urlpatterns = [
    url(r'^clients/(?P<pk>\d+)/', ClientDetailView.as_view(), name='clients_detail'),
    url(r'^clients/', ClientList.as_view(), name='clients'),
]