from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import (
    CameraInfo,
    CentralHub,
    ImageInfo,
    ExtractedData,
    CorrectedData,
    WildlifeTypes,
)

class CentralHubSerializer(serializers.ModelSerializer):
    class Meta:
        model = CentralHub
        fields = '__all__'

class CameraInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CameraInfo
        fields = ['camera_id', 'battery_level', 'latitude', 'longitude', 'setup_date', 'last_active_time']

class CameraInfoDetailSerializer(serializers.ModelSerializer):
    ch_info = CentralHubSerializer(read_only=True)
    class Meta:
        model = CameraInfo
        fields = '__all__'

class WildlifeTypesSerializer(serializers.ModelSerializer):
    class Meta:
        model = WildlifeTypes
        fields = '__all__'
class CorrectededDataDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = CorrectedData
        fields = '__all__'
    
    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['type'] = WildlifeTypesSerializer(instance.type).data
        return response

class ImageInfoDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageInfo
        fields = '__all__'

    def to_representation(self, instance):
        response = super().to_representation(instance)
        taken_camera = {
            'camera_id': CameraInfoDetailSerializer(instance.taken_camera).data['camera_id'],
            'latitude': CameraInfoDetailSerializer(instance.taken_camera).data['latitude'],
            'longitude': CameraInfoDetailSerializer(instance.taken_camera).data['longitude']
        }
        response['taken_camera'] = taken_camera
        return response


class ImageInfoOnlySerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageInfo
        fields = '__all__'

class ExtractedDataOnlySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExtractedData
        fields = '__all__'

class ExtractedDataDetailSerializer(serializers.ModelSerializer):
    corrected_data = CorrectededDataDetailSerializer(read_only=True)
    class Meta:
        model = ExtractedData
        fields = '__all__'

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['image'] = ImageInfoDetailSerializer(instance.image).data
        response['type'] = WildlifeTypesSerializer(instance.type).data
        if response['corrected_data'] is not None:
            response['corrected_data'] = response['corrected_data']['amount']
        return response

class UserSerializer(serializers.ModelSerializer):
    """
    Currently unused in preference of the below.
    """
    email = serializers.EmailField(
        required=True
    )
    username = serializers.CharField()
    password = serializers.CharField(min_length=8, write_only=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)  # as long as the fields are the same, we can just use this
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

# Serializers define the API representation.
class UploadSerializer(serializers.Serializer):
    files_uploaded = serializers.ListField(child = serializers.FileField())
    class Meta:
        fields = ['files_uploaded']