from django.conf.urls import url, include
from rest_framework import routers
from .views import RelationshipManagerList, RelationshipManagerDetailView

urlpatterns = [
    url(r'^relationship_managers/(?P<pk>\d+)/', RelationshipManagerDetailView.as_view()),
    url(r'^relationship_managers/', RelationshipManagerList.as_view()),
]