import jwt
import requests

from .models import RelationshipManager
from .serializers import RelationshipManagerSerializer

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
from authentication.models import User
from authentication.serializers import UserSerializer

class RelationshipManagerList(ListCreateAPIView):
    """
    View to list all relationship_managers and create a relationship_manager in the system.

    GET relationship_managers/
    POST relationship_managers/
    """
    permission_classes = (IsAuthenticated and IsTokenValid,)
    def get(self, request, format=None):
        """
        Return a list of all RelationshipManagers.
        """
        relationship_managers = RelationshipManager.objects.all()
        responses = []
        for relationship_manager in relationship_managers:
            response = RelationshipManagerSerializer(relationship_manager).data
            response['user'] = UserSerializer(User.objects.get(email = User.objects.get(email=relationship_manager.user_id))).data
            responses.append(response)
        return Response(responses, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = RelationshipManagerSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class RelationshipManagerDetailView(RetrieveUpdateDestroyAPIView):

    """
    GET relationship_managers/:id/
    PUT relationship_managers/:id/
    DELETE relationship_managers/:id/
    """

    """
    * Allow only authenticated relationship_managers to access this url
    """
    permission_classes = ( IsAuthenticated and IsTokenValid,)
    queryset = RelationshipManager.objects.all()

    def get(self, request, *args, **kwargs):
        try:
            relationship_manager = self.queryset.get(pk=kwargs["pk"])
            return Response(RelationshipManagerSerializer(relationship_manager).data)
        except RelationshipManager.DoesNotExist:
            response = {"message": "Other Provider with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, *args, **kwargs):
        try:
            relationship_manager = self.queryset.get(pk=kwargs["pk"])
            serializer = RelationshipManagerSerializer()
            updated_relationship_manager = serializer.update(relationship_manager, request.data)
            return Response(RelationshipManagerSerializer(updated_relationship_manager).data)
        except RelationshipManager.DoesNotExist:
            response = {"message": "RelationshipManager with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, *args, **kwargs):
        try:
            relationship_manager = self.queryset.get(pk=kwargs["pk"])
            relationship_manager.delete()
            response = {"message": "Deleted RelationshipManager Successfully!"}
            return Response(response, status=status.HTTP_204_NO_CONTENT)
        except RelationshipManager.DoesNotExist:
            response = {"message": "RelationshipManager with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)
