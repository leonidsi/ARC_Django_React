import jwt
import requests

from django.conf import settings
from django.utils.encoding import smart_text
from django.core import serializers

from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser, BasePermission
from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework_jwt.utils import jwt_payload_handler
from rest_framework.authentication import BasicAuthentication, get_authorization_header
from rest_framework.exceptions import AuthenticationFailed

from apps.authentication.views import IsTokenValid
from apps.authentication.models import User
from apps.authentication.serializers import UserSerializer

from .models import AccountManager
from .serializers import AccountManagerSerializer

class AccountManagerList(ListCreateAPIView):
    """
    View to list all account_managers and create a account_manager in the system.

    GET account_managers/
    POST account_managers/
    """
    permission_classes = (IsAuthenticated and IsTokenValid,)
    def get(self, request, format=None):
        """
        Return a list of all AccountManagers.
        """
        account_managers = AccountManager.objects.all()
        responses = []
        for account_manager in account_managers:
            response = AccountManagerSerializer(account_manager).data
            response['user'] = UserSerializer(User.objects.get(email = User.objects.get(email=account_manager.user_id))).data
            responses.append(response)
        return Response(responses, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = AccountManagerSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class AccountManagerDetailView(RetrieveUpdateDestroyAPIView):

    """
    GET account_managers/:id/
    PUT account_managers/:id/
    DELETE account_managers/:id/
    """

    """
    * Allow only authenticated account_managers to access this url
    """
    permission_classes = ( IsAuthenticated and IsTokenValid,)
    queryset = AccountManager.objects.all()

    def get(self, request, *args, **kwargs):
        try:
            account_manager = self.queryset.get(pk=kwargs["pk"])
            return Response(AccountManagerSerializer(account_manager).data)
        except AccountManager.DoesNotExist:
            response = {"message": "Account Manager with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, *args, **kwargs):
        try:
            account_manager = self.queryset.get(pk=kwargs["pk"])
            serializer = AccountManagerSerializer()
            updated_account_manager = serializer.update(account_manager, request.data)
            return Response(AccountManagerSerializer(updated_account_manager).data)
        except AccountManager.DoesNotExist:
            response = {"message": "Account Manager with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, *args, **kwargs):
        try:
            account_manager = self.queryset.get(pk=kwargs["pk"])
            account_manager.delete()
            response = {"message": "Deleted Account Manager Successfully!"}
            return Response(response, status=status.HTTP_204_NO_CONTENT)
        except AccountManager.DoesNotExist:
            response = {"message": "Account Manager with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)
