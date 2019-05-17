from django.db import models
from apps.authentication.models import User

class Consultant(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    def __str__(self):
        return self.user_id