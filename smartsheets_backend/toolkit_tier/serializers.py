from rest_framework import serializers
from toolkit_tier.models import ToolkitTier

class ToolkitTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = ToolkitTier
        fields = ('id', 'name')
        