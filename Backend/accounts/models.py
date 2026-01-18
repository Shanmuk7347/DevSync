from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class CustomUser(AbstractUser):
    
    email = models.EmailField(unique=True)
    bio = models.CharField(blank=True,null=True, max_length=255 ,help_text="Add something about yourself")
    skills = models.JSONField(default=list)
    LEVELS = [
        ("beginner", "Beginner"),
        ("intermediate", "Intermediate"),
        ("advanced", "Advanced")
    ]
    experience = models.CharField(max_length=25, choices=LEVELS, default="beginner")
    role = models.CharField(max_length=50, null=True, blank=True, default="")
    
    def __str__(self):
        return self.username