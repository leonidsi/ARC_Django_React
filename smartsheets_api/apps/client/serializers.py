from rest_framework import serializers
from apps.client.models import Client

class ClientSerializer(serializers.ModelSerializer):
    # date_joined_pyx = serializers.DateField(format="%m/%d/%Y", input_formats=['%m/%d/%Y', 'iso-8601'])
    # date_left_pyx = serializers.DateField(format="%m/%d/%Y", input_formats=['%m/%d/%Y', 'iso-8601'])
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

    def update(self, instance, validated_data):
        """
        Update and return an existing `Client` instance, given the validated data.
        """
        instance.name = validated_data.get('name', instance.name)
        instance.snp_500 = validated_data.get('snp_500', instance.snp_500)
        instance.fortune_level = validated_data.get('fortune_level', instance.fortune_level)
        instance.enterprise = validated_data.get('enterprise', instance.enterprise)
        instance.greatplace_mostadmired = validated_data.get('greatplace_mostadmired', instance.greatplace_mostadmired)
        instance.date_joined_pyx = validated_data.get('date_joined_pyx', instance.date_joined_pyx)
        instance.date_left_pyx = validated_data.get('date_left_pyx', instance.date_left_pyx)
        instance.naics_code1_id_id = validated_data.get('naics_code1_id', instance.naics_code1_id)
        instance.naics_code2_id_id = validated_data.get('naics_code2_id', instance.naics_code2_id)
        instance.save()
        return instance
