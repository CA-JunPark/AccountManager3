from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import accountInfo
from .serializers import AccountInfoSerializer
from rest_framework.permissions import IsAuthenticated

class Login(APIView):
    def post(self, request):
        password = request.data.get('pw')
        print("given pw: ", password)
        return Response(f"got: {password}" )

class ChangePW(APIView):
    permission_classes = [IsAuthenticated]
    def update(self, request):
        # change PW
        pass
    
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

