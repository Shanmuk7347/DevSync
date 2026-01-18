from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django.conf import settings
from django_rest_passwordreset.signals import reset_password_token_created
from django.db.models.signals import post_save
from devsync.models import JoinRequest, Notifications


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):

    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://127.0.0.1:3000')
    reset_url = f"{frontend_url}/components/home/reset/{reset_password_token.key}"

    context = {
        "username": reset_password_token.user.username,
        "reset_url": reset_url
    }

    email_html = f"""
    <html>
        <body>
            <p>Hello {reset_password_token.user.username},</p>
            <p>You requested a password reset for DevSync account. Click below to change it:</p>
            <a href="{reset_url}">Reset Password</a>
        </body>
    </html>  """
    
    msg = EmailMultiAlternatives(
        "Password reset request",
        f"Click here to reset: {reset_url}",
        from_email=settings.EMAIL_HOST_USER,
        to=[reset_password_token.user.email]
    )

    msg.attach_alternative(email_html, "text/html")
    msg.send()

@receiver(post_save, sender=JoinRequest)
def create_notifications(sender, instance, created, *args, **kwargs):

    if created:
        if instance.request_type == "INVITATION":
            Notifications.objects.create(
                recipient = instance.applicant,
                sender = instance.project.leader,
                notification_type = "project_invite",
                message = f"{instance.project.leader} invited you to join {instance.project.title}",
                target_id = instance.project.id
            )
        else:
            Notifications.objects.create(
                recipient=instance.project.leader,
                sender=instance.applicant,
                notification_type='join_request',
                message=f"{instance.applicant.username} requested to join '{instance.project.title}'",
                target_id=instance.project.id
            )
    else:   #changing status means updating existing database so created will be False
        if instance.status in ['ACCEPTED', 'REJECTED']:
            if instance.request_type == 'APPLICATION':
                 Notifications.objects.create(
                    recipient=instance.applicant,
                    sender=instance.project.leader,
                    notification_type=f'request_{instance.status.lower()}',
                    message=f"Your request to join '{instance.project.title}' was {instance.status.lower()}.",
                    target_id=instance.project.id
                )

            elif instance.request_type == 'INVITATION':
                Notifications.objects.create(
                    recipient=instance.project.leader,
                    sender=instance.applicant,
                    notification_type=f'request_{instance.status.lower()}',
                    message=f"{instance.applicant.username} {instance.status.lower()} your invitation to '{instance.project.title}'.",
                    target_id=instance.project.id
                )
