from rest_framework import serializers
from apps.other_provider.models import OtherProvider

class OtherProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = OtherProvider
        fields = ('id', 'name')
        