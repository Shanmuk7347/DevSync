from django.contrib import admin
from .models import Project, JoinRequest, Notifications
# Register your models here.

admin.site.register(Project)
admin.site.register(JoinRequest)
admin.site.register(Notifications)