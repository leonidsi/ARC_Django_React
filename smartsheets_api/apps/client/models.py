from django.db import models
from apps.naics_code.models import NaicsCode

class Client(models.Model):
    name = models.CharField(max_length=50)
    snp_500 = models.BooleanField(default=False)
    fortune_level = models.IntegerField(default=30)
    enterprise = models.BooleanField(default=False)
    greatplace_mostadmired = models.BooleanField(default=False)
    date_joined_pyx = models.DateTimeField(auto_now_add=True)
    date_left_pyx = models.DateTimeField(auto_now_add=True)
    naics_code1_id = models.ForeignKey(NaicsCode, related_name="naics_code1_id", on_delete=models.CASCADE)
    naics_code2_id = models.ForeignKey(NaicsCode, related_name="naics_code2_id", on_delete=models.CASCADE)
    def __str__(self):
        return self.name