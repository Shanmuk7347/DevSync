from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from api.serializers.accounts import ChangePasswordSerializer

class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            if not user.check_password(serializer.data.get("old_password")):
                return Response({"message": "Old Passwod is Wrong"}, status=status.HTTP_400_BAD_REQUEST)
            
            new_password1 = serializer.data.get("new_password1")
            new_password2 = serializer.data.get("new_password2")
            if new_password1 != new_password2:
                return Response({"message": "Passwords don't match"}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.data.get("new_password1"))
            user.save()
            return Response({"Success": "Password changed Successfully"}, status=status.HTTP_200_OK)
        
        return Response({"message": "Bad Request"}, status=status.HTTP_400_BAD_REQUEST)
