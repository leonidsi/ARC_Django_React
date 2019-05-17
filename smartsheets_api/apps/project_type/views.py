import jwt
import requests

from .models import ProjectType
from .serializers import ProjectTypeSerializer

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

class ProjectTypeList(ListCreateAPIView):
    """
    View to list all users and create a user in the system.

    GET project_types/
    POST project_types/
    """
    permission_classes = (IsAuthenticated and IsTokenValid,)
    def get(self, request, format=None):
        """
        Return a list of all project types.
        """
        project_types = ProjectType.objects.all()
        serializer = ProjectTypeSerializer(project_types, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = ProjectTypeSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ProjectTypeDetailView(RetrieveUpdateDestroyAPIView):

    """
    GET project_types/:id/
    PUT project_types/:id/
    DELETE project_types/:id/
    """

    """
    * Allow only authenticated project_types to access this url
    """
    permission_classes = ( IsAuthenticated and IsTokenValid,)
    queryset = ProjectType.objects.all()

    def get(self, request, *args, **kwargs):
        try:
            project_type = self.queryset.get(pk=kwargs["pk"])
            return Response(ProjectTypeSerializer(project_type).data)
        except ProjectType.DoesNotExist:
            response = {"message": "Project Type with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, *args, **kwargs):
        try:
            project_type = self.queryset.get(pk=kwargs["pk"])
            serializer = ProjectTypeSerializer()
            updated_project_type = serializer.update(project_type, request.data)
            return Response(ProjectTypeSerializer(updated_project_type).data)
        except ProjectType.DoesNotExist:
            response = {"message": "Project Type with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, *args, **kwargs):
        try:
            project_type = self.queryset.get(pk=kwargs["pk"])
            project_type.delete()
            response = {"message": "Deleted Project Type Successfully!"}
            return Response(response, status=status.HTTP_204_NO_CONTENT)
        except ProjectType.DoesNotExist:
            response = {"message": "Project Type with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)
