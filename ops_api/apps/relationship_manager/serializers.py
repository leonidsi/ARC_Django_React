from rest_framework import serializers
from apps.relationship_manager.models import RelationshipManager
from apps.authentication.serializers import UserSerializer

class RelationshipManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = RelationshipManager
        fields = ('id', 'user_id')