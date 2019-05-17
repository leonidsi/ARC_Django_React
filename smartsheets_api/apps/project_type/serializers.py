from rest_framework import serializers
from .models import ProjectType

class ProjectTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectType
        fields = ('id', 'name')
        