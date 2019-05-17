from rest_framework import serializers
from .models import Consultant

class ConsultantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultant
        fields = ('id', 'user_id')