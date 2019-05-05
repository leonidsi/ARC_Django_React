from rest_framework import serializers
from relationship_manager.models import RelationshipManager

class RelationshipManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = RelationshipManager
        fields = ('id', 'user_id', 'created_at', 'updated_at')