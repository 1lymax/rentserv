from django.urls import path, include
from django_rest_passwordreset.views import reset_password_validate_token, reset_password_confirm, \
    reset_password_request_token

from user.views import MyObtainTokenPairView, RegisterView, ChangePasswordView
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

urlpatterns = [

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/', MyObtainTokenPairView.as_view(), name='token_obtain_pair'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('password-reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
    path("password-reset/validate-token/", reset_password_validate_token, name="reset-password-validate"),
    path("password-reset/confirm/", reset_password_confirm, name="reset-password-confirm"),
    path("password-reset/", reset_password_request_token, name="reset-password-request"),
]


