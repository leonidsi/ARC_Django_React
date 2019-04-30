import jwt
import requests

from .models import OtherProvider
from .serializers import OtherProviderSerializer

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

class OtherProviderList(ListCreateAPIView):
    """
    View to list all users and create a user in the system.

    GET other_providers/
    POST other_providers/
    """
    #permission_classes = (IsAuthenticated and IsTokenValid,)
    def get(self, request, format=None):
        """
        Return a list of all other providers.
        """
        other_providers = OtherProvider.objects.all()
        serializer = OtherProviderSerializer(other_providers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = OtherProviderSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class OtherProviderDetailView(RetrieveUpdateDestroyAPIView):

    """
    GET other_providers/:id/
    PUT other_providers/:id/
    DELETE other_providers/:id/
    """

    """
    * Allow only authenticated other_providers to access this url
    """
    #permission_classes = ( IsAuthenticated and IsTokenValid,)
    queryset = OtherProvider.objects.all()

    def get(self, request, *args, **kwargs):
        try:
            other_provider = self.queryset.get(pk=kwargs["pk"])
            return Response(OtherProviderSerializer(other_provider).data)
        except OtherProvider.DoesNotExist:
            response = {"message": "Other Provider with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, *args, **kwargs):
        try:
            other_provider = self.queryset.get(pk=kwargs["pk"])
            serializer = OtherProviderSerializer()
            updated_other_provider = serializer.update(other_provider, request.data)
            return Response(OtherProviderSerializer(updated_other_provider).data)
        except OtherProvider.DoesNotExist:
            response = {"message": "Other Provider with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, *args, **kwargs):
        try:
            other_provider = self.queryset.get(pk=kwargs["pk"])
            other_provider.delete()
            response = {"message": "Deleted Other Provider Successfully!"}
            return Response(response, status=status.HTTP_204_NO_CONTENT)
        except OtherProvider.DoesNotExist:
            response = {"message": "Other Provider with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)
