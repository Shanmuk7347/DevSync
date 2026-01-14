from rest_framework.views import APIView, Response
from rest_framework import status, permissions
from api.serializers import ProfileSerializer, ProjectSerializer
from devsync import models
from django.shortcuts import get_object_or_404

#Custom permission class to ensure only leader can edit or delete projects
class IsLeaderOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.leader == request.user

#profile Details
class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request):
        return Response(ProfileSerializer(request.user).data)
    
    def put(self, request):
        serializer = ProfileSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

#Projects List and Addition
class ProjectView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    def get(self, request):
        projects = models.Project.objects.all()
        serializer = ProjectSerializer(projects, many=True, context = {"request": request})
        return Response(serializer.data)
    def post(self, request):
        serializer = ProjectSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(leader=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#For editing and deleting any created projects
class ProjectDetailedView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsLeaderOrReadOnly]
    def get_project(self, pk):
        project = get_object_or_404(models.Project, pk=pk)
        self.check_object_permissions(self.request, project)
        return project
    
    def get(self, request, pk):
        project = self.get_project(pk)
        serializer = ProjectSerializer(project, context={"request": request})
        return Response(serializer.data)
    
    def put(self, request, pk):
        project = self.get_project(pk)
        serializer = ProjectSerializer(project, data=request.data, partial=True, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, reqeust, pk):
        project = self.get_project(pk)
        project.delete()
        return Response({"message": "Project deleted Succesfully"}, status=status.HTTP_204_NO_CONTENT)

    
