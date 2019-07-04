from django.db import models
from apps.client.models import Client
from apps.account_manager.models import AccountManager
from apps.relationship_manager.models import RelationshipManager

class Contract(models.Model):
    name = models.CharField(max_length=100)
    contract_number = models.IntegerField(default=0)
    date_current_contract_signed = models.CharField(max_length=255, null=True, blank=True)
    current_contract_term = models.CharField(max_length=255, null=True, blank=True)
    total_contract_value = models.IntegerField(default=1)
    contract_type = models.CharField(max_length=255, null=True, blank=True)
    extension_contract = models.CharField(max_length=255, null=True, blank=True)
    annual_subscription = models.CharField(max_length=255, null=True, blank=True)
    status = models.CharField(max_length=255, null=True, blank=True)    

    client_id = models.ForeignKey(Client, on_delete=models.CASCADE, null=True)
    sales_rep_id = models.ForeignKey(AccountManager, on_delete=models.CASCADE, null=True)
    relationship_manager_id = models.ForeignKey(RelationshipManager, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.name

