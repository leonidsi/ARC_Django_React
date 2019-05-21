import jwt
import requests

from .models import ProjectManager
from .serializers import ProjectManagerSerializer

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
from apps.role.models import Role
from apps.role.serializers import RoleSerializer

class ProjectManagerList(ListCreateAPIView):
    """
    View to list all project_managers and create a project_manager in the system.

    GET project_managers/
    POST project_managers/
    """
    permission_classes = (IsAuthenticated and IsTokenValid,)
    def get(self, request, format=None):
        """
        Return a list of all ProjectManagers.
        """
        project_managers = ProjectManager.objects.all()
        responses = []
        for project_manager in project_managers:
            response = ProjectManagerSerializer(project_manager).data
            response['user'] = UserSerializer(User.objects.get(email = project_manager.user_id)).data
            responses.append(response)
        return Response(responses, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = ProjectManagerSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user = User.objects.get(id=request.data['user_id'])
        user.roleId = RoleSerializer(Role.objects.get(name='Project Manager')).data['id']
        user.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ProjectManagerDetailView(RetrieveUpdateDestroyAPIView):

    """
    GET project_managers/:id/
    PUT project_managers/:id/
    DELETE project_managers/:id/
    """

    """
    * Allow only authenticated project_managers to access this url
    """
    permission_classes = ( IsAuthenticated and IsTokenValid,)
    queryset = ProjectManager.objects.all()

    def get(self, request, *args, **kwargs):
        try:
            project_manager = self.queryset.get(pk=kwargs["pk"])
            return Response(ProjectManagerSerializer(project_manager).data)
        except ProjectManager.DoesNotExist:
            response = {"message": "Project Manager with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, *args, **kwargs):
        try:
            project_manager = self.queryset.get(pk=kwargs["pk"])
            serializer = ProjectManagerSerializer()
            updated_project_manager = serializer.update(project_manager, request.data)
            return Response(ProjectManagerSerializer(updated_project_manager).data)
        except ProjectManager.DoesNotExist:
            response = {"message": "Project Manager with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, *args, **kwargs):
        try:
            project_manager = self.queryset.get(pk=kwargs["pk"])
            project_manager.delete()
            response = {"message": "Deleted Project Manager Successfully!"}
            return Response(response, status=status.HTTP_204_NO_CONTENT)
        except ProjectManager.DoesNotExist:
            response = {"message": "Project Manager with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)
