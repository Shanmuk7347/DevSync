from django.urls import path
from api.views.google_auth import GoogleLogin
from api.views import views
urlpatterns = [
    path("auth/google/", GoogleLogin.as_view()),
    path("profile/", views.ProfileView.as_view()),
    path("projects/", views.ProjectView.as_view()),
    path("projects/<int:pk>/", views.ProjectDetailedView.as_view())
]

