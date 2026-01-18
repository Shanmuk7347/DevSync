from rest_framework import serializers
from devsync.models import Project, JoinRequest, Notifications
from django.contrib.auth import get_user_model

User = get_user_model()

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "bio", "skills", "experience", "role"]
        read_only_fields = ["id", "email"]
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]

class ProjectSerializer(serializers.ModelSerializer):
    leader = UserSerializer(read_only=True)
    members = UserSerializer(many=True, read_only=True)
    is_applied = serializers.SerializerMethodField()
    request_status = serializers.SerializerMethodField()
    request_type = serializers.SerializerMethodField()
    members_email = serializers.EmailField(write_only=True, required=False, allow_blank=True, allow_null=True)
    class Meta:
        model = Project
        fields = ["id", "title", "description", "leader", "project_type", "members_email", "members", "skills_req", "role", "status", "difficulty_level", "updated_on", "created_at", "is_applied", "request_status", "request_type"]

    def create(self, validated_data):
        member_email = validated_data.pop('member_email', None)
        user_to_add = None

        if member_email:
            try:
                user_to_add = User.objects.get(email=member_email)
            except User.DoesNotExist:
                raise serializers.ValidationError({"member_email": "User with this email does not exist."})

        project = Project.objects.create(**validated_data)
        if user_to_add:
            project.members.add(user_to_add)

        return project
    
    def get_is_applied(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return JoinRequest.objects.filter(project=obj, applicant=request.user).exists()
        return False
    
    def get_request_status(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            joinrequest = JoinRequest.objects.filter(project=obj, applicant=request.user).first()
            return joinrequest.status if joinrequest else None
        return None
    
    def get_request_type(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            joinrequest = JoinRequest.objects.filter(project=obj, applicant=request.user).first()
            return joinrequest.request_type if joinrequest else None
        return False


class JoinRequestSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="applicant.username", read_only=True)
    project_title = serializers.CharField(source="project.title", read_only=True)
    class Meta:
        model = JoinRequest
        fields = ["id", "project_title", "applicant", "username", "status", "message",]
        read_only_fields = ["id", "applicant", "status"]
    
class RequestActionSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=["accept", "reject"])

class SendInviteSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    project_id = serializers.IntegerField()
    message = serializers.CharField(required=False, allow_blank=True)

class InviteListSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source="project.title", read_only=True)
    sender_name = serializers.CharField(source="project.leader.username", read_only=True)

    class Meta:
        model = JoinRequest
        fields = ["id", "project_id", "project_title", "sender_name", "status", "message", "request_type"]
        read_only_fields = ["id", "status"]

class SentInviteListSerializer(serializers.ModelSerializer):
    applicant_name = serializers.CharField(source="applicant.username", read_only=True)
    class Meta:
        model = JoinRequest
        fields = ["id", "applicant", "applicant_name", "status", "message"]
        read_only_fields = ["id", "status"]

class RemoveMemberSerializer(serializers.Serializer):
    project_id = serializers.IntegerField()
    user_id = serializers.IntegerField() 

class ExitTeamSerializer(serializers.Serializer):
    project_id = serializers.IntegerField()

class NotificationsSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.username', read_only=True)

    class Meta:
        model = Notifications
        fields = ["id", "sender_name", "notification_type", "message", "is_read", "created_at", "target_id"]
