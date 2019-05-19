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

from .models import Server
from .serializers import ServerSerializer

class ServerList(ListCreateAPIView):
    """
    View to list all users and create a user in the system.

    GET servers/
    POST servers/
    """
    permission_classes = (IsAuthenticated and IsTokenValid,)
    def get(self, request, format=None):
        """
        Return a list of all servers.
        """
        servers = Server.objects.all()
        serializer = ServerSerializer(servers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = ServerSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ServerDetailView(RetrieveUpdateDestroyAPIView):

    """
    GET servers/:id/
    PUT servers/:id/
    DELETE servers/:id/
    """

    """
    * Allow only authenticated servers to access this url
    """
    permission_classes = ( IsAuthenticated and IsTokenValid,)
    queryset = Server.objects.all()

    def get(self, request, *args, **kwargs):
        try:
            server = self.queryset.get(pk=kwargs["pk"])
            return Response(ServerSerializer(server).data)
        except Server.DoesNotExist:
            response = {"message": "Server with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, *args, **kwargs):
        try:
            server = self.queryset.get(pk=kwargs["pk"])
            serializer = ServerSerializer()
            updated_server = serializer.update(server, request.data)
            return Response(ServerSerializer(updated_server).data)
        except Server.DoesNotExist:
            response = {"message": "Server with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, *args, **kwargs):
        try:
            server = self.queryset.get(pk=kwargs["pk"])
            server.delete()
            response = {"message": "Deleted Server Successfully!"}
            return Response(response, status=status.HTTP_204_NO_CONTENT)
        except Server.DoesNotExist:
            response = {"message": "Server with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)
