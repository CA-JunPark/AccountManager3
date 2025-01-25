from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import accountInfo
from .serializers import AccountInfoSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework import status

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated

class ChangePW(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        try:
            user = User.objects.get(username='JP')
        except User.DoesNotExist:
            return Response({"detail": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)

        pw = request.data.get('pw')
        newPw = request.data.get('newPw')
        confirm = request.data.get('confirm')

        if user.check_password(pw):
            if not newPw:
                return Response({"detail": "Password cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)
            if not confirm:
                return Response({"detail": "Password cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)
            if newPw != confirm:
                return Response({"detail": "New passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(newPw)
            user.save()
            return Response({"detail": "Password changed successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Current password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

class GetAll(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response("Get All")

class AccountQuery(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        pass
    
    def post(self, request):
        # add
        pass
    
    def delete(self, request):
        pass

