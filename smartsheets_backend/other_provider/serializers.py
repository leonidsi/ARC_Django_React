from rest_framework import serializers
from other_provider.models import OtherProvider

class OtherProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = OtherProvider
        fields = ('id', 'name', 'created_at', 'updated_at')
        