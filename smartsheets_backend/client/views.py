import jwt
import requests

from .models import Client
from .serializers import ClientSerializer

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
from authentication.views import IsTokenValid

class ClientList(ListCreateAPIView):
    """
    View to list all clients and create a client in the system.

    GET clients/
    POST clients/
    """
    permission_classes = (IsAuthenticated and IsTokenValid,)
    def get(self, request, format=None):
        """
        Return a list of all Clients.
        """
        clients = Client.objects.all()
        serializer = ClientSerializer(clients, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = ClientSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ClientDetailView(RetrieveUpdateDestroyAPIView):

    """
    GET clients/:id/
    PUT clients/:id/
    DELETE clients/:id/
    """

    """
    * Allow only authenticated clients to access this url
    """
    permission_classes = ( IsAuthenticated and IsTokenValid,)
    queryset = Client.objects.all()

    def get(self, request, *args, **kwargs):
        try:
            client = self.queryset.get(pk=kwargs["pk"])
            return Response(ClientSerializer(client).data)
        except Client.DoesNotExist:
            response = {"message": "Client with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, *args, **kwargs):
        try:
            client = self.queryset.get(pk=kwargs["pk"])
            serializer = ClientSerializer()
            updated_client = serializer.update(client, request.data)
            return Response(ClientSerializer(updated_client).data)
        except Client.DoesNotExist:
            response = {"message": "Client with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, *args, **kwargs):
        try:
            client = self.queryset.get(pk=kwargs["pk"])
            client.delete()
            response = {"message": "Deleted Client Successfully!"}
            return Response(response, status=status.HTTP_204_NO_CONTENT)
        except Client.DoesNotExist:
            response = {"message": "Client with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)
