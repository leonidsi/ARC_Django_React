from rest_framework import serializers
from .models import Contract

class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = (
            'id', 'name', 'contract_number', 'date_current_contract_signed',
            'current_contract_term', 'total_contract_value', 'contract_type',
            'extension_contract', 'annual_subscription', 'status', 'client_id',
            'sales_rep_id', 'relationship_manager_id'
        )

    def update(self, instance, validated_data):
        """
        Update and return an existing `Contract` instance, given the validated data.
        """
        instance.name = validated_data.get('name', instance.name)
        instance.contract_number = validated_data.get('contract_number', instance.contract_number)
        instance.date_current_contract_signed = validated_data.get('date_current_contract_signed', instance.date_current_contract_signed)
        instance.current_contract_term = validated_data.get('current_contract_term', instance.current_contract_term)
        instance.total_contract_value = validated_data.get('total_contract_value', instance.total_contract_value)
        instance.contract_type = validated_data.get('contract_type', instance.contract_type)
        instance.extension_contract = validated_data.get('extension_contract', instance.extension_contract)
        instance.annual_subscription = validated_data.get('annual_subscription', instance.annual_subscription)
        instance.status = validated_data.get('status', instance.status)
        
        instance.client_id_id = validated_data.get('client_id', instance.client_id_id)
        instance.sales_rep_id_id = validated_data.get('sales_rep_id', instance.sales_rep_id_id)
        instance.relationship_manager_id_id = validated_data.get('relationship_manager_id', instance.relationship_manager_id_id)

        instance.save()
        return instance