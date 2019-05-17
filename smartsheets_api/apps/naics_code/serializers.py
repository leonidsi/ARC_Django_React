from rest_framework import serializers
from .models import NaicsCode

class NaicsCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = NaicsCode
        fields = ('id', 'name', 'code')
        