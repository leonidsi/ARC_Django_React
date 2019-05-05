from rest_framework import serializers
from consultant.models import Consultant

class ConsultantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultant
        fields = ('id', 'user_id', 'created_at', 'updated_at')