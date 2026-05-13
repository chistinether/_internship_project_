from rest_framework import serializers
from backendapp.models import User, Student, Supervisor, Report, Feedback, Attendance, DailyLog, Goal, ProofOfWork, GoalFeedback
from django.contrib.auth import get_user_model

User = get_user_model()

class StudentSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = Student
        fields = '__all__'

class SupervisorSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = Supervisor
        fields = '__all__'

class ReportSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = Report
        fields = '__all__'

class FeedbackSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = Feedback
        fields = '__all__'

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'
        read_only_fields = ['student', 'date']

class DailyLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyLog
        fields = '__all__'
        read_only_fields = ['student']

class GoalSerializer(serializers.ModelSerializer):

    student_name = serializers.CharField(
        source='student.username',
        read_only=True
    )

    created_by_name = serializers.CharField(
        source='created_by.username',
        read_only=True
    )

    class Meta:
        model = Goal

        fields = [
            'id',
            'title',
            'description',
            'student',
            'student_name',
            'created_by',
            'created_by_name',
            'status',
            'created_at'
        ]

        read_only_fields = [
            'created_by',
            'created_at'
        ]

class ProofOfWorkSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProofOfWork
        fields = '__all__'
        read_only_fields = ['student']

class GoalFeedbackSerializer(serializers.ModelSerializer):
    supervisor_name = serializers.CharField(
        source='supervisor.username',
        read_only=True
    )

    class Meta:
        model = GoalFeedback
        fields = [
            'id',
            'goal',
            'supervisor',
            'supervisor_name',
            'feedback',
            'created_at'
        ]

        read_only_fields = [
            'supervisor',
            'created_at'
        ]
