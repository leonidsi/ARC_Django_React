from django.db import models

class Client(models.Model):
    name = models.CharField(max_length=50)
    snp_500 = models.BooleanField(default=False)
    fortune_level = models.IntegerField(default=30)
    enterprise = models.BooleanField(default=False)
    greatplace_mostadmired = models.BooleanField(default=False)
    date_joined_pyx = models.DateTimeField(auto_now_add=True)
    date_left_pyx = models.DateTimeField(auto_now_add=True)
    naics_code1_id = models.IntegerField(default=30)
    naics_code2_id = models.IntegerField(default=30)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name