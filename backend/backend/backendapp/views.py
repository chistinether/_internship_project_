from rest_framework import viewsets
from .models import Student, Report, Feedback, Supervisor
from .serializers import StudentSerializer, ReportSerializer,FeedbackSerializer, SupervisorSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer

    def get_queryset(self):
        user = self.request.user

        if user.role == 'student':
            return Report.objects.filter(student__user=user)

        elif user.role in ['academic', 'workplace']:
            return Report.objects.filter(status='submitted')

        return Report.objects.none()

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class =FeedbackSerializer

class SupervisorViewSet(viewsets.ModelViewSet):
    queryset = Supervisor.objects.all()
    serializer_class = SupervisorSerializer
    
