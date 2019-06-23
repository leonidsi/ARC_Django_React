from django.db import models
from apps.naics_code.models import NaicsCode
from django.conf import settings

class Client(models.Model):
    name = models.CharField(max_length=200)
    snp_500 = models.BooleanField(default=False)
    fortune_level = models.IntegerField(default=30, null=True, blank=True)
    enterprise = models.BooleanField(default=False)
    greatplace_mostadmired = models.BooleanField(default=False)
    date_joined_pyx = models.CharField(max_length=255, null=True, blank=True)
    date_left_pyx = models.CharField(max_length=255, null=True, blank=True)
    naics_code1_id = models.ForeignKey(NaicsCode, related_name="naics_code1_id", on_delete=models.CASCADE, null=True, blank=True)
    naics_code2_id = models.ForeignKey(NaicsCode, related_name="naics_code2_id", on_delete=models.CASCADE, null=True, blank=True)
    def __str__(self):
        return self.name