from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import accountInfo
from .serializers import AccountInfoSerializer

class Login(APIView):
    def post(self, request):
        password = request.data.get('pw')
        print(password)
        return Response(f"got: {password}" )
        
    def update(self, request):
        # change PW
        pass
    
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

