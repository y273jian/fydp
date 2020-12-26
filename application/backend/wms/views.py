from django.shortcuts import render

from rest_framework import viewsets
from .serializers import (
    CameraInfoSerializer,
    CameraInfoDetailSerializer,
    CentralHubSerializer,
    RecordToCorrectSerializer,
)
from .models import (
    CameraInfo, 
    CentralHub, 
    RecordToCorrect,
    
)
from .mixins import GetSerializerClassMixin

class CameraView(GetSerializerClassMixin, viewsets.ModelViewSet):
    serializer_class = CameraInfoDetailSerializer
    serializer_action_classes = {
        'list': CameraInfoSerializer,
    }
    ordering = ('-setup_date')
    queryset = CameraInfo.objects.all()

class CentralHubView(viewsets.ModelViewSet):
    serializer_class = CentralHubSerializer
    queryset = CentralHub.objects.all()

class RecordToCorrectView(viewsets.ModelViewSet):
    serializer_class = RecordToCorrectSerializer
    queryset = RecordToCorrect.objects.all()
