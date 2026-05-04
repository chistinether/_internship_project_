from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    StudentViewSet,
    SupervisorViewSet,
    FeedbackViewSet,
    ReportViewSet,

)
from .views import login_view

router = DefaultRouter()


router.register(r'users', UserViewSet)
router.register(r'students', StudentViewSet)
router.register(r'supervisors', SupervisorViewSet)
router.register(r'feedback', FeedbackViewSet)
router.register(r'reports', ReportViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', login_view, name='login'),
]