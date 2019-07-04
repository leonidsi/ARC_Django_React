from django.conf.urls import url, include
from rest_framework import routers
from .views import ListCreateUsersView, UserDetailView, LogoutView, SSOLoginView, UserHistoryView

from rest_framework_jwt.views import obtain_jwt_token
from rest_framework_jwt.views import refresh_jwt_token
from rest_framework_jwt.views import verify_jwt_token

urlpatterns = [
    url(r'^users/sso/$', SSOLoginView.as_view(), name='SSOLogin'),
    url(r'^users/logout/', LogoutView.as_view(), name='logout'),
    url(r'^users/(?P<pk>\d+)/', UserDetailView.as_view()),
    url(r'^users/', ListCreateUsersView.as_view(), name='userlist'),
    url(r'^users_histories/', UserHistoryView.as_view())
]