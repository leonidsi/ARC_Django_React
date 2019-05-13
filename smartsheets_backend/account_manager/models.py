from django.db import models
from authentication.models import User

class AccountManager(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    def __str__(self):
        return self.user_id