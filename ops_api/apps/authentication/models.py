import jwt
import os

from datetime import datetime, timedelta
from django.utils import timezone
from django.conf import settings
from django.db import transaction, models
from django.contrib.auth.models import ( 
    AbstractBaseUser, BaseUserManager, PermissionsMixin
)

from django.utils.translation import ugettext_lazy as _
from apps.role.models import Role
from simple_history.models import HistoricalRecords

class UserManager(BaseUserManager):
    def _create_user(self, email,
                     is_staff, is_superuser, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        now = timezone.now()
        if not email:
            raise ValueError('The given email must be set')
        try:
            with transaction.atomic():
                email = self.normalize_email(email)
                user = self.model(email=email,
                                is_staff=is_staff, is_active=True,
                                is_superuser=is_superuser, last_login=now,
                                date_joined=now, **extra_fields)
                # user.set_password(password)
                user.set_unusable_password()
                user.save(using=self._db)
                return user
        except:
            raise

    def create_user(self, email, **extra_fields):
        return self._create_user(email, False, False,
                                 **extra_fields)

    def create_superuser(self, email, **extra_fields):
        return self._create_user(email, True, True,
                                 **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    # Each `User` needs a human-readable unique identifier that we can use to
    # represent the `User` in the UI. We want to index this column in the
    # database to improve lookup performance.
    username = models.CharField(db_index=True, max_length=255, unique=True)
    # username = []
    # We also need a way to contact the user and a way for the user to identify
    # themselves when logging in. Since we need an email address for contacting
    # the user anyways, we will also use the email for logging in because it is
    # the most common form of login credential at the time of writing.
    email = models.EmailField(db_index=True, unique=True)

    # When a user no longer wishes to use our platform, they may try to delete
    # their account. That's a problem for us because the data we collect is
    # valuable to us and we don't want to delete it. We
    # will simply offer users a way to deactivate their account instead of
    # letting them delete it. That way they won't show up on the site anymore,
    # but we can still analyze the data.
    is_active = models.BooleanField(default=True)

    # The `is_staff` flag is expected by Django to determine who can and cannot
    # log into the Django admin site. For most users this flag will always be
    # false.
    is_staff = models.BooleanField(default=False)

    # A timestamp representing when this object was created.
    # created_at = models.DateTimeField(auto_now=False, auto_now_add=False, null=True, blank=True)

    # # A timestamp reprensenting when this object was last updated.
    # updated_at = models.DateTimeField(auto_now=False, auto_now_add=False, null=True, blank=True)

    # More fields required by Django when specifying a custom user model.
    firstname = models.CharField(max_length=255, blank=False, unique=False)
    lastname = models.CharField(max_length=255, blank=False, unique=False)

    smartsheetCode = models.CharField(max_length=255, blank=False, unique=False, default='', null=True)
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now, null=True, blank=True)

    roleId = models.IntegerField(default=1)
    # roleId = models.ForeignKey(Role, related_name="roleId", on_delete=models.CASCADE)
    
    # The `USERNAME_FIELD` property tells us which field we will use to log in.
    # In this case we want it to be the email field.
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    history = HistoricalRecords()
    # REQUIRED_FIELDS = []
    # Tells Django that the UserManager class defined above should manage
    # objects of this type.
    objects = UserManager()

    
    def __str__(self):
        """
        Returns a string representation of this `User`.

        This string is used when a `User` is printed in the console.
        """
        # return self.username + ' (' + self.email + ')'
        return self.email
        

    @property
    def token(self):
        """
        Allows us to get a user's token by calling `user.token` instead of
        `user.generate_jwt_token().

        The `@property` decorator above makes this possible. `token` is called
        a "dynamic property".
        """
        return self._generate_jwt_token()

    def get_full_name(self):
        """
        This method is required by Django for things like handling emails.
        Typically this would be the user's first and last name. Since we do
        not store the user's real name, we return their username instead.
        """
        return self.firstname + ' ' + self.lastname

    def get_short_name(self):
        """
        This method is required by Django for things like handling emails.
        Typically, this would be the user's first name. Since we do not store
        the user's real name, we return their username instead.
        """
        return self.firstname

    def _generate_jwt_token(self):
        """
        Generates a JSON Web Token that stores this user's ID and has an expiry
        date set to 60 days into the future.
        """
        dt = datetime.now() + timedelta(days=60)

        token = jwt.encode({
            'id': self.pk,
            'exp': int(dt.strftime('%s'))
        }, settings.SECRET_KEY, algorithm='HS256')

        return token.decode('utf-8')

    def save(self, *args, **kwargs):
        super(User, self).save(*args, **kwargs)
        return self

    class Meta:
        db_table = "user"
        managed = True

class BlackListedToken(models.Model):
    token = models.CharField(max_length=500)
    user = models.ForeignKey(User, related_name="token_user", on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("token", "user")
