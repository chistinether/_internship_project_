from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from .models import ProofOfWork, Student, Report, Feedback, Supervisor, Goal, DailyLog, Attendance, GoalFeedback
from .serializers import (
    UserSerializer,
    StudentSerializer,
    SupervisorSerializer,
    ReportSerializer,
    FeedbackSerializer,
    AttendanceSerializer,
    DailyLogSerializer,
    GoalSerializer,
    ProofOfWorkSerializer,
    GoalFeedbackSerializer  
)
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

from django.utils import timezone
from datetime import date

from django.contrib.auth.hashers import check_password




def home(request):
    return JsonResponse({"message": "Backend is working"})

User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    print("login view ")

    email = request.data.get('email')
    password = request.data.get('password')
    role = request.data.get('role')

    if not email or not password or not role:
        return Response(
            {"error": "All fields required"},
            status=400
        )

    try:
        user = User.objects.get(email=email)

    except User.DoesNotExist:
        return Response(
            {"error": "User not found"},
            status=404
        )

    user = authenticate(
        username=user.username,
        password=password
    )

    if user is None:
        return Response(
            {"error": "Invalid password"},
            status=401
        )

    if user.role != role:
        return Response(
            {
                "error": f"You are not registered as {role}"
            },
            status=403
        )

    refresh = RefreshToken.for_user(user)

    return Response({
    "access": str(refresh.access_token),
    "refresh": str(refresh),
    "role": user.role,
    "username": user.username,
    "email": user.email,
})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def check_in(request):
    try:
        student = Student.objects.get(user=request.user)
    except Student.DoesNotExist:
        return Response({"error": "Student profile not found"}, status=404)

    today = date.today()

    attendance, created = Attendance.objects.get_or_create(
        student=student,
        date=today
    )

    if attendance.check_in:
        return Response({"error": "Already checked in"}, status=400)

    attendance.check_in = timezone.now()
    attendance.save()

    return Response({"message": "Check-in successful"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def check_out(request):
    try:
        student = Student.objects.get(user=request.user)
    except Student.DoesNotExist:
        return Response({"error": "Student profile not found"}, status=404)

    today = date.today()

    try:
        attendance = Attendance.objects.get(student=student, date=today)
    except Attendance.DoesNotExist:
        return Response({"error": "No check-in found for today"}, status=400)

    if attendance.check_out:
        return Response({"error": "Already checked out"}, status=400)

    attendance.check_out = timezone.now()
    attendance.save()

    return Response({"message": "Check-out successful"})

@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def submit_goal_feedback(request):

    # GET all feedback for a goal
    if request.method == 'GET':

        goal_id = request.GET.get('goal_id')

        if not goal_id:
            return Response(
                {"error": "goal_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        feedbacks = GoalFeedback.objects.filter(goal_id=goal_id)

        serializer = GoalFeedbackSerializer(
            feedbacks,
            many=True
        )

        return Response(serializer.data)

    # POST feedback
    if request.method == 'POST':

        goal_id = request.data.get('goal')
        feedback_text = request.data.get('feedback')

        if not goal_id or not feedback_text:
            return Response(
                {"error": "goal and feedback are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            goal = Goal.objects.get(id=goal_id)

        except Goal.DoesNotExist:
            return Response(
                {"error": "Goal not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        feedback = GoalFeedback.objects.create(
            goal=goal,
            supervisor=request.user,
            feedback=feedback_text
        )

        serializer = GoalFeedbackSerializer(feedback)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )
@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def supervisor_goals(request):

    # GET all goals created by supervisor/admin
    if request.method == 'GET':

        goals = Goal.objects.filter(created_by=request.user)

        serializer = GoalSerializer(goals, many=True)

        return Response(serializer.data)

    # CREATE goal
    if request.method == 'POST':

        title = request.data.get('title')
        description = request.data.get('description')
        student_id = request.data.get('student')

        if not title or not description or not student_id:
            return Response(
                {
                    "error": "title, description and student are required"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            student = User.objects.get(id=student_id)

        except User.DoesNotExist:
            return Response(
                {"error": "Student not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        goal = Goal.objects.create(
            title=title,
            description=description,
            student=student,
            created_by=request.user
        )

        serializer = GoalSerializer(goal)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )    
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):

    old_password = request.data.get('old_password')

    new_password = request.data.get('new_password')

    if not old_password or not new_password:

        return Response(
            {"error": "Both passwords required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = request.user

    if not user.check_password(old_password):

        return Response(
            {"error": "Old password incorrect"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user.set_password(new_password)

    user.save()

    return Response({
        "message": "Password changed successfully"
    })
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):

    user = request.user

    username = request.data.get('username')
    email = request.data.get('email')

    if username:
        user.username = username

    if email:
        user.email = email

    user.save()

    return Response({
        "message": "Profile updated successfully",
        "username": user.username,
        "email": user.email
    })



    # if not email:

    #     return Response(
    #         {"error": "Email required"},
    #         status=status.HTTP_400_BAD_REQUEST
    #     )

    # try:
    #     user = User.objects.get(email=email)

    # except User.DoesNotExist:

    #     return Response(
    #         {"error": "User not found"},
    #         status=status.HTTP_404_NOT_FOUND
    #     )

    # code = str(random.randint(100000, 999999))

    # OTP.objects.create(
    #     user=user,
    #     code=code
    # )

    # send_mail(
    #     'Your OTP Code',
    #     f'Your OTP code is: {code}',
    #     'yourgmail@gmail.com',
    #     [email],
    #     fail_silently=False,
    # )

    return Response({
        "message": "OTP sent successfully"
    })
#@api_view(['POST'])
#def verify_otp(request):

    # email = request.data.get('email')

    # code = request.data.get('code')

    # if not email or not code:

    #     return Response(
    #         {"error": "Email and code required"},
    #         status=status.HTTP_400_BAD_REQUEST
    #     )

    # try:
    #     user = User.objects.get(email=email)

    # except User.DoesNotExist:

    #     return Response(
    #         {"error": "User not found"},
    #         status=status.HTTP_404_NOT_FOUND
    #     )

    # otp = OTP.objects.filter(
    #     user=user,
    #     code=code,
    #     is_verified=False
    # ).last()

    # if not otp:

    #     return Response(
    #         {"error": "Invalid OTP"},
    #         status=status.HTTP_400_BAD_REQUEST
    #     )

    # if otp.is_expired():

    #     return Response(
    #         {"error": "OTP expired"},
    #         status=status.HTTP_400_BAD_REQUEST
    #     )

    # otp.is_verified = True

    # otp.save()

    return Response({
        "message": "OTP verified successfully"
    })
#@api_view(['POST'])
#def forgot_password(request):

    # email = request.data.get('email')

    # code = request.data.get('code')

    # new_password = request.data.get('new_password')

    # if not email or not code or not new_password:

    #     return Response(
    #         {"error": "All fields required"},
    #         status=status.HTTP_400_BAD_REQUEST
    #     )

    # try:
    #     user = User.objects.get(email=email)

    # except User.DoesNotExist:

    #     return Response(
    #         {"error": "User not found"},
    #         status=status.HTTP_404_NOT_FOUND
    #     )

    # otp = OTP.objects.filter(
    #     user=user,
    #     code=code,
    #     is_verified=True
    # ).last()

    # if not otp:

    #     return Response(
    #         {"error": "OTP verification required"},
    #         status=status.HTTP_400_BAD_REQUEST
    #     )

    # if otp.is_expired():

    #     return Response(
    #         {"error": "OTP expired"},
    #         status=status.HTTP_400_BAD_REQUEST
    #     )

    # user.set_password(new_password)

    # user.save()

    return Response({
        "message": "Password reset successful"
    })
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")
        role = request.data.get("role")
        year_of_study = request.data.get("year_of_study")

        if not username or not password or not role:
            return Response({"error": "All fields required"}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=400)

        valid_roles = ["student", "academic", "workplace"]

        if role not in valid_roles:
            return Response({"error": "Invalid role"}, status=400)

        user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        role=role
        )

        # Automatically create related profile
        if role == "student":
            Student.objects.create(
                user=user,
                year_of_study=year_of_study
        )

        elif role in ["academic", "workplace"]:
            Supervisor.objects.create(
            user=user
        )   

        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "User registered successfully",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "role": user.role
        }, status=201)
    
class LogoutView(APIView):
    def post(self, request):
        return Response({"message": "Logout handled on frontend (JWT)"})

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            "username": user.username,
            "email": user.email,
            "role": user.role
        })

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        student = Student.objects.get(user=user)

        data = {
            "attendance_count": Attendance.objects.filter(student=student).count(),
            "daily_logs_count": DailyLog.objects.filter(student=student).count(),
            "goals_total": Goal.objects.filter(student=student).count(),
            "goals_completed": Goal.objects.filter(student=student, is_completed=True).count(),
            "reports_count": Report.objects.filter(student=student).count(),
            "proofs_count": ProofOfWork.objects.filter(student=student).count(),
        }

        return Response(data)
    
class SupervisorDashboardView(APIView):
    permission_classes = [IsAuthenticated]
    

    def get(self, request):
        user = request.user

        if user.role not in ["academic", "workplace"]:
            return Response({"error": "Not allowed"}, status=403)

        students = Student.objects.all()
        reports = Report.objects.all()

        data = {
            "total_students": students.count(),
            "total_reports": reports.count(),
            "pending_reports": reports.filter(status="pending").count(),
            "approved_reports": reports.filter(status="approved").count(),
            "rejected_reports": reports.filter(status="rejected").count(),
            "total_attendance": Attendance.objects.count(),
            "goals_assigned": Goal.objects.count(),
            "goals_completed": Goal.objects.filter(is_completed=True).count(),
        }

        return Response(data)
    
class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role != "academic":
            return Response({"error": "Not allowed"}, status=403)

        data = {
            "total_students": Student.objects.all().count(),
            "total_supervisors": Supervisor.objects.all().count(),
            "total_attendance_records": Attendance.objects.all().count(),
            "present_today": Attendance.objects.filter(check_in__isnull=False).count(),
            "absent_today": Attendance.objects.filter(check_in__isnull=True).count()
        }

        return Response(data)



#viewsets
User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class StudentViewSet(viewsets.ModelViewSet):
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]
    queryset = Student.objects.all()

    def get_queryset(self):
        user = self.request.user

        if user.role in ["academic", "workplace"]:
            return Student.objects.all()

        return Student.objects.filter(user=user)


class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == 'student':
            return Report.objects.filter(student__user=user)

        elif user.role in ['academic', 'workplace']:
            return Report.objects.filter(status='submitted')

        return Report.objects.none()

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]

class SupervisorViewSet(viewsets.ModelViewSet):
    queryset = Supervisor.objects.all()
    serializer_class = SupervisorSerializer
    permission_classes = [IsAuthenticated]      
class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Attendance.objects.filter(student__user=self)

    def perform_create(self, serializer):
        student = Student.objects.get(user=self.request.user)
        serializer.save(student=student)

class DailyLogViewSet(viewsets.ModelViewSet):
    queryset = DailyLog.objects.all()
    serializer_class = DailyLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DailyLog.objects.filter(student__user=self)

    def perform_create(self, serializer):
        student = Student.objects.get(user=self.request.user)
        serializer.save(student=student)

class GoalViewSet(viewsets.ModelViewSet):
    serializer_class = GoalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == "academic":
            return Goal.objects.filter(created_by=user)

        if user.role == "workplace":
            supervisor = Supervisor.objects.get(user=user)
            return Goal.objects.filter(supervisor=supervisor)

        if user.role == "student":
            student = Student.objects.get(user=user)
            return Goal.objects.filter(student=student)

        return Goal.objects.none()

    def perform_create(self, serializer):
        user = self.request.user

        if user.role != "academic":
            return

        serializer.save(created_by=user)
    

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Attendance.objects.filter(student__user=self.request.user)

    def perform_create(self, serializer):
        student = Student.objects.get(user=self.request.user)
        serializer.save(student=student)

class DailyLogViewSet(viewsets.ModelViewSet):
    queryset = DailyLog.objects.all()
    serializer_class = DailyLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DailyLog.objects.filter(student__user=self)

    def perform_create(self, serializer):
        student = Student.objects.get(user=self.request.user)
        serializer.save(student=student)

class GoalViewSet(viewsets.ModelViewSet):
    serializer_class = GoalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == "academic":
            return Goal.objects.filter(created_by=user)

        if user.role == "workplace":
            supervisor = Supervisor.objects.get(user=user)
            return Goal.objects.filter(supervisor=supervisor)

        if user.role == "student":
            student = Student.objects.get(user=user)
            return Goal.objects.filter(student=student)

        return Goal.objects.none()

    def perform_create(self, serializer):
        user = self.request.user

        if user.role != "academic":
            return

        serializer.save(created_by=user)
    
class ProofOfWorkViewSet(viewsets.ModelViewSet):
    queryset = ProofOfWork.objects.all()
    serializer_class = ProofOfWorkSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ProofOfWork.objects.filter(student__user=self)

    def perform_create(self, serializer):
        student = Student.objects.get(user=self.request.user)
        serializer.save(student=student)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_goal_to_supervisor(request, pk):
    goal = Goal.objects.get(id=pk)

    if request.user.role != "academic":
        return Response({"error": "Not allowed"}, status=403)

    supervisor_id = request.data.get("supervisor_id")
    supervisor = Supervisor.objects.get(id=supervisor_id)

    goal.supervisor = supervisor
    goal.status = "forwarded"
    goal.save()

    return Response({"message": "Goal sent to supervisor"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assign_goal_to_student(request, pk):
    goal = Goal.objects.get(id=pk)

    if request.user.role != "workplace":
        return Response({"error": "Not allowed"}, status=403)

    student_id = request.data.get("student_id")
    student = Student.objects.get(id=student_id)

    goal.student = student
    goal.status = "assigned"
    goal.save()

    return Response({"message": "Goal assigned to student"})

#@api_view(['POST'])
#def send_otp(request):
    # email = request.data.get('email')

    # user = User.objects.get(email=email)

    # code = str(random.randint(100000, 999999))

    # OTP.objects.create(user=user, code=code)

    # # For now: print instead of email
    # print("OTP:", code)

    # return Response({"message": "OTP sent"})


#@api_view(['POST'])
#def verify_otp(request):
    # email = request.data.get('email')
    # code = request.data.get('otp')

    # user = User.objects.get(email=email)

    # otp_obj = OTP.objects.filter(user=user, code=code, is_used=False).last()

    # if not otp_obj:
    #     return Response({"error": "Invalid OTP"}, status=400)

    # user.is_verified = True
    # user.save()

    # otp_obj.is_used = True
    # otp_obj.save()

    # return Response({"message": "Account verified"})
    
@api_view(['POST'])
def send_otp(request):
    email = request.data.get('email')

#@api_view(['POST'])
#def send_otp(request):
    # email = request.data.get('email')

    # user = User.objects.get(email=email)

    # code = str(random.randint(100000, 999999))

    # OTP.objects.create(user=user, code=code)

    # # For now: print instead of email
    # print("OTP:", code)

    # return Response({"message": "OTP sent"})


#@api_view(['POST'])
#def verify_otp(request):
    # email = request.data.get('email')
    # code = request.data.get('otp')

    # user = User.objects.get(email=email)

    # otp_obj = OTP.objects.filter(user=user, code=code, is_used=False).last()

    # if not otp_obj:
    #     return Response({"error": "Invalid OTP"}, status=400)

    return Response({"message": "Account verified"})
