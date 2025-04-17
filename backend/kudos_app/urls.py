from django.urls import path
# from rest_framework_simplejwt.views import (
#     TokenObtainPairView,
#     TokenRefreshView,
# )

from .views import get_user, create_user, login_user, \
    create_kudos, kudos_filter_by_week, get_kudos_left, list_users_in_org, \
    CustomLoginView

urlpatterns = [
    path("users/", get_user, name="get_user"),
    path("user/create/", create_user, name="create_user"),
    path("user/login", login_user, name="login_user"),
    path("kudos/create", create_kudos, name="create_kudos"),
    path("kudos/received/", kudos_filter_by_week, name="kudos_filter_by_week"),
    path("kudos/quota/", get_kudos_left, name="get_kudos_left"),
    path("kudos/list_user_in_org/", list_users_in_org, name="list_users_in_org"),
    
    path('token/', CustomLoginView.as_view(), name='token_obtain_pair'),
    # # path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
