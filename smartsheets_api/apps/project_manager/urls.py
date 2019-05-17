from django.conf.urls import url, include
from rest_framework import routers
from .views import ProjectManagerList, ProjectManagerDetailView

urlpatterns = [
    url(r'^project_managers/(?P<pk>\d+)/', ProjectManagerDetailView.as_view(), name='project_managers_detail'),
    url(r'^project_managers/', ProjectManagerList.as_view(), name='project_managers_list'),
]