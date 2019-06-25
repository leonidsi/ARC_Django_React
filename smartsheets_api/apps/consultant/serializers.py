from rest_framework import serializers
from apps.consultant.models import Consultant
from apps.authentication.serializers import UserSerializer

class ConsultantSerializer(serializers.ModelSerializer):
    user_id = UserSerializer()
    class Meta:
        model = Consultant
        fields = ('id', 'user_id')