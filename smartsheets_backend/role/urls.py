from django.conf.urls import url, include
from rest_framework import routers
from .views import RoleList, RoleDetailView

urlpatterns = [
    url(r'^userRoles/(?P<pk>\d+)/', RoleDetailView.as_view()),
    url(r'^userRoles/', RoleList.as_view()),
]