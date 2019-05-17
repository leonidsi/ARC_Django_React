from rest_framework import serializers
from .models import ToolkitTier

class ToolkitTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = ToolkitTier
        fields = ('id', 'name')
        