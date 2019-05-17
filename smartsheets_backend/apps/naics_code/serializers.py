from rest_framework import serializers
from apps.naics_code.models import NaicsCode

class NaicsCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = NaicsCode
        fields = ('id', 'name', 'code')
        