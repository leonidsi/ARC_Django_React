from rest_framework import serializers
from .models import ProjectStatus

class ProjectStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectStatus
        fields = ('id', 'name')
        