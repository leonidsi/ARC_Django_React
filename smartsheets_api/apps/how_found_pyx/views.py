import jwt
import requests

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

from .models import HowFoundPyx
from .serializers import HowFoundPyxSerializer

class HowFoundPyxList(ListCreateAPIView):
    """
    View to list all users and create a user in the system.

    GET how_found_pyxes/
    POST how_found_pyxes/
    """
    permission_classes = (IsAuthenticated and IsTokenValid,)
    def get(self, request, format=None):
        """
        Return a list of all other providers.
        """
        how_found_pyxes = HowFoundPyx.objects.all()
        serializer = HowFoundPyxSerializer(how_found_pyxes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = HowFoundPyxSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class HowFoundPyxDetailView(RetrieveUpdateDestroyAPIView):

    """
    GET how_found_pyxes/:id/
    PUT how_found_pyxes/:id/
    DELETE how_found_pyxes/:id/
    """

    """
    * Allow only authenticated how_found_pyxes to access this url
    """
    permission_classes = ( IsAuthenticated and IsTokenValid,)
    queryset = HowFoundPyx.objects.all()

    def get(self, request, *args, **kwargs):
        try:
            how_found_pyx = self.queryset.get(pk=kwargs["pk"])
            return Response(HowFoundPyxSerializer(how_found_pyx).data)
        except HowFoundPyx.DoesNotExist:
            response = {"message": "How Found Pyx with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, *args, **kwargs):
        try:
            how_found_pyx = self.queryset.get(pk=kwargs["pk"])
            serializer = HowFoundPyxSerializer()
            updated_how_found_pyx = serializer.update(how_found_pyx, request.data)
            return Response(HowFoundPyxSerializer(updated_how_found_pyx).data)
        except HowFoundPyx.DoesNotExist:
            response = {"message": "How Found Pyx with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, *args, **kwargs):
        try:
            how_found_pyx = self.queryset.get(pk=kwargs["pk"])
            how_found_pyx.delete()
            response = {"message": "Deleted How Found Pyx Successfully!"}
            return Response(response, status=status.HTTP_204_NO_CONTENT)
        except HowFoundPyx.DoesNotExist:
            response = {"message": "How Found Pyx with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)
