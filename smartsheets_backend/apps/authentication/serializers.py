from rest_framework import serializers
from apps.authentication.models import User
from apps.role.serializers import RoleSerializer

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=False,
        style={'input_type': 'password'}
    )
    class Meta: 
        model = User
        fields = ('id', 'email', 'password', 'smartsheetCode', 'username', 'firstname', 'lastname', 'roleId')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == 'password':
                instance.set_password(value)
            else:
                setattr(instance, attr, value)
        instance.save()
        return instance