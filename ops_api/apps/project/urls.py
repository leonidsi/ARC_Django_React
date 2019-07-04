from django.conf.urls import url, include
from rest_framework import routers
from .views import ProjectList, ProjectDetailView, TemplateView, ProjectHistoryView

urlpatterns = [
    url(r'^projects/(?P<pk>\d+)/', ProjectDetailView.as_view()),
    url(r'^projects/', ProjectList.as_view()),
    url(r'^templates/', TemplateView.as_view()),
    url(r'^projects_histories/', ProjectHistoryView.as_view())
]