from rest_framework import serializers
from how_found_pyx.models import HowFoundPyx

class HowFoundPyxSerializer(serializers.ModelSerializer):
    class Meta:
        model = HowFoundPyx
        fields = ('id', 'name', 'created_at', 'updated_at')
        