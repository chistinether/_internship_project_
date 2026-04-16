"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
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
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from backendapp.views import StudentViewSet, ReportViewSet, FeedbackViewSet, SupervisorViewSet


router = DefaultRouter()

router = DefaultRouter()
router.register(r'students', StudentViewSet)
router.register(r'reports', ReportViewSet)
router.register(r'feedback', FeedbackViewSet)
router.register(r'supervisors', SupervisorViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
