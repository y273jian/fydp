"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from wms import views
from django.conf import settings
from django.conf.urls.static import static

router = routers.DefaultRouter()
router.register(r'cameras', views.CameraView, 'camera')
router.register(r'central_hubs', views.CentralHubView, 'central_hub')
router.register(r'images', views.ImageInfoView, 'image')
router.register(r'extracted_data', views.ExtractedDataView, 'extracted_data')
router.register(r'corrected_data', views.CorrectedDataView, 'corrected_data')
router.register(r'upload', views.UploadViewSet, 'upload')

urlpatterns = [
    path('admin/', admin.site.urls),    
    path('api/', include('wms.urls')),
    path('api/', include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
