import jwt
import requests

from django.conf import settings
from django.utils.encoding import smart_text
from django.core import serializers

from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser, BasePermission
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework_jwt.utils import jwt_payload_handler
from rest_framework.authentication import BasicAuthentication, get_authorization_header
from rest_framework.exceptions import AuthenticationFailed

from .decorators import validate_request_data
from .models import User, BlackListedToken
from .serializers import UserSerializer
from .onelogin import OneLogin, Token, User as OneLoginUser

from apps.role.models import Role
from apps.role.serializers import RoleSerializer

from apps.project_manager.models import ProjectManager
from apps.account_manager.models import AccountManager
from apps.consultant.models import Consultant
from apps.relationship_manager.models import RelationshipManager

def get_token(request):
    auth = get_authorization_header(request).split()
    auth_header_prefix = settings.JWT_AUTH['JWT_AUTH_HEADER_PREFIX']

    if not auth or smart_text(auth[0]) != auth_header_prefix:
        return None

    if len(auth) == 1:
        msg = _('Invalid Authorization header. No credentials provided')
        raise AuthenticationFailed(msg)
    elif len(auth) > 2:
        msg = _('Invalid Authorization header. Credentials string should not contain spaces.')
        raise AuthenticationFailed(msg)

    token = smart_text(auth[1])
    return token

class IsTokenValid(BasePermission):

    def has_permission(self, request, view):
        
        is_allowed_user = True
        
        token = get_token(request)
        decode_token = jwt.decode(token, settings.SECRET_KEY, algorithm='HS256')
        try:
            is_takedToken = User.objects.get(email=decode_token['email'])
            if is_takedToken:
                try:
                    is_blackListed = BlackListedToken.objects.get(token=token)
                    if is_blackListed:
                        is_allowed_user = False
                except BlackListedToken.DoesNotExist:
                    is_allowed_user = True
        except User.DoesNotExist:
            is_allowed_user = False
        return is_allowed_user

class SSOLoginView(APIView):

    permission_classes = (AllowAny, )
    
    def post(self, request, *args, **kwargs):
        email = request.data['email']
        password = request.data['password']
        subdomain = settings.SUBDOMAIN

        token = Token(client_id=settings.ONELOGIN_CLIENT_ID, client_secret=settings.ONELOGIN_CLIENT_SECRET)
        one_login_user = OneLoginUser(token)
        one_login_response = one_login_user.create_session_login_token(username_or_email=email, password=password, subdomain=subdomain)
        
        one_login_response_status_code = one_login_response['status']['code']
     
        if one_login_response_status_code == 200:
            one_login_response_user_data = one_login_response['data'][0]['user']
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                data = request.data
                data['firstname'] = one_login_response_user_data['firstname']
                data['lastname'] = one_login_response_user_data['lastname']
                data['username'] = one_login_response_user_data['username']
                data['roleId'] = 1
                serializer = UserSerializer(data=data, context={'request': request})
                serializer.is_valid(raise_exception=True)
                serializer.save()
                user = User.objects.get(email = serializer.data['email'])
            except Exception as e:
                raise e            
            payload = jwt_payload_handler(user)
            token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
            response = {}
            response['user_id'] = user.id
            response['token'] = token
            return Response(response, status=status.HTTP_200_OK)
        elif one_login_response_status_code in (400, 401):
            response = one_login_response['status']['message']
            if one_login_response_status_code == 400:
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            elif one_login_response_status_code == 401:
                return Response(response, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):

    permission_classes = (AllowAny,)

    def get(self, request, *args, **kwargs):
        token = get_token(request)
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithm='HS256')
        user = User.objects.get(email=decoded['email'])
        black_list_token = BlackListedToken(user=user, token=token)
        black_list_token.save()
        response = {"message": "Logout Successfully"}
        return Response(response, status=status.HTTP_201_CREATED)

class UserDetailView(RetrieveUpdateDestroyAPIView):

    """
    GET users/:id/
    PUT users/:id/
    DELETE users/:id/
    """

    """
    * Allow only authenticated users to access this url
    """
    permission_classes = ( IsAuthenticated and IsTokenValid,)
    queryset = User.objects.all()

    def get(self, request, *args, **kwargs):
        try:
            user = self.queryset.get(pk=kwargs["pk"])
            response = {}
            response = UserSerializer(user).data
            # response['userRoles'] = [RoleSerializer(Role.objects.get(name = User.objects.select_related('roleId').get(id=kwargs["pk"]).roleId)).data]
            response['userRoles'] = [RoleSerializer(Role.objects.get(id = User.objects.get(id=kwargs["pk"]).roleId)).data]
            return Response(response)
        except User.DoesNotExist:
            response = {"message": "User with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, *args, **kwargs):
        try:
            user = self.queryset.get(pk=kwargs["pk"])
            serializer = UserSerializer()
            user.role = request.data['userRoles']
            updated_user = serializer.update(user, request.data)
            response = {}
            response = UserSerializer(updated_user).data
            # response['userRoles'] = [RoleSerializer(Role.objects.get(name = User.objects.select_related('roleId').get(id=kwargs["pk"]).roleId)).data]
            response['userRoles'] = [RoleSerializer(Role.objects.get(id = User.objects.get(id=kwargs["pk"]).roleId)).data]
    
            # if request.data['roleId'] == 2:
            #     project_manager = ProjectManager.objects.get(user_id=user)
            #     project_manager.save()
            # if request.data['roleId'] == 3:
            #     account_manager = AccountManager.objects.get(user_id=user)
            #     account_manager.save()
            # if request.data['roleId'] == 4:
            #     consultant = Consultant.objects.get(user_id=user)
            #     Consultant.save()
            # if request.data['roleId'] == 8:
            #     relationship_manager = RelationshipManager.objects.get(user_id=user)
            #     relationship_manager.save()

            return Response(response)
        except User.DoesNotExist:
            response = {"message": "User with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, *args, **kwargs):
        try:
            user = self.queryset.get(pk=kwargs["pk"])

            if user.roleId == 2:
                project_manager = ProjectManager.objects.get(user_id=user)
                project_manager.delete()
            if request.data['roleId'] == 3:
                account_manager = AccountManager.objects.get(user_id=user)
                account_manager.delete()
            if request.data['roleId'] == 4:
                consultant = Consultant.objects.get(user_id=user)
                Consultant.delete()
            if request.data['roleId'] == 8:
                relationship_manager = RelationshipManager.objects.get(user_id=user)
                relationship_manager.delete()
            
            user.delete()
            response = {"message": "Deleted User Successfully!"}
            return Response(response, status=status.HTTP_204_NO_CONTENT)

        except User.DoesNotExist:
            response = {"message": "user with id: {} does not exist".format(kwargs["pk"])}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

class ListCreateUsersView(ListCreateAPIView):
    """
    View to list all users and create a user in the system.

    GET users/
    POST users/
    """

    """
    * Requires token authentication.
    * Only admin users are able to access this view.
    """
    permission_classes = (IsAdminUser and IsTokenValid,)
    def get(self, request, format=None):
        """
        Return a list of all users.
        """
        users = User.objects.all()
        responses = []
        for user in users:
            response = UserSerializer(user).data
            # response['userRoles'] = [RoleSerializer(Role.objects.get(name = User.objects.select_related('roleId').get(id=user.id).roleId)).data]
            response['userRoles'] = [RoleSerializer(Role.objects.get(id = User.objects.get(id=user.id).roleId)).data]
            responses.append(response)
        return Response(responses, status=status.HTTP_200_OK)

    @validate_request_data
    def post(self, request, *args, **kwargs):

        keys = ['username', 'firstname', 'lastname', 'email']
        kwargs = {}
        for key in keys:
            kwargs[key]=request.data[key]

        token = Token(client_id=settings.ONELOGIN_CLIENT_ID, client_secret=settings.ONELOGIN_CLIENT_SECRET)
        one_login_user = OneLoginUser(token)
        one_login_create_user_response = one_login_user.create_user(**kwargs)

        data = kwargs
        data.update({'password': 'password', 'roleId': request.data['roleId']})
        serializer = UserSerializer(data=data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        response = serializer.data

        user = User.objects.get(username=request.data['username'])
        if request.data['roleId'] == 2:
            project_manager = ProjectManager(user_id = user)
            project_manager.save()
        if request.data['roleId'] == 3:
            account_manager = AccountManager(user_id = user)
            account_manager.save()
        if request.data['roleId'] == 4:
            consultant = Consultant(user_id = user)
            Consultant.save()
        if request.data['roleId'] == 8:
            relationship_manager = RelationshipManager(user_id = user)
            relationship_manager.save()
        
        return Response(response, status=status.HTTP_201_CREATED)
