from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import accountInfo
from .serializers import AccountInfoSerializer

class GetAll(APIView):
    def get(self, request):
        pass

class AccountQuery(APIView):
    def get(self, request):
        pass
    
    def post(self, request):
        # add
        pass
    
    def delete(self, request):
        pass

class GetAdmin(APIView):
    def get(self, request):
        # login with pw -> give token?
        pass
    
    def update(self, request):
        # change PW
        pass