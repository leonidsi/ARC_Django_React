from django.conf.urls import url, include
from rest_framework import routers
from .views import ServerList, ServerDetailView

urlpatterns = [
    url(r'^servers/(?P<pk>\d+)/', ServerDetailView.as_view()),
    url(r'^servers/', ServerList.as_view()),
]