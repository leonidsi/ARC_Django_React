import jwt
import requests

from .models import Project
from .serializers import ProjectSerializer

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

class ProjectList(ListCreateAPIView):
    """
    View to list all projects and create a project in the system.

    GET projects/
    POST projects/
    """
    permission_classes = (IsAuthenticated and IsTokenValid,)
    def get(self, request, format=None):
        """
        Return a list of all Projects.
        """
        projects = Project.objects.all()
        responses = []
        for project in projects:
            response = ProjectSerializer(project).data
            response['user'] = UserSerializer(User.objects.get(email = User.objects.get(email=project.user_id))).data
            responses.append(response)
        return Response(responses, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = ProjectSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ProjectDetailView(RetrieveUpdateDestroyAPIView):

    """
    GET projects/:id/
    PUT projects/:id/
    DELETE projects/:id/
    """

    """
    * Allow only authenticated projects to access this url
    """
    permission_classes = ( IsAuthenticated and IsTokenValid,)
    queryset = Project.objects.all()

    def get(self, request, *args, **kwargs):
        try:
            project = self.queryset.get(pk=kwargs["pk"])
            return Response(ProjectSerializer(project).data)
        except Project.DoesNotExist:
            response = {"message": "Project with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, *args, **kwargs):
        try:
            project = self.queryset.get(pk=kwargs["pk"])
            serializer = ProjectSerializer()
            updated_project = serializer.update(project, request.data)
            return Response(ProjectSerializer(updated_project).data)
        except Project.DoesNotExist:
            response = {"message": "Project with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, *args, **kwargs):
        try:
            project = self.queryset.get(pk=kwargs["pk"])
            project.delete()
            response = {"message": "Deleted Project Successfully!"}
            return Response(response, status=status.HTTP_204_NO_CONTENT)
        except Project.DoesNotExist:
            response = {"message": "Project with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)
