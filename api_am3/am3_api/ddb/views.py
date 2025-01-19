from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import accountInfo
from .serializers import AccountInfoSerializer

class AccountInfoList(APIView):
    def get(self, request):
        accounts = accountInfo.objects.all()
        serializer = AccountInfoSerializer(accounts, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = AccountInfoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request):
        return Response()