from django.conf.urls import url, include
from rest_framework import routers
from .views import OtherProviderList, OtherProviderDetailView, OtherProviderHistoryView

urlpatterns = [
    url(r'^other_providers/(?P<pk>\d+)/', OtherProviderDetailView.as_view(), name='other_providers_detail'),
    url(r'^other_providers/', OtherProviderList.as_view(), name='other_providers_list'),
    url(r'^other_providers_histories/', OtherProviderHistoryView.as_view())
]