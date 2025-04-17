from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from .models import User

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "email"

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise AuthenticationFailed("No user found with this email.")

        if not user.is_active:
            raise AuthenticationFailed("User is inactive.")

        if user.password != password:
            raise AuthenticationFailed("Invalid password.")

        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token

        access_token["id"] = user.id
        access_token["username"] = user.username
        access_token["email"] = user.email

        return {
            "refresh": str(refresh),
            "access": str(access_token),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "organization": user.organization.name if user.organization else None
            }
        }
