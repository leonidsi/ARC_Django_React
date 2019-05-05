from django.conf.urls import url, include
from rest_framework import routers
from .views import ConsultantList, ConsultantDetailView

urlpatterns = [
    url(r'^consultants/(?P<pk>\d+)/', ConsultantDetailView.as_view()),
    url(r'^consultants/', ConsultantList.as_view()),
]