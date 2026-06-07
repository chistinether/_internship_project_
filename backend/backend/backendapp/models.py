from django.db import models
from django.contrib.auth.models import AbstractUser
#from datetime import timedelta, timezone

class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('academic', 'Academic Supervisor'),
        ('workplace', 'Workplace Supervisor'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    email = models.EmailField(unique=True)
    #is_verified = models.BooleanField(default=False)

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
        return f"{self.user.get_full_name() or self.user.username} ({self.registration_number})"


class Supervisor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    department = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} - {self.department}"

class Report(models.Model):
    STATUS_CHOICES = (
        ("draft", "Draft"),
        ("submitted", "Submitted"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        ("refused", "Refused")
    )

    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    week_number = models.IntegerField()
    content = models.TextField()

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')

    submission_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student}- ({self.status})"

class Feedback(models.Model):
    report = models.ForeignKey(Report, on_delete=models.CASCADE)
    supervisor = models.ForeignKey(Supervisor, on_delete=models.CASCADE)

    comments = models.TextField()
    date_given = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback by {self.supervisor}"

class Attendance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    check_in = models.TimeField()
    check_out = models.TimeField(null=True, blank=True)

    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.student} - {self.date}"

class DailyLog(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    content = models.TextField()
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.student} - {self.date}"

class Goal(models.Model):
    GOAL_TYPE = (
        ("daily", "Daily Goal"),
        ("weekly", "Weekly Goal"),
    )
    STATUS = (
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        ("completed", "Completed"),
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    goal_type = models.CharField(
    max_length=10,
    choices=GOAL_TYPE,
    null=True,
    blank=True
)

    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
     # admin (academic)

    supervisor = models.ForeignKey(
        Supervisor,
        on_delete=models.CASCADE,
        related_name="received_goals",
        null=True,
        blank=True
    )  # workplace supervisor

    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="goals",
        null=True,
        blank=True
    )

    status = models.CharField(max_length=20, choices=STATUS, default="pending")

    is_completed = models.BooleanField(default=False)

    date_created = models.DateTimeField(null=True, blank=True)

class ProofOfWork(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='proofs/')
    description = models.TextField()

    uploaded_at = models.DateTimeField(auto_now_add=True)




#class OTP(models.Model):

 #   user = models.ForeignKey(
  #      User,
   #     on_delete=models.CASCADE
    #)

    #code = models.CharField(max_length=6)

    #created_at = models.DateTimeField(auto_now_add=True)

    #is_verified = models.BooleanField(default=False)

   # def is_expired(self):
    #    return timezone.now() > self.created_at + timedelta(minutes=10)

    #def __str__(self):
     #   return f"{self.user.username} - {self.code}"


class GoalFeedback(models.Model):
    goal = models.ForeignKey(
        'Goal',
        on_delete=models.CASCADE,
        related_name='feedbacks'
    )

    supervisor = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    feedback = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    is_used = models.BooleanField(default=False)


    def __str__(self):
        return f"{self.supervisor} - {self.feedback}"
