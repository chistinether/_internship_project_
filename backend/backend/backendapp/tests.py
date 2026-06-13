from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Student, Supervisor

User = get_user_model()


class StudentModelTest(TestCase):

    def test_create_student(self):
        user = User.objects.create_user(
            username="jerry",
            password="test123"
        )

        student = Student.objects.create(
            user=user,
            registration_number="25/U/001",
            department="Computer Science",
            course="Bachelor of Information Technology",
            year_of_study=3,
            internship_place="ABC Technologies",
            supervisor_name="Esther Christine",
            supervisor_email="esther@example.com",
            phone_number="0769960848"
        )

        self.assertEqual(student.registration_number, "25/U/001")


class SupervisorModelTest(TestCase):

    def test_create_supervisor(self):
        user = User.objects.create_user(
            username="supervisor1",
            password="test123"
        )

        supervisor = Supervisor.objects.create(
            user=user,
            department="Computer Science"
        )

        self.assertEqual(supervisor.department, "Computer Science")
        self.assertEqual(supervisor.user.username, "supervisor1")



