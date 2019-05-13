from django.conf.urls import url, include
from rest_framework import routers
from .views import ProjectTypeList, ProjectTypeDetailView

urlpatterns = [
    url(r'^project_types/(?P<pk>\d+)/', ProjectTypeDetailView.as_view(), name='project_types_detail'),
    url(r'^project_types/', ProjectTypeList.as_view(), name='project_types_list'),
]