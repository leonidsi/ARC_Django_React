import jwt
import requests

from .models import Consultant
from .serializers import ConsultantSerializer

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
class ConsultantList(ListCreateAPIView):
    """
    View to list all consultants and create a consultant in the system.

    GET consultants/
    POST consultants/
    """
    permission_classes = (IsAuthenticated and IsTokenValid,)
    def get(self, request, format=None):
        """
        Return a list of all Consultants.
        """
        consultants = Consultant.objects.all().order_by('id')
        responses = []
        for consultant in consultants:
            response = ConsultantSerializer(consultant).data
            response['user'] = UserSerializer(User.objects.get(email = consultant.user_id)).data
            responses.append(response)
        
        return Response(responses, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = ConsultantSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()        
        user = User.objects.get(id=request.data['user_id'])
        user.roleId = RoleSerializer(Role.objects.get(name='Consultant')).data['id']
        user.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ConsultantDetailView(RetrieveUpdateDestroyAPIView):

    """
    GET consultants/:id/
    PUT consultants/:id/
    DELETE consultants/:id/
    """

    """
    * Allow only authenticated consultants to access this url
    """
    permission_classes = ( IsAuthenticated and IsTokenValid,)
    queryset = Consultant.objects.all()

    def get(self, request, *args, **kwargs):
        try:
            consultant = self.queryset.get(pk=kwargs["pk"])
            return Response(ConsultantSerializer(consultant).data)
        except Consultant.DoesNotExist:
            response = {"message": "Consultant with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, *args, **kwargs):
        try:
            consultant = self.queryset.get(pk=kwargs["pk"])
            serializer = ConsultantSerializer()
            updated_consultant = serializer.update(consultant, request.data)
            return Response(ConsultantSerializer(updated_consultant).data)
        except Consultant.DoesNotExist:
            response = {"message": "Consultant with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, *args, **kwargs):
        try:
            consultant = self.queryset.get(pk=kwargs["pk"])

            user = User.objects.get(email=consultant.user_id)
            user.roleId = 1
            user.save()

            consultant.delete()
            response = {"message": "Deleted Consultant Successfully!"}
            return Response(response, status=status.HTTP_204_NO_CONTENT)
        except Consultant.DoesNotExist:
            response = {"message": "Consultant with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)
