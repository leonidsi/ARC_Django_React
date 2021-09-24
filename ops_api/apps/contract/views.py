import jwt
import requests

from .models import Contract
from .serializers import ContractSerializer

from django.shortcuts import render
from django.conf import settings
from django.core import serializers
from django.utils.encoding import smart_text

from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser, BasePermission
from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework_jwt.utils import jwt_payload_handler
from rest_framework.authentication import BasicAuthentication, get_authorization_header
from rest_framework.exceptions import AuthenticationFailed

from apps.authentication.views import IsTokenValid
from apps.client.models import Client
from apps.client.serializers import ClientSerializer
from apps.account_manager.models import AccountManager
from apps.account_manager.serializers import AccountManagerSerializer
from apps.relationship_manager.models import RelationshipManager
from apps.relationship_manager.serializers import RelationshipManagerSerializer
from apps.authentication.models import User
from apps.authentication.serializers import UserSerializer

class ContractList(ListCreateAPIView):
    """
    View to list all contracts and create a contract in the system

    GET contracts/
    POST contracts/
    """
    permission_classes = (IsAuthenticated and IsTokenValid,)
    def get(self, request, format=None):
        """
        Return a list of all Contracts.
        """
        contracts = Contract.objects.all().order_by('id')
        responses = ContractSerializer(contracts, many=True).data
        client_data = ClientSerializer(Client.objects.all().order_by('id'), many=True).data
        sales_rep_data = AccountManagerSerializer(AccountManager.objects.all().order_by('id'), many=True).data
        relationship_manager_data = RelationshipManagerSerializer(RelationshipManager.objects.all().order_by('id'), many=True).data
        user_data = UserSerializer(User.objects.all().order_by('id'), many=True).data

        res_responses = []

        for response in responses:
            if response['client_id'] != None:
                response['client_id'] = client_data[response['client_id']-1]
            if response['sales_rep_id'] != None:
                response['sales_rep_id'] = sales_rep_data[response['sales_rep_id']-1]
                if isinstance(response['sales_rep_id']['user_id'], int):                    
                    response['sales_rep_id']['user_id'] = user_data[response['sales_rep_id']['user_id']-1]
            # if response['relationship_manager_id'] != None:
            #     response['relationship_manager_id'] = relationship_manager_data[response['relationship_manager_id']-1]
            #     if isinstance(response['relationship_manager_id']['user_id'], int):                    
            #         response['relationship_manager_id']['user_id'] = user_data[response['relationship_manager_id']['user_id']-1]
            res_responses.append(response)
        
        return Response(responses, status=status.HTTP_200_OK)
        

    def post(self, request, *args, **kwargs):
        """
        Create New Contract with request data.
        """
        serializer = ContractSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ContractDetailView(RetrieveUpdateDestroyAPIView):
    """
    GET contracts/:id/
    POST contracts/:id/
    DELETE contracs/:id/
    """

    """
    Allow only authenticated users to access this url
    """
    permission_classes = (IsAuthenticated and IsTokenValid,)
    queryset = Contract.objects.all().order_by('id')

    def get(self, request, *args, **kwargs):
        try:
            contract = self.queryset.get(pk=kwargs["pk"])
            return Response(ContractSerializer(contract).data)
        except Contract.DoesNotExist:
            response = {"message": "Contract with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, *args, **kwargs):
        try:
            contract = self.queryset.get(pk=kwargs["pk"])
            serializer = ContractSerializer()
            update_contract = serializer.update(contract, request.data)
            return Response(ContractSerializer(update_contract).data)
        except Contract.DoesNotExist:
            response = {"message": "Contract with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, *args, **kwargs):
        try:
            contract = self.queryset.get(pk=kwargs["pk"])
            contract.delete()
            response = {"message": "Deleted Contract Successfully!"}
            return Response(response, status=status.HTTP_204_NO_CONTENT)
        except Contract.DoesNotExist:
            response = {"message": "Contract with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)
