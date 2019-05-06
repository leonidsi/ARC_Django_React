from rest_framework import serializers
from project.models import Project

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('id', 'user_id', 'created_at', 'updated_at')