from rest_framework import serializers
from apps.project_manager.models import ProjectManager
from apps.authentication.serializers import UserSerializer

class ProjectManagerSerializer(serializers.ModelSerializer):
    user_id = UserSerializer()
    class Meta:
        model = ProjectManager
        fields = ('id', 'user_id')