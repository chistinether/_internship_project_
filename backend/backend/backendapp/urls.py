from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    StudentViewSet,
    SupervisorViewSet,
    ReportViewSet,
    FeedbackViewSet,
    AttendanceViewSet,
    DailyLogViewSet,
    GoalViewSet,
    ProofOfWorkViewSet,
    UserViewSet,
    change_password,
    update_profile,
    login_view,
    RegisterView,
    CurrentUserView,
    SupervisorDashboardView,
    AdminDashboardView,
    send_goal_to_supervisor,
    assign_goal_to_student, 
    check_in,
    check_out,
    submit_goal_feedback,
    supervisor_goals,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [

]

router = DefaultRouter()
router.register(r'attendance', AttendanceViewSet)
router.register(r'daily-logs', DailyLogViewSet)
router.register(r'goals', GoalViewSet, basename='goal')
router.register(r'proofs', ProofOfWorkViewSet)
router.register(r'users', UserViewSet)
router.register(r'students', StudentViewSet)
router.register(r'supervisors', SupervisorViewSet)
router.register(r'feedback', FeedbackViewSet)
router.register(r'reports', ReportViewSet)

urlpatterns = [
    path('', include(router.urls)),

    # AUTH
    path('login/', login_view, name='login'),
    path('auth/register/', RegisterView.as_view()),
    path('auth/me/', CurrentUserView.as_view()),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # DASHBOARD
    path('dashboard/supervisor/', SupervisorDashboardView.as_view()),
    path('dashboard/admin/', AdminDashboardView.as_view()),

    # GOALS
    path('goals/<int:pk>/send-to-supervisor/', send_goal_to_supervisor),
    path('goals/<int:pk>/assign-to-student/', assign_goal_to_student),
    path('goals/feedback/', submit_goal_feedback),
    path('supervisor/goals/', supervisor_goals),

    # OTP
    #path('otp/send/', send_otp),
    #path('otp/verify/', verify_otp),
    #path('otp/forgot/', forgot_password),
    path('auth/change-password/', change_password),
    path('auth/update-profile/', update_profile),


    # ATTENDANCE (CUSTOM ENDPOINTS)
    path('attendance/check-in/', check_in),
    path('attendance/check-out/', check_out),
]