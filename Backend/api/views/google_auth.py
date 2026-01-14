from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
import os

User = get_user_model()

class GoogleLogin(APIView):
    def post(self, request):
        token = request.data.get("token")

        try:
            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                os.getenv("GOOGLE_CLIENT_ID")
            )
        except ValueError:
            return Response({"error": "Invalid token"}, status=400)

        email = idinfo["email"]
        name = idinfo.get("name", "")

        user, created = User.objects.get_or_create(
            email=email,
            defaults={"username": email.split("@")[0]}
        )

        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "new_user": created
        })
