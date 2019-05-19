from rest_framework import serializers
from apps.account_manager.models import AccountManager

class AccountManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountManager
        fields = ('id', 'user_id')