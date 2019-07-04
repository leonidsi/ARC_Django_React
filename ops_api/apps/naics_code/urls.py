from django.conf.urls import url, include
from rest_framework import routers
from .views import NaicsCodeList, NaicsCodeDetailView

urlpatterns = [
    url(r'^naics_codes/(?P<pk>\d+)/', NaicsCodeDetailView.as_view(), name='naics_codes_detail'),
    url(r'^naics_codes/', NaicsCodeList.as_view(), name='naics_codes_list'),
]