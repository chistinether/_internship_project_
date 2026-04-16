from rest_framework import serializers
from backendapp.models import Student, Supervisor, Report, Feedback
from django.contrib.auth import get_user_model

User = get_user_model()

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

    class Meta:
        model = Supervisor
        fields = '__all__'

class ReportSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='student.user.get_full_name', read_only=True)

    class Meta:
        model = Report
        fields = '__all__'

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