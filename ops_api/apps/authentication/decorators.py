from rest_framework.response import Response
from rest_framework.views import status


def validate_request_data(fn):
    def decorated(*args, **kwargs):
        # args[0] == GenericView Object
        email = args[0].request.data.get("email", "")
        password = args[0].request.data.get("password", "")

        if not email and not email and not password:
            return Response(
                data={
                    "message": "Both email and password are required to add a user"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        return fn(*args, **kwargs)
    return decorated
