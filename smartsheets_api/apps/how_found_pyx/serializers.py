from rest_framework import serializers
from .models import HowFoundPyx

class HowFoundPyxSerializer(serializers.ModelSerializer):
    class Meta:
        model = HowFoundPyx
        fields = ('id', 'name')
        