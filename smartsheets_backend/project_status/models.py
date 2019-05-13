from django.db import models

class ProjectStatus(models.Model):
    name = models.CharField(max_length=50)
    def __str__(self):
        return self.name