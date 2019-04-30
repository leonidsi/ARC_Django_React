import jwt
import requests

from .models import ProjectStatus
from .serializers import ProjectStatusSerializer

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

class ProjectStatusList(ListCreateAPIView):
    """
    View to list all users and create a user in the system.

    GET project_statuses/
    POST project_statuses/
    """
    #permission_classes = (IsAuthenticated and IsTokenValid,)
    def get(self, request, format=None):
        """
        Return a list of all project statues.
        """
        project_statuses = ProjectStatus.objects.all()
        serializer = ProjectStatusSerializer(project_statuses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = ProjectStatusSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ProjectStatusDetailView(RetrieveUpdateDestroyAPIView):

    """
    GET project_statuses/:id/
    PUT project_statuses/:id/
    DELETE project_statuses/:id/
    """

    """
    * Allow only authenticated project_statuses to access this url
    """
    #permission_classes = ( IsAuthenticated and IsTokenValid,)
    queryset = ProjectStatus.objects.all()

    def get(self, request, *args, **kwargs):
        try:
            project_status = self.queryset.get(pk=kwargs["pk"])
            return Response(ProjectStatusSerializer(project_status).data)
        except ProjectStatus.DoesNotExist:
            response = {"message": "Other Provider with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, *args, **kwargs):
        try:
            project_status = self.queryset.get(pk=kwargs["pk"])
            serializer = ProjectStatusSerializer()
            updated_project_status = serializer.update(project_status, request.data)
            return Response(ProjectStatusSerializer(updated_project_status).data)
        except ProjectStatus.DoesNotExist:
            response = {"message": "Other Provider with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, *args, **kwargs):
        try:
            project_status = self.queryset.get(pk=kwargs["pk"])
            project_status.delete()
            response = {"message": "Deleted Other Provider Successfully!"}
            return Response(response, status=status.HTTP_204_NO_CONTENT)
        except ProjectStatus.DoesNotExist:
            response = {"message": "Other Provider with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)
