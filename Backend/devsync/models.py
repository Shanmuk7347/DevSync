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
    skills_req = models.JSONField(default=list, blank=True, null=True)
    members = models.ManyToManyField(User, related_name="joined_projects", blank=True)
    status = models.CharField(max_length=25, choices=[("open", "Recruiting"), ("closed", "Team Full"), ("completed", "Project Completed")], default="open")
    LEVELS = [
        ("beginner", "Beginner"),
        ("intermediate", "Intermediate"),
        ("advanced", "Advanced")
    ]
    role = models.JSONField(default=list, blank=True, null=True)
    difficulty_level = models.CharField(choices=LEVELS, max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)

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
    request_type = models.CharField(choices=[("APPLICATION", "Applied"), ("INVITATION", "Invited")], default="APPLICATION", max_length=50)
    message = models.TextField(blank=True)
    class Meta:
        unique_together = ("project", "applicant")

from django.db import models
from django.conf import settings

class Notifications(models.Model):
    TYPES = [
        ("project_invite", "Project Invitation"),
        ("join_request", "Join Request"),
        ("request_accepted", "Request Accepted"),
        ("request_rejected", "Request Rejected"),
        ("general", "General Alert"),
    ]

    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_notifications', null=True, blank=True)
    notification_type = models.CharField(max_length=20, choices=TYPES)
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    target_id = models.IntegerField(null=True, blank=True) 
    class Meta:
        ordering = ['-created_at'] # Newest first

    def __str__(self):
        return f"To {self.recipient}: {self.message}"