from django.urls import path, include
from api.views.google_auth import GoogleLogin
from api.views import views, auth
from api.agents import generateproject, opensearch

urlpatterns = [
    path("auth/google/", GoogleLogin.as_view()),
    path("profile/", views.ProfileView.as_view()),
    path("findpartner/", views.ProfilesView.as_view()),
    path("ownprojects/", views.OwnProjectsView.as_view()),
    path("myprojects/", views.MyProjectsView.as_view()),
    path("projects/", views.ProjectView.as_view()),
    path("projects/<int:pk>/", views.ProjectDetailedView.as_view()), 
    path("projects/<int:project_id>/requests", views.ProjectRequestView.as_view()),
    path('invites/send/', views.SendInviteView.as_view()),
    path('invites/received/', views.UserInvitationsView.as_view()),
    path('invites/projects/<int:project_id>/', views.ProjectSentInvitesView.as_view()),
    path('invites/<int:pk>/manage/', views.ManageInvitesView.as_view()),
    path("requests/", views.RequestsView.as_view()),
    path("requests/<int:pk>/manage", views.ManageRequestsView.as_view()),
    path("projects/<int:project_id>/join", views.SendReqeustView.as_view()),
    path("projects/remove/", views.RemoveMemberView.as_view()),
    path("projects/exit", views.ExitTeamView.as_view()),
    path('notifications/', views.NotificationsView.as_view()),
    path('notifications/read/', views.NotificationReadView.as_view()),
    path("ai/generate", generateproject.GenerateProjectView.as_view()),
    path("ai/opensource/", opensearch.ExploreOpenSourceView.as_view()),
    path("change/", auth.ChangePasswordView.as_view()),
    path("password-reset/", include("django_rest_passwordreset.urls"))
    
]

