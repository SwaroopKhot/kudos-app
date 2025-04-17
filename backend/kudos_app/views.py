from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import User, Organization, Kudos
from django.contrib.auth.hashers import make_password, check_password
from .serializers import UserSerializer, KudosSerializer
from datetime import datetime
import jwt
from django.conf import settings



def validate_jwt(token):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise Exception("Token has expired.")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token.")


# Create your views here.
@api_view(['GET'])
def get_user(request):
    users = User.objects.all()
    serialize_user = UserSerializer(users, many=True)
    
    return Response(serialize_user.data)

@api_view(["POST"])
def create_user(request):
    org_name = request.data.get("organization")

    if not org_name:
        return Response({"error": "Organization name is required."}, status=status.HTTP_400_BAD_REQUEST)

    organization, created = Organization.objects.get_or_create(name=org_name)
    
    user_data = {
        "username": request.data.get("username"),
        "email": request.data.get("email"),
        "password":  request.data.get("password"),
        "organization": organization.id,
        "is_active" : True
    }

    serializer = UserSerializer(data=user_data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User created successfully.", "data": serializer.data}, status=status.HTTP_201_CREATED)
    
    errors = {"error": []}
    for field, error_messages in serializer.errors.items():
        for error in error_messages:
            errors["error"].append(f"{field}: {error}")
    return Response(errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(["POST"])
def login_user(request):
    email = request.data.get("email")
    password = request.data.get("password")
    
    if not email or not password:
        return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
        
        if password == user.password:
            serializer = UserSerializer(user)
            return Response({"message" : "Login Successfull", "data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"error" : "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist:
        return Response({"error" : "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED)
            


@api_view(["POST"])
@permission_classes([]) 
def create_kudos(request):
    auth_header = request.headers.get('Authorization')
    try:
        token = auth_header.split(" ")[-1]
        token_data = validate_jwt(token)
    except Exception as er:
        print("No token")
        return Response({'error': 'Authentication credentials were not provided. '}, status=401)
    
    
    # sender = request.user 
    sender_id = request.data.get("sender")
    receiver_id = request.data.get("receiver")
    message = request.data.get("message")
    headline = request.data.get("headline")

    try:
        sender = User.objects.get(id=sender_id)
        receiver = User.objects.get(id=receiver_id)
    except User.DoesNotExist:
        return Response({"error": "Invalid sender or receiver ID."}, status=400)
    

    now = datetime.now()
    current_week = now.isocalendar()[1]
    current_year = now.year
    
    kudos_sent = Kudos.objects.filter(
        sender=sender,
        created_at__week=current_week,
        created_at__year=current_year
    ).count()
    
    if kudos_sent >= 3:
        return Response({"error": "You have already given 3 kudos this week."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        receiver = User.objects.get(id=receiver_id)
    except User.DoesNotExist:
        return Response({"error": "Receiver does not exist."}, status=status.HTTP_400_BAD_REQUEST)

    kudo = Kudos.objects.create(sender=sender, receiver=receiver, message=message, headline=headline)
    # created_at=datetime(2025, 4, 24, 10, 30)
    
    serialized_kudo = KudosSerializer(kudo)
    return Response({"message": "Kudos sent!", "data": serialized_kudo.data}, status=status.HTTP_201_CREATED)



@api_view(['GET'])
@permission_classes([]) 
def kudos_filter_by_week(request):
    auth_header = request.headers.get('Authorization')
    try:
        token = auth_header.split(" ")[-1]
        token_data = validate_jwt(token)
    except Exception as er:
        print("No token")
        return Response({'error': 'Authentication credentials were not provided. '}, status=401)
    
    
    user_id = request.query_params.get('user_id')
    selected_date = request.query_params.get('date')
    filter_type = request.query_params.get("filter_type")
    
    print(user_id, selected_date, filter_type)

    if not user_id or not selected_date:
        return Response({"error": "Both user_id and date are required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        selected_date_obj = datetime.strptime(selected_date, "%Y-%m-%d")
    except ValueError:
        return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

    week_number = selected_date_obj.isocalendar()[1]
    year = selected_date_obj.year

    if filter_type == "sent":
        kudos = Kudos.objects.filter(
            sender=user,
            created_at__week=week_number,
            created_at__year=year
        )
    else:
        kudos = kudos = Kudos.objects.filter(
            receiver=user,
            created_at__week=week_number,
            created_at__year=year
        )
        
    serializer = KudosSerializer(kudos, many=True)
    print(serializer.data)
    return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(['POST'])
@permission_classes([]) 
def get_kudos_left(request):
    auth_header = request.headers.get('Authorization')
    try:
        token = auth_header.split(" ")[-1]
        token_data = validate_jwt(token)
    except Exception as er:
        print("No token")
        return Response({'error': 'Authentication credentials were not provided. '}, status=401)
    
    
    user_id = request.data.get("user_id")
    
    if not user_id:
        return Response({"error": "User ID is required."}, status=400)

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "Invalid user ID."}, status=400)

    date_obj = datetime.now()
    
    current_week = date_obj.isocalendar()[1]
    current_year = date_obj.year

    kudos_count = Kudos.objects.filter(
        sender=user,
        created_at__week=current_week,
        created_at__year=current_year
    ).count()

    kudos_left = max(0, 3 - kudos_count)

    return Response({
        "user_id": user_id,
        "week": current_week,
        "year": current_year,
        "kudos_left": kudos_left
    })
    

@api_view(['POST'])
@permission_classes([]) 
def list_users_in_org(request):
    auth_header = request.headers.get('Authorization')
    try:
        token = auth_header.split(" ")[-1]
        token_data = validate_jwt(token)
    except Exception as er:
        print("No token")
        return Response({'error': 'Authentication credentials were not provided'}, status=401)
    
    
    user_id = request.data.get("user_id")
    
    if not user_id:
        return Response({"error": "User ID is required."}, status=400)

    try:
        current_user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "Invalid user ID."}, status=400)

    users = User.objects.filter(organization=current_user.organization).exclude(id=current_user.id)
    serialized_users = UserSerializer(users, many=True)
    
    return Response({
        "organization": current_user.organization.name,
        "users": serialized_users.data
    })


from rest_framework_simplejwt.views import TokenObtainPairView
from .tokens import CustomTokenObtainPairSerializer

class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
