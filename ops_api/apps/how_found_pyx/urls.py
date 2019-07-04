from django.conf.urls import url, include
from rest_framework import routers
from .views import HowFoundPyxList, HowFoundPyxDetailView

urlpatterns = [
    url(r'^how_found_pyxs/(?P<pk>\d+)/', HowFoundPyxDetailView.as_view(), name='how_found_pyx_detail'),
    url(r'^how_found_pyx/', HowFoundPyxList.as_view(), name='how_found_pyx_list'),
]