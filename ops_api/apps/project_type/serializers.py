from rest_framework import serializers
from apps.project_type.models import ProjectType

class ProjectTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectType
        fields = ('id', 'name')
        