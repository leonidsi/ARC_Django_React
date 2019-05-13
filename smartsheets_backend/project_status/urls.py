from django.conf.urls import url, include
from rest_framework import routers
from .views import ProjectStatusList, ProjectStatusDetailView

urlpatterns = [
    url(r'^project_status/(?P<pk>\d+)/', ProjectStatusDetailView.as_view(), name='project_status_detail'),
    url(r'^project_status/', ProjectStatusList.as_view(), name='project_status_list'),
]