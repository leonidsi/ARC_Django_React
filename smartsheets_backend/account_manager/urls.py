from django.conf.urls import url, include
from rest_framework import routers
from .views import AccountManagerList, AccountManagerDetailView

urlpatterns = [
    url(r'^account_managers/(?P<pk>\d+)/', AccountManagerDetailView.as_view()),
    url(r'^account_managers/', AccountManagerList.as_view()),
]