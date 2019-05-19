from rest_framework import serializers
from .models import OtherProvider

class OtherProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = OtherProvider
        fields = ('id', 'name')
        