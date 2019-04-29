from django.conf.urls import url, include
from rest_framework import routers
from .views import ListCreateUsersView, UserDetailView, LogoutView, SSOLoginView

from rest_framework_jwt.views import obtain_jwt_token
from rest_framework_jwt.views import refresh_jwt_token
from rest_framework_jwt.views import verify_jwt_token

urlpatterns = [
    url(r'^users/sso/$', SSOLoginView.as_view()),
    url(r'^users/logout/', LogoutView.as_view()),
    url(r'^users/(?P<pk>\d+)/', UserDetailView.as_view()),
    url(r'^users/', ListCreateUsersView.as_view()),
]