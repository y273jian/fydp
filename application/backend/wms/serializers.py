from rest_framework import serializers
from .models import CameraInfo, CentralHub, ExtractedData, CorrectedData, RecordToCorrect

class CentralHubSerializer(serializers.ModelSerializer):
    class Meta:
        model = CentralHub
        fields = '__all__'

class CameraInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CameraInfo
        fields = ('camera_id', 'battery_level', 'setup_date', 'last_active_time')

class CameraInfoDetailSerializer(serializers.ModelSerializer):
    ch = CentralHubSerializer()
    class Meta:
        model = CameraInfo
        fields = '__all__'
# class RecordSerializer(serializers.ModelSerializer):
#     class Meta:
class ExtractedDataDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExtractedData
        fields = '__all__'

class RecordToCorrectSerializer(serializers.ModelSerializer):
    ed = ExtractedDataDetailSerializer()
    class Meta:
        model = RecordToCorrect
        fields = '__all__'

