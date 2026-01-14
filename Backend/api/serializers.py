from rest_framework import serializers
from devsync.models import Project, JoinRequest, Notifications, Chat
from django.contrib.auth import get_user_model

User = get_user_model()

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "bio", "skills", "experience", "profile_picture"]

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "profile_picture"]

class ProjectSerializer(serializers.ModelSerializer):
    leader = UserSerializer(read_only=True)
    members = UserSerializer(many=True, read_only=True)
    is_applied = serializers.SerializerMethodField()
    class Meta:
        model = Project
        fields = ["id", "title", "description", "leader", "project_type", "members", "skills_req", "status", "difficulty_level", "created_at", "is_applied"]

    def get_is_applied(self, obj):
        user = self.context.get("request").user
        if user.is_authenticated:
            return JoinRequest.objects.filter(project=obj, applicant=user)
        return False

class JoinRequestSerializer(serializers.ModelSerializer):
    applicant = UserSerializer(read_only=True)
    project_title = serializers.CharField(source="project.title", read_only=True)
    class Meta:
        model = JoinRequest
        fields = ["id", "project_title", "applicant", "status", "message"]
        read_only_fields = ["project_title", "applicant", "status"]
    
class joinRequestActionSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=["accept", "reject"])

class NotificationSerializer(serializers.ModelSerializer):
    pass