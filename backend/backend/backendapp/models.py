from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('academic', 'Academic Supervisor'),
        ('workplace', 'Workplace Supervisor'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    registration_number = models.CharField(max_length=20, unique=True, primary_key=True)
    department = models.CharField(max_length=100)
    course = models.CharField(max_length=100)
    year_of_study = models.IntegerField()
    internship_place = models.CharField(max_length=255)
    supervisor_name = models.CharField(max_length=100, blank=False)
    supervisor_email = models.EmailField()
    phone_number = models.CharField(max_length=20)
    date_joined = models.DateField(auto_now_add=True)
    def __str__(self):
        return f"{self.user}- ({self.registration_number})"
    


class Supervisor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    department = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.user}- ({self.department})"

class Report(models.Model):
    STATUS = (
    ("pending", "Pending"),
    ("approved", "Approved"),
    ("rejected", "Rejected"),

    )
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    week_number = models.IntegerField()
    content = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS, default='draft')
    submission_date = models.DateField(auto_now_add=True)



class Feedback(models.Model):
    report = models.OneToOneField(Report, on_delete=models.CASCADE)
    supervisor = models.ForeignKey(Supervisor, on_delete=models.CASCADE)
    comments = models.TextField()
    date_given = models.DateField(auto_now_add=True)




