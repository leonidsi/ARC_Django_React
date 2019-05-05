from django.conf.urls import url, include
from rest_framework import routers
from .views import HowFoundPyxList, HowFoundPyxDetailView

urlpatterns = [
<<<<<<< HEAD
    
=======
    url(r'^how_found_pyx/(?P<pk>\d+)/', HowFoundPyxDetailView.as_view()),
    url(r'^how_found_pyx/', HowFoundPyxList.as_view()),
>>>>>>> ee54b5d90031b00806fb29c2095736def343333d
]