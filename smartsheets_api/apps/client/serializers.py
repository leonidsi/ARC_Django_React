from rest_framework import serializers
from apps.client.models import Client

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = (
                    'id', 'name', 'snp_500',
                    'fortune_level', 'enterprise',
                    'greatplace_mostadmired',
                    'date_joined_pyx',
                    'date_left_pyx',
                    'naics_code1_id',
                    'naics_code2_id'
                )