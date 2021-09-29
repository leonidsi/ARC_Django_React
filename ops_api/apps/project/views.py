import jwt
import requests

from .models import Project, Template
from .serializers import ProjectSerializer, TemplateSerializer

from django.conf import settings
from django.utils.encoding import smart_text
from django.core import serializers
from django.core.mail import send_mail

from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser, BasePermission
from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView
from rest_framework_jwt.utils import jwt_payload_handler
from rest_framework.authentication import BasicAuthentication, get_authorization_header
from rest_framework.exceptions import AuthenticationFailed

from apps.authentication.views import IsTokenValid
from apps.authentication.models import User
from apps.authentication.serializers import UserSerializer
from apps.client.models import Client
from apps.client.serializers import ClientSerializer
from apps.project_type.models import ProjectType
from apps.project_type.serializers import ProjectTypeSerializer
from apps.account_manager.models import AccountManager
from apps.account_manager.serializers import AccountManagerSerializer
from apps.relationship_manager.models import RelationshipManager
from apps.relationship_manager.serializers import RelationshipManagerSerializer
from apps.project_manager.models import ProjectManager
from apps.project_manager.serializers import ProjectManagerSerializer
from apps.consultant.models import Consultant
from apps.consultant.serializers import ConsultantSerializer

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
        projects = Project.objects.filter(is_template=False).order_by('id')
        responses = ProjectSerializer(projects, many=True).data
        # client_data = ClientSerializer(Client.objects.all().order_by('id'), many=True).data
        # project_type_data = ProjectTypeSerializer(ProjectType.objects.all().order_by('id'), many=True).data
        # project_manager_data = ProjectManagerSerializer(ProjectManager.objects.all().order_by('id'), many=True).data
        # account_manager_data = AccountManagerSerializer(AccountManager.objects.all().order_by('id'), many=True).data
        # relationship_manager_data = RelationshipManagerSerializer(RelationshipManager.objects.all().order_by('id'), many=True).data
        # consultant_data = ConsultantSerializer(Consultant.objects.all().order_by('id'), many=True).data
        # user_data = UserSerializer(User.objects.all().order_by('id'), many=True).data

        res_responses = []

        for response in responses:
            if response['client_id'] != None:
                response['client_id'] = client_data[response['client_id']-1]
            if response['project_type_id'] != None:
                response['project_type_id'] = project_type_data[response['project_type_id']-1]
            if response['project_mgr_id'] != None:
                response['project_mgr_id'] = project_manager_data[response['project_mgr_id']-1]
                if isinstance(response['project_mgr_id']['user_id'], int):
                    response['project_mgr_id']['user_id'] = user_data[response['project_mgr_id']['user_id']-1]
            if response['account_mgr_id'] != None:
                response['account_mgr_id'] = account_manager_data[response['account_mgr_id']-1]
                if isinstance(response['account_mgr_id']['user_id'], int):                    
                    response['account_mgr_id']['user_id'] = user_data[response['account_mgr_id']['user_id']-1]
            if response['relationship_mgr_id'] != None:
                response['relationship_mgr_id'] = relationship_manager_data[response['relationship_mgr_id']-1]
                if isinstance(response['relationship_mgr_id']['user_id'], int):
                    response['relationship_mgr_id']['user_id'] = user_data[response['relationship_mgr_id']['user_id']-1]
            if response['consultant_id'] != None:
                response['consultant_id'] = consultant_data[response['consultant_id']-1]
                if isinstance(response['consultant_id']['user_id'], int):
                    response['consultant_id']['user_id'] = user_data[response['consultant_id']['user_id']-1]
            res_responses.append(response)
        return Response(responses, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        # request.data.update({'is_template': False})
        serializer = ProjectSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        send_mail(
            'Created new project in Perceptyx',
            'Hello, Jim. Successfully created new project!',
            settings.EMAIL_HOST_USER,
            ['jduncan@perceptyx.com']
        )
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
    queryset = Project.objects.all().order_by('id')

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
            send_mail(
                'Updated a project in Perceptyx',
                'Hello, Jim. Successfully updated a project!',
                settings.EMAIL_HOST_USER,
                ['jduncan@perceptyx.com']
            )
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

class TemplateView(ListCreateAPIView):
    permission_classes = (IsAuthenticated and IsTokenValid,)

    def get(self, request, *args, **kwargs):
        """
        Return a list of all templates for project.
        """
        templates = Template.objects.all()
        responses = []
        for template in templates:
            response = TemplateSerializer(template).data
            responses.append(response)
        return Response(responses, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        request.data.update({'is_template': True})
        request_project_data = request.data['project_data']
        serializer = ProjectSerializer(data=request_project_data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        project_data = serializer.data
        project = Project.objects.get(id=project_data['id'])
        request_template_name = request.data['template_data']['template_name']
        template = Template(name=request_template_name, project=project)
        template.save()
        response = {"message": "Ok"}
        return Response(response, status=status.HTTP_200_OK)


class ProjectHistoryView(ListAPIView):
    permission_classes = (IsAuthenticated and IsTokenValid,)

    def get(self, request, format=None):
        """
        Return a list of all other providers's history.
        """
        project_histories = Project.history.all()
        responses = []        
        for project_history in project_histories:
            response = {}
            response['name'] = project_history.name
            response['date'] = project_history.history_date
            response['type'] = project_history.history_type
            response['user'] = User.objects.get(email=project_history.history_user).username
            responses.append(response)
        return Response(responses, status=status.HTTP_200_OK)