from django.conf.urls import url, include
from rest_framework import routers
from .views import HowFoundPyxList, HowFoundPyxDetailView

urlpatterns = [
    url(r'^how_found_pyxes/(?P<pk>\d+)/', HowFoundPyxDetailView.as_view()),
    url(r'^how_found_pyxes/', HowFoundPyxList.as_view()),
]