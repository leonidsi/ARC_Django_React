from rest_framework import serializers
from .models import AccountManager

class AccountManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountManager
        fields = ('id', 'user_id')