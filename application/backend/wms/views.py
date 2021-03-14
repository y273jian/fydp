from datetime import datetime
import json
import pytz
from django.utils.timezone import make_aware, is_aware
from django.shortcuts import render
from django.db.models.signals import post_save
from django.core.mail import send_mail
from django.core.files.storage import default_storage
from django.core.files.images import get_image_dimensions
from django.template.defaultfilters import pluralize
from django.conf import settings
from rest_framework import viewsets, status, permissions
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import FileUploadParser, MultiPartParser

from .serializers import (
    CameraInfoSerializer,
    CameraInfoDetailSerializer,
    CentralHubSerializer,
    ImageInfoDetailSerializer,
    ImageInfoOnlySerializer,
    ExtractedDataDetailSerializer,
    ExtractedDataOnlySerializer,
    CorrectededDataDetailSerializer,
    UserSerializer,
    # UploadSerializer,
)
from .models import (
    CameraInfo,
    CentralHub,
    ImageInfo,
    ExtractedData,
    CorrectedData,
)
from .mixins import GetSerializerClassMixin

class CameraView(GetSerializerClassMixin, viewsets.ModelViewSet):
    serializer_class = CameraInfoDetailSerializer
    serializer_action_classes = {
        'list': CameraInfoSerializer,
    }
    queryset = CameraInfo.objects.all().order_by('-last_active_time')

class CentralHubView(viewsets.ModelViewSet):
    serializer_class = CentralHubSerializer
    queryset = CentralHub.objects.all()

class ExtractedDataView(viewsets.ReadOnlyModelViewSet):
    serializer_class = ExtractedDataDetailSerializer
    permission_classes = (permissions.AllowAny,)

    # print(request)
    queryset = ExtractedData.objects.all().order_by('-image__taken_time')
    # permission_classes = [permissions.IsAuthenticated,]

    def list(self, request):
        date = request.GET.get('date', None)
        camera = request.GET.get('camera', None)
        type = request.GET.get('type', None)
        # print('params', date, camera, type)
        queryset = self.get_queryset()
        if date is not None:
            queryset = queryset.filter(image__taken_time__date=datetime.strptime(date, '%Y-%m-%d'))
        if camera is not None:
            queryset = queryset.filter(image__taken_camera__camera_id=camera)
        if type is not None:
            queryset = queryset.filter(type__name=type)

        serializer = ExtractedDataDetailSerializer(queryset, many=True)
        return Response(serializer.data)
        

class CorrectedDataView(viewsets.ModelViewSet):
    serializer_class = CorrectededDataDetailSerializer
    queryset = CorrectedData.objects.all()

class ImageInfoView(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    serializer_class = ImageInfoDetailSerializer
    queryset = ImageInfo.objects.all()

class ObtainTokenPairView(TokenObtainPairView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = TokenObtainPairSerializer

class UserCreate(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                return Response(json, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutAndBlacklistRefreshTokenForUserView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            print('e', e.args)
            return Response(data=e.args, status=status.HTTP_400_BAD_REQUEST)

def send_notification(sender, created, **kwargs):
    if created:
        obj = kwargs['instance']
        type = obj.type.name
        amount = obj.amount
        camera_id = 'no camera info'
        if obj.image is not None:
            camera_id = obj.image.taken_camera.camera_id
        message = 'WMS detected ' + str(amount) + ' new ' + type + \
            ' captured by Camera(' + str(camera_id) + '). \n' + \
            'Click this link or login to WMS to see details: localhost:3000/records'
        result = send_mail(
            'New Sightings!',
            message,
            settings.EMAIL_HOST_USER,
            ['aliceuw0507@gmail.com'],
            fail_silently=False
        )
        print('send_mail result: ', result)

post_save.connect(send_notification, sender=ExtractedData)

class AddExtractedDataView(CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    serializer_class = ExtractedDataOnlySerializer

class AddImageInfoView(CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    serializer_class = ImageInfoOnlySerializer

class UploadExtDataViewSet(viewsets.ViewSet):
    permission_classes = (permissions.AllowAny,)
    parser_classes = [MultiPartParser]

    def create(self, request):
        ext_data = request.FILES.get('data')
        


class ChUploadViewSet(viewsets.ViewSet):
    permission_classes = (permissions.AllowAny,)
    parser_classes = [MultiPartParser]
    # serializer_class = UploadSerializer
    camera_id = ''
    image_id = ''
    last_active_time = ''

    def parse_log(self, f):
        # parse log file
        
        file_content = json.loads(f.read())
        file_name = f.name.split('.')[0]
        camera_info = file_content['Trail Camera']

        serial_num = str(camera_info['Camera ID'])

        latitude = str(camera_info['Position']['Latitude (degrees)'])
        latitude = float(latitude[:len(latitude)-7] + '.' + latitude[len(latitude)-7:])

        longitude = str(camera_info['Position']['Longitude (degrees)'])
        longitude = float(longitude[:len(longitude)-7] + '.' + longitude[len(longitude)-7:])

        altitude = str(camera_info['Position']['Altitude'])
        altitude = float(altitude[:len(altitude)-3] + '.' + altitude[len(altitude)-3:])

        last_active_time = make_aware(datetime(camera_info['Date']['Year'], camera_info['Date']['Month'], camera_info['Date']['Day'], \
            camera_info['Time']['Hour'], camera_info['Time']['Minute'], camera_info['Time']['Second']))
        
        with_image = camera_info['Battery Enable']
        
        battery_level = camera_info['Battery Level (%)']

        lo_ra = camera_info['Lora']

        bandwidth = camera_info['Bandwidth']

        bps = camera_info['BPS']

        freq_deviation = camera_info['Frequency Deviation']

        tx_power = camera_info['TX Power']

        ch_id = file_content['Central Hub']['Central Hub ID']

        ch = None
        try:
            ch = CentralHub.objects.get(ch_serial=ch_id)
        except (CentralHub.DoesNotExist):
            # ch not exist, create a new one
            ch = CentralHub(ch_serial=ch_id)
            ch.save()
        camera = None
        try:
            camera = CameraInfo.objects.get(serial_number=serial_num)
        except (CameraInfo.DoesNotExist):
            # camera not exist, create a new one
            new_camera = CameraInfo(ch=ch,serial_number=serial_num,latitude=latitude,longitude=longitude,altitude=altitude,\
                battery_level=battery_level, is_long_range=lo_ra,bandwidth=bandwidth,bit_rate=bps,\
                    freq_deviation=freq_deviation,transmit_power=tx_power,last_active_time=last_active_time)
            new_camera.save()
            camera = new_camera
            camera_id = camera.camera_id
        else:
            # camera exist, update the data
            camera.battery_level = battery_level
            camera.bit_rate = bps
            camera.freq_deviation = freq_deviation
            camera.transmit_power = tx_power
            camera.last_active_time = last_active_time
            print(is_aware(camera.last_active_time))
            camera.save()
            camera_id = camera.camera_id

        default_storage.save('log/'+str(camera.camera_id)+'/'+f.name, f)
        self.camera_id = camera_id
        self.last_active_time = last_active_time
        return with_image

    def save_image(self, f):
        # save image
        width, height = get_image_dimensions(f)
        print ('width', width, 'height', height)
        default_storage.save('ori_images/'+str(self.camera_id)+'/'+f.name, f)
        file_url = default_storage.url('ori_images/'+str(self.camera_id)+'/'+f.name)
        camera = CameraInfo.objects.get(camera_id=self.camera_id)
        image = ImageInfo(ori_file_path=file_url, size=f.size, width=width, height=height, taken_camera=camera,\
                        taken_time=self.last_active_time)
        image.save()
        print(image.image_id)
        self.image_id = image.image_id

    def create(self, request):

        log = request.FILES.get('log')
        
        if log == '':
            return HttpResponseForbidden()

        with_image = self.parse_log(log)

        if with_image:
            image = request.FILES.get('image')
            self.save_image(image)

        return Response({'detail': 'Success', 'camera_id': self.camera_id, 'image_id': self.image_id})
