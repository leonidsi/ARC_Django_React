from django.db import models
from simple_history.models import HistoricalRecords

from apps.project_manager.models import ProjectManager
from apps.account_manager.models import AccountManager
from apps.relationship_manager.models import RelationshipManager
from apps.consultant.models import Consultant
from apps.client.models import Client
from apps.project_type.models import ProjectType
from apps.authentication.models import User

class Project(models.Model):
    name = models.CharField(max_length=255)
    survey_id = models.CharField(max_length=255, blank=True, null=True)
    revenue = models.IntegerField(null=True)    
    contract_expiration_date = models.CharField(max_length=255, blank=True, null=True)
    contracted_launch_date = models.CharField(max_length=255, blank=True, null=True)    
    contracted_invitees = models.IntegerField(null=True)
    contracted_email_invitees = models.IntegerField(null=True)
    contracted_kiosk_invitees = models.IntegerField(null=True)
    contracted_paper_invitees = models.IntegerField(null=True)
    contracted_paper_surveys = models.IntegerField(null=True)
    contracted_dc_translations = models.IntegerField(null=True)
    contracted_report_users = models.IntegerField(null=True)
    contracted_virtual_trainings = models.IntegerField(null=True)
    contracted_onsite_trainings = models.IntegerField(null=True)
    contracted_a2a_trainings = models.IntegerField(null=True)
    number_historical_uploads = models.IntegerField(null=True)
    contracted_rpt_translations = models.IntegerField(null=True)
    server_id = models.IntegerField(null=True)
    toolkit_id = models.IntegerField(null=True)
    num_exec_interviews = models.IntegerField(null=True)
    num_exec_decks = models.IntegerField(null=True)
    final_survey_in_contract = models.IntegerField(null=True)
    european_employees = models.IntegerField(null=True)
    sso_id = models.IntegerField(null=True)
    onsite_pres_id = models.IntegerField(null=True)
    new_business_id = models.IntegerField(null=True)
    actual_invitees = models.IntegerField(null=True)
    actual_report_users = models.IntegerField(null=True)
    actual_paper_surveys = models.IntegerField(null=True)
    actual_paper_invitees = models.IntegerField(null=True)
    actual_kiosk_invitees = models.IntegerField(null=True)
    actual_rpt_translations = models.IntegerField(null=True)
    actual_dc_translations = models.IntegerField(null=True)
    actual_email_invitees = models.IntegerField(null=True)
    actual_exec_interviews = models.IntegerField(null=True)
    actual_exec_decks = models.IntegerField(null=True)
    actual_exec_presentations = models.IntegerField(null=True)
    actual_virtual_trainings = models.IntegerField(null=True)
    actual_onsite_trainings = models.IntegerField(null=True)
    actual_a2a_trainings = models.IntegerField(null=True)
    project_kickoff_date = models.CharField(max_length=255, blank=True, null=True)
    survey_launch_date = models.CharField(max_length=255, blank=True, null=True)
    survey_close_date = models.CharField(max_length=255, blank=True, null=True)
    exec_first_draft_date = models.CharField(max_length=255, blank=True, null=True)
    exec_presentation_date = models.CharField(max_length=255, blank=True, null=True)
    project_close_date = models.CharField(max_length=255, blank=True, null=True)
    project_team_training_date = models.CharField(max_length=255, blank=True, null=True)
    question_final_date = models.CharField(max_length=255, blank=True, null=True)
    online_survey_final_date = models.CharField(max_length=255, blank=True, null=True)
    pilot_launch_date = models.CharField(max_length=255, blank=True, null=True)
    final_data_date = models.CharField(max_length=255, blank=True, null=True)
    ship_paper_date = models.CharField(max_length=255, blank=True, null=True)
    manager_account_release_date = models.CharField(max_length=255, blank=True, null=True)
    primary_contact = models.CharField(max_length=255, null=True, blank=True)
    contact_email = models.CharField(max_length=255, null=True, blank=True)    
    contact_protocol_id = models.IntegerField(null=True)
    require_auth = models.IntegerField(null=True)
    ok_to_miss = models.IntegerField(null=True,)
    lock_survey = models.IntegerField(null=True)
    single_use_auth = models.IntegerField(null=True)
    ok_to_send_auth = models.IntegerField(null=True)
    ok_to_send_auth_sso = models.IntegerField(null=True)
    ok_to_reopen = models.IntegerField(null=True)
    kiosk = models.IntegerField(null=True)
    paper_surveys = models.IntegerField(null=True)
    hire_hire_cutoff = models.CharField(max_length=255, null=True, blank=True)
    dc_sso_url = models.CharField(max_length=255, null=True, blank=True)
    dc_url = models.CharField(max_length=255, null=True, blank=True)
    dc_sso = models.IntegerField(null=True)
    alt_standard_reply = models.CharField(max_length=255, null=True, blank=True)
    other_dc_notes = models.CharField(max_length=255, null=True, blank=True)
    report_sso_url = models.CharField(max_length=255, null=True, blank=True)
    report_url = models.CharField(max_length=255, null=True, blank=True)
    report_sso = models.IntegerField(null=True)
    other_report_notes = models.CharField(max_length=255, null=True, blank=True)
    project_rating = models.IntegerField(null=True)
    client_rating = models.IntegerField(null=True)
    number_tickets = models.IntegerField(null=True)
    number_support_emails = models.IntegerField(null=True)
    number_support_calls = models.IntegerField(null=True)
    dc_readonly_url = models.CharField(max_length=255, null=True, blank=True)
    custom_dev_notes = models.CharField(max_length=255, null=True, blank=True)    
    other_notes = models.CharField(max_length=255, null=True, blank=True)
    sheet_id = models.CharField(max_length=255, blank=True, null=True)
    data_manager = models.CharField(max_length=255, null=True, blank=True)
    proposal = models.CharField(max_length=255, null=True, blank=True)
    msa = models.CharField(max_length=255, null=True, blank=True)
    sla = models.CharField(max_length=255, null=True, blank=True)
    project_notes = models.CharField(max_length=255, null=True, blank=True)
    is_template = models.BooleanField(default = False)

    project_mgr_id = models.ForeignKey(ProjectManager, on_delete=models.CASCADE, null=True)
    account_mgr_id = models.ForeignKey(AccountManager, on_delete=models.CASCADE, null=True)
    relationship_mgr_id = models.ForeignKey(RelationshipManager, on_delete=models.CASCADE, null=True)
    consultant_id = models.ForeignKey(Consultant, on_delete=models.CASCADE, null=True)
    client_id = models.ForeignKey(Client, on_delete=models.CASCADE, null=True)
    project_type_id = models.ForeignKey(ProjectType, on_delete=models.CASCADE, null=True)

    history = HistoricalRecords()
    def __str__(self):
        return self.name

class Template(models.Model):
    name = models.CharField(max_length=50)
    project = models.OneToOneField(Project, on_delete=models.CASCADE)

    def __str__(self):
        return self.name