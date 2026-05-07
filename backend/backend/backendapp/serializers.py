from rest_framework import serializers
from backendapp.models import User, Student, Supervisor, Report, Feedback, Attendance, DailyLog, Goal, ProofOfWork
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class StudentSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = Student
        fields = '__all__'

    def validate_name(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("Name too short")
        return value
    
    def validate(self, data):
        user = data.get("user")

        if Student.objects.filter(user=user).exists():
            raise serializers.ValidationError("Student already exists")

        return data

class SupervisorSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Supervisor
        fields = [
            'id',
            'user',
            'department',
            'full_name',
            'email'
        ]
        read_only_fields = ['full_name', 'email']

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'
        read_only_fields = ['student', 'submission_date']

    def validate_file(self, value):
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("File too large (max 5MB)")
        return value
    
    def validate_status(self, value):
        valid = ["pending", "approved", "rejected"]

        if value not in valid:
            raise serializers.ValidationError("Invalid status")

        return value

class FeedbackSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='supervisor.user.get_full_name', read_only=True)

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
    class Meta:
        model = Goal
        fields = '__all__'

class ProofOfWorkSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProofOfWork
        fields = '__all__'
        read_only_fields = ['student']