import jwt
import requests

from .models import ToolkitTier
from .serializers import ToolkitTierSerializer

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

class ToolkitTierList(ListCreateAPIView):
    """
    View to list all users and create a user in the system.

    GET toolkit_tiers/
    POST toolkit_tiers/
    """
    permission_classes = (IsAuthenticated and IsTokenValid,)
    def get(self, request, format=None):
        """
        Return a list of all toolkit_tiers.
        """
        toolkit_tiers = ToolkitTier.objects.all().order_by('id')
        serializer = ToolkitTierSerializer(toolkit_tiers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = ToolkitTierSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ToolkitTierDetailView(RetrieveUpdateDestroyAPIView):

    """
    GET toolkit_tiers/:id/
    PUT toolkit_tiers/:id/
    DELETE toolkit_tiers/:id/
    """

    """
    * Allow only authenticated toolkit_tiers to access this url
    """
    permission_classes = ( IsAuthenticated and IsTokenValid,)
    queryset = ToolkitTier.objects.all().order_by('id')

    def get(self, request, *args, **kwargs):
        try:
            toolkit_tier = self.queryset.get(pk=kwargs["pk"])
            return Response(ToolkitTierSerializer(toolkit_tier).data)
        except ToolkitTier.DoesNotExist:
            response = {"message": "Toolkit Tier with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, *args, **kwargs):
        try:
            toolkit_tier = self.queryset.get(pk=kwargs["pk"])
            serializer = ToolkitTierSerializer()
            updated_toolkit_tier = serializer.update(toolkit_tier, request.data)
            return Response(ToolkitTierSerializer(updated_toolkit_tier).data)
        except ToolkitTier.DoesNotExist:
            response = {"message": "Toolkit Tier with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, *args, **kwargs):
        try:
            toolkit_tier = self.queryset.get(pk=kwargs["pk"])
            toolkit_tier.delete()
            response = {"message": "Deleted Toolkit Tier Successfully!"}
            return Response(response, status=status.HTTP_204_NO_CONTENT)
        except ToolkitTier.DoesNotExist:
            response = {"message": "Toolkit Tier with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)
