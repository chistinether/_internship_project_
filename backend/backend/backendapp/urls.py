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
    login_view,
    RegisterView,
    CurrentUserView,
    SupervisorDashboardView,
    AdminDashboardView,
    send_goal_to_supervisor,
    assign_goal_to_student, 
    check_in,
    check_out,
)

router = DefaultRouter()

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

    # DASHBOARD
    path('dashboard/supervisor/', SupervisorDashboardView.as_view()),
    path('dashboard/admin/', AdminDashboardView.as_view()),

    # GOALS
    path('goals/<int:pk>/send-to-supervisor/', send_goal_to_supervisor),
    path('goals/<int:pk>/assign-to-student/', assign_goal_to_student),

    # ATTENDANCE (CUSTOM ENDPOINTS)
    path('attendance/check-in/', check_in),
    path('attendance/check-out/', check_out),
]