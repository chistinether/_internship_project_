from django.db import models
from django.contrib.auth.models import User

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    registration_number = models.CharField(max_length=20, unique=True)
    department = models.CharField(max_length=100)
    course = models.CharField(max_length=100)
    year_of_study = models.IntegerField()
    internship_place = models.CharField(max_length=255)
    supervisor_name = models.CharField(max_length=100)
    supervisor_email = models.EmailField()
    phone_number = models.CharField(max_length=20)
    date_joined = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.get_full_name()} ({self.registration_number})"

class Supervisor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    department = models.CharField(max_length=255)

    def __str__(self):
        return self.user.get_full_name()

class Report(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    week_number = models.IntegerField()
    content = models.TextField()
    submission_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Week {self.week_number} - {self.student}"

class Feedback(models.Model):
    report = models.OneToOneField(Report, on_delete=models.CASCADE)
    supervisor = models.ForeignKey(Supervisor, on_delete=models.CASCADE)
    comments = models.TextField()
    date_given = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Feedback for {self.report}"
