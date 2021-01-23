from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from .views import (
    ObtainTokenPairView, 
    UserCreate, 
    LogoutAndBlacklistRefreshTokenForUserView, 
    AddExtractedDataView,
    AddImageInfoView,
)

urlpatterns = [
    path('user/create/', UserCreate.as_view(), name="create_user"),
    path('token/obtain/', ObtainTokenPairView.as_view(), name='token_create'),  # override sjwt stock token
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('blacklist/', LogoutAndBlacklistRefreshTokenForUserView.as_view(), name='blacklist'),
    path('server/add_extracted_data', AddExtractedDataView.as_view(), name='add_extracted_data'),
    path('server/add_image_info', AddImageInfoView.as_view(), name='add_image_info'),
]
