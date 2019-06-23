from django.db import models

class NaicsCode(models.Model):
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=50)
    def __str__(self):
        return self.name