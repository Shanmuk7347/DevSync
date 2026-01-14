from django.db import models
from django.conf import settings

# Create your models here.
User = settings.AUTH_USER_MODEL

class Project(models.Model):
    TYPES = [
        ("solo", "Solo"),
        ("team", "Team"),
        ("opensource", "Open Source")
    ]
    title = models.CharField(max_length=255)
    description = models.TextField()
    project_type = models.CharField(choices=TYPES,max_length=100 ,default="team")
    leader = models.ForeignKey(User, on_delete=models.CASCADE, related_name="leader")
    skills_req = models.JSONField(default=list)
    members = models.ManyToManyField(User, related_name="joined_projects", blank=True)
    status = models.CharField(max_length=25, choices=[("open", "Recruiting"), ("closed", "Team Full"), ("completed", "Project Completed")], default="open")
    LEVELS = [
        ("beginner", "Beginner"),
        ("intermediate", "Intermediate"),
        ("advanced", "Advanced")
    ]
    difficulty_level = models.CharField(choices=LEVELS, max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
class JoinRequest(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="requests")
    applicant = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=20, 
        choices=[('PENDING', 'Pending'), ('ACCEPTED', 'Accepted'), ('REJECTED', 'Rejected')],
        default='PENDING'
    )
    message = models.TextField(blank=True)

    class Meta:
        unique_together = ("project", "applicant")

class Notifications(models.Model):
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, null=True, blank=True)
    def __str__(self):
        return f"To {self.receiver.username}: {self.message}"

class Chat(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_messages")
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.sender} - {self.project.title}"