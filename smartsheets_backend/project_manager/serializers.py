from rest_framework import serializers
from project_manager.models import ProjectManager

class ProjectManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectManager
        fields = ('id', 'user_id')