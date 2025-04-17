from rest_framework import serializers
from .models import User, Organization, Kudos

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    organization = serializers.PrimaryKeyRelatedField(
        queryset=Organization.objects.all(), write_only=True
    )
    organization_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'organization', 'organization_name']
        extra_kwargs = {'password': {'write_only': True}}

    def get_organization_name(self, obj):
        return obj.organization.name if obj.organization else None
    
    
class KudosSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)
    receiver_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='receiver', write_only=True
    )

    class Meta:
        model = Kudos
        fields = ['id', 'sender', 'receiver', 'receiver_id', 'message', 'created_at', 'headline']
