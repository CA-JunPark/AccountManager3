from rest_framework import serializers
from .models import accountInfo

class AccountInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = accountInfo
        fields = '__all__' 
