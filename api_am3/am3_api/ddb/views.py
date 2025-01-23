from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import accountInfo
from .serializers import AccountInfoSerializer
from rest_framework.permissions import IsAuthenticated

class ChangePW(APIView):
    permission_classes = [IsAuthenticated]
    
    def put(self, request):
        pw = request.data.get('pw')
        newPw = request.data.get('newPw')
        confirm = request.data.get('confirm')

        result = "Fa"
        if newPw == confirm:
            result = "Tr"

        return Response(result)
    
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

