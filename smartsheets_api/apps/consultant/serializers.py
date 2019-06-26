from rest_framework import serializers
from apps.consultant.models import Consultant
from apps.authentication.serializers import UserSerializer

class ConsultantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultant
        fields = ('id', 'user_id')