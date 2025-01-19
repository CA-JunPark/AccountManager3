from django.urls import path

from .views import *

urlpatterns = [
    path("getAll/", GetAll.as_view(), name='getAll'),
    path("account/", AccountQuery.as_view(), name='account'),
    path("getAdmin/", GetAdmin.as_view(), name='getAdmin')
]
