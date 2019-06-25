from rest_framework import serializers
from apps.account_manager.models import AccountManager
from apps.authentication.serializers import UserSerializer
class AccountManagerSerializer(serializers.ModelSerializer):
    user_id = UserSerializer()
    class Meta:
        model = AccountManager
        fields = ('id', 'user_id')