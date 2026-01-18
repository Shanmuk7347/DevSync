from rest_framework.views import APIView, Response
from rest_framework import status, permissions
from api.serializers import projects as proserializers
from devsync import models
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()

#Custom permission class to ensure only leader can edit or delete projects
class IsLeaderOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.leader == request.user

#profile Details
class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(proserializers.ProfileSerializer(request.user).data)
    
    def patch(self, request):
        user = request.user
        serializer = proserializers.ProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ProfilesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profiles = User.objects.exclude(id=request.user.id).all()
        serializer = proserializers.ProfileSerializer(profiles, many=True)
        return Response(serializer.data)
    
class OwnProjectsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        projects = models.Project.objects.filter(leader=request.user)
        serializer = proserializers.ProjectSerializer(projects, many=True, context = {"request": request})
        return Response(serializer.data)
    
    def post(self, request):
        serializer = proserializers.ProjectSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save(leader=request.user) 
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#Projects List
class ProjectView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        projects = models.Project.objects.exclude(leader=request.user)
        serializer = proserializers.ProjectSerializer(projects, many=True, context = {"request": request})
        return Response(serializer.data)
    

#For editing and deleting any created projects
class ProjectDetailedView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsLeaderOrReadOnly]
    def get_project(self, pk):
        project = get_object_or_404(models.Project, pk=pk)
        self.check_object_permissions(self.request, project)
        return project
    
    def get(self, request, pk):
        project = self.get_project(pk)
        serializer = proserializers.ProjectSerializer(project, context={"request": request})
        return Response(serializer.data)
    
    def put(self, request, pk):
        project = self.get_project(pk)
        serializer = proserializers.ProjectSerializer(project, data=request.data, partial=True, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        project = self.get_project(pk)
        project.delete()
        return Response({"message": "Project deleted Succesfully"}, status=status.HTTP_204_NO_CONTENT)

class MyProjectsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        all_projects = models.Project.objects.filter(
            Q(leader=request.user) | Q(members=request.user)
        ).distinct().order_by('-created_at')

        serializer = proserializers.ProjectSerializer(all_projects, many=True)
        return Response(serializer.data)

class ProjectRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated] 

    def get(self, request, project_id):
        project = get_object_or_404(models.Project, id=project_id)

        if project.leader != request.user:
            return Response({"Forrbidden": "You are not the leader of the Project"}, status=status.HTTP_403_FORBIDDEN)
        
        requests = models.JoinRequest.objects.filter(project=project_id, status="PENDING")
        serializer = proserializers.JoinRequestSerializer(requests, many=True)
        return Response(serializer.data)
    
class ManageRequestsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        join_request = get_object_or_404(models.JoinRequest, pk=pk)
        
        if join_request.project.leader != request.user:
            return Response({"Forrbidden": "You are not the leader of the Project"}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = proserializers.RequestActionSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            action = serializer.validated_data["action"]

            if action == "accept":
                join_request.status = "ACCEPTED"
                join_request.save()
                join_request.project.members.add(join_request.applicant)
                return Response({"message": "User Accepted."})
            elif action == "reject":
                join_request.status = "REJECTED"
                join_request.save()
                return Response({"message": "Request Rejected."})


class SendReqeustView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, project_id):
        project = get_object_or_404(models.Project , id=project_id)

        if request.user == project.leader or project.members.filter(id=request.user.id).exists():
            return Response({"message": "You are already a member of this Project"}, status=status.HTTP_400_BAD_REQUEST)
        elif project.status == "closed" or project.status == "completed":
            return Response({"message": "Project team is already full or project is completed"}, status=status.HTTP_400_BAD_REQUEST)
        
        existing_request = models.JoinRequest.objects.filter(project=project, applicant=request.user).first()

        if existing_request:
            if existing_request.status == "PENDING":
                return Response({"message": "Request is still pending."})
            else:
                existing_request.status = "PENDING"
                existing_request.save()
                return Response({"message": "Request sent again!"})

        data = request.data.copy()
        data["project"] = project.id
        serializer = proserializers.JoinRequestSerializer(data=data)
        if serializer.is_valid():
            serializer.save(applicant=request.user, project=project)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class RequestsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        requests = models.JoinRequest.objects.filter(applicant=request.user)
        return Response(proserializers.JoinRequestSerializer(requests, many=True).data)
    

class FindpartnerView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profiles = User.objects.exclude(id=request.user.id)

    
class SendInviteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = proserializers.SendInviteSerializer(data=request.data)
        if serializer.is_valid():
            user_id = serializer.validated_data["user_id"]
            project_id = serializer.validated_data["project_id"]
            msg = serializer.validated_data.get("message", "")
            reciever = get_object_or_404(User, pk= user_id)
            project = get_object_or_404(models.Project, pk=project_id)

            if project.leader != request.user:
                return Response({"message": "Only Leaders can invite"}, status=status.HTTP_400_BAD_REQUEST)
            
            if models.JoinRequest.objects.filter(project=project, applicant=reciever).exists():
                return Response({"message": "Already Invited"}, status=status.HTTP_400_BAD_REQUEST)
            
            models.JoinRequest.objects.create(project=project, applicant=reciever, request_type="INVITATION", status="PENDING", message=msg)
            return Response({"message": "Invitation Sent Successfully"}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserInvitationsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        invites = models.JoinRequest.objects.filter(applicant=request.user, request_type="INVITATION", status="PENDING")
        serializer = proserializers.InviteListSerializer(invites, many=True)
        return Response(serializer.data)
    
class ProjectSentInvitesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, project_id):
        project = get_object_or_404(models.Project, pk=project_id)
        if project.leader != request.user:
            return Response({"message": "Not your project"}, status=status.HTTP_403_FORBIDDEN)
        
        invitations = models.JoinRequest.objects.filter(project=project, request_type="INVITATION")
        serializer = proserializers.SentInviteListSerializer(invitations, many=True)
        return Response(serializer.data)\
        
class ManageInvitesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        join_request = get_object_or_404(models.JoinRequest, pk=pk)
        
        if join_request.applicant != request.user:
            return Response({"Forrbidden": "Not your invitation"}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = proserializers.RequestActionSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            action = serializer.validated_data["action"]

            if action == "accept":
                join_request.status = "ACCEPTED"
                join_request.save()
                join_request.project.members.add(join_request.applicant)
                return Response({"message": "User Accepted."})
            elif action == "reject":
                join_request.status = "REJECTED"
                join_request.save()
                return Response({"message": "Request Rejected."})
            
class RemoveMemberView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = proserializers.RemoveMemberSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            project_id = serializer.validated_data["project_id"]
            user_id = serializer.validated_data["user_id"]

            project = get_object_or_404(models.Project, pk=project_id)
            user = get_object_or_404(User, pk=user_id)
            #Only leader have access
            if project.leader != request.user:
                return Response({"Error": "Only leaders can remove members"}, status=status.HTTP_403_FORBIDDEN)
            
            if user == request.user:
                return Response({"Error": "Leader cannot remove himself"}, status=status.HTTP_400_BAD_REQUEST)
            
            if user not in project.members.all():
                return Response({"Error": "User is not a member of the team"}, status=status.HTTP_400_BAD_REQUEST)
            
            project.members.remove(user)
            models.JoinRequest.objects.filter(project=project, applicant=request.user).delete()
            return Response({"Success": "User has been removed from the team"})
        

class ExitTeamView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = proserializers.ExitTeamSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            project_id = serializer.validated_data['project_id']
            project = get_object_or_404(models.Project, pk=project_id)

            if project.leader == request.user:
                return Response(
                    {"error": "Owners cannot exit their own project. You must delete it or transfer ownership."},status=status.HTTP_400_BAD_REQUEST)

            if request.user not in project.members.all():
                return Response({"error": "You are not a member of this project."}, status=status.HTTP_400_BAD_REQUEST)

            project.members.remove(request.user)
            models.JoinRequest.objects.filter(project=project, applicant=request.user).delete()
            return Response({"message": "You have successfully left the team."})
        
class NotificationsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        notifications = models.Notifications.objects.filter(recipient=request.user)
        serializer = proserializers.NotificationsSerializer(notifications, many=True)
        return Response(serializer.data)

class NotificationReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        notification_id = request.data.get("id") # For a specific notification
        read_all = request.data.get("all") # to mark all notifications as read

        if notification_id:
            notification = get_object_or_404(models.Notifications, pk=notification_id, recipient=request.user)
            notification.is_read = True
            notification.save()
            return Response({"message": "notification has been read"})
        
        if read_all:
            models.Notifications.objects.filter(recipient=request.user, is_read=False).update(is_read=True)
            return Response({"message": "All notifications are marked as read"})
        
        return Response({"error": "Provide ID or all"}, status=status.HTTP_400_BAD_REQUEST)