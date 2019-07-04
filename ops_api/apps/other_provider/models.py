from django.db import models
from simple_history.models import HistoricalRecords

class OtherProvider(models.Model):
    name = models.CharField(max_length=50)
    history = HistoricalRecords()

    def __str__(self):
        return self.name