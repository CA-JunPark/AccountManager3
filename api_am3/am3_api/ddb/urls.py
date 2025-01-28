from django.urls import path

from .views import *

urlpatterns = [
    path("getAll/", GetAll.as_view(), name='getAll'),
    path("account/", AccountQuery.as_view(), name='account'),
    path("changePW/", ChangePW.as_view(), name='changePw'),
    path("deleteAccount/<int:id>/", DeleteAccount.as_view(), name="deleteAccount")
]
