from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from .models import Student, Report, Feedback, Supervisor
from .serializers import StudentSerializer, ReportSerializer,FeedbackSerializer, SupervisorSerializer
from rest_framework.permissions import IsAuthenticated

User = get_user_model()

class RegisterView(APIView):
    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")
        role = request.data.get("role")

        if not username or not password:
            return Response(
                {"error": "Username and password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if email and "@" not in email:
            return Response({"error": "Invalid email"})
        
        if len(password) < 6:
            return Response({"error": "Password too short"}) 

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"})       

        valid_roles = ["student", "supervisor"]

        if role not in valid_roles:
            return Response({"error": "Invalid role"})
        
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            role=role
        )

        token, created = Token.objects.get_or_create(user=user)

        return Response({
            "message": "User registered successfully",
            "token": token.key,
            "role": user.role
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if user is not None:
            token, created = Token.objects.get_or_create(user=user)

            return Response({
                "message": "Login successful",
                "token": token.key,
                "role": user.role
            }, status=status.HTTP_200_OK)

        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )

class LogoutView(APIView):
    def post(self, request):
        try:
            request.user.auth_token.delete()
            return Response({"message": "Logged out successfully"})
        except:
            return Response({"error": "Something went wrong"}, status=400)

class CurrentUserView(APIView):
    def get(self, request):
        user = request.user

        return Response({
            "username": user.username,
            "email": user.email,
            "role": user.role
        })
    



#viewsets
User = get_user_model()

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]


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
    
