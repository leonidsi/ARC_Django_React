import jwt
import requests

from .models import NaicsCode
from .serializers import NaicsCodeSerializer

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

class NaicsCodeList(ListCreateAPIView):
    """
    View to list all users and create a user in the system.

    GET naics_codes/
    POST naics_codes/
    """
    permission_classes = (IsAuthenticated and IsTokenValid,)
    def get(self, request, format=None):
        """
        Return a list of all other providers.
        """
        naics_codes =  NaicsCode.objects.all()
        serializer =  NaicsCodeSerializer(naics_codes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer =  NaicsCodeSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class NaicsCodeDetailView(RetrieveUpdateDestroyAPIView):

    """
    GET naics_codes/:id/
    PUT naics_codes/:id/
    DELETE naics_codes/:id/
    """

    """
    * Allow only authenticated naics_codes to access this url
    """
    permission_classes = ( IsAuthenticated and IsTokenValid,)
    queryset =  NaicsCode.objects.all()

    def get(self, request, *args, **kwargs):
        try:
            naics_code = self.queryset.get(pk=kwargs["pk"])
            return Response( NaicsCodeSerializer(naics_code).data)
        except  NaicsCode.DoesNotExist:
            response = {"message": "Naics Code with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, *args, **kwargs):
        try:
            naics_code = self.queryset.get(pk=kwargs["pk"])
            serializer =  NaicsCodeSerializer()
            updated_naics_code = serializer.update(naics_code, request.data)
            return Response( NaicsCodeSerializer(updated_naics_code).data)
        except  NaicsCode.DoesNotExist:
            response = {"message": "Naics Code with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, *args, **kwargs):
        try:
            naics_code = self.queryset.get(pk=kwargs["pk"])
            naics_code.delete()
            response = {"message": "Deleted Naics Code Successfully!"}
            return Response(response, status=status.HTTP_204_NO_CONTENT)
        except  NaicsCode.DoesNotExist:
            response = {"message": "Naics Code with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)
