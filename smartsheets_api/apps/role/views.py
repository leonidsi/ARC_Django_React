import jwt
import requests

from .models import Role
from .serializers import RoleSerializer

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

class RoleList(ListCreateAPIView):
    """
    View to list all users and create a user in the system.

    GET roles/
    POST roles/
    """
    permission_classes = (IsAuthenticated and IsTokenValid,)
    def get(self, request, format=None):
        """
        Return a list of all roles.
        """
        roles = Role.objects.all()
        serializer = RoleSerializer(roles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = RoleSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class RoleDetailView(RetrieveUpdateDestroyAPIView):

    """
    GET roles/:id/
    PUT roles/:id/
    DELETE roles/:id/
    """

    """
    * Allow only authenticated roles to access this url
    """
    permission_classes = ( IsAuthenticated and IsTokenValid,)
    queryset = Role.objects.all()

    def get(self, request, *args, **kwargs):
        try:
            role = self.queryset.get(pk=kwargs["pk"])
            return Response(RoleSerializer(role).data)
        except Role.DoesNotExist:
            response = {"message": "Role with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, *args, **kwargs):
        try:
            role = self.queryset.get(pk=kwargs["pk"])
            serializer = RoleSerializer()
            updated_role = serializer.update(role, request.data)
            return Response(RoleSerializer(updated_role).data)
        except Role.DoesNotExist:
            response = {"message": "Role with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, *args, **kwargs):
        try:
            role = self.queryset.get(pk=kwargs["pk"])
            role.delete()
            response = {"message": "Deleted Role Successfully!"}
            return Response(response, status=status.HTTP_204_NO_CONTENT)
        except Role.DoesNotExist:
            response = {"message": "Role with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)
