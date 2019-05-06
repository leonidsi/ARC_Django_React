from django.db import models
from project_manager.models import ProjectManager
# from project_manager.models import ProjectManager
from relationship_manager.models import RelationshipManager
from consultant.models import Consultant
from client.models import Client
from project_type.models import ProjectType

class Project(models.Model):
    name = models.CharField(max_length=255)
    survey_id = models.CharField(max_length=255)
    revenue = models.IntegerField(default=30)    
    contract_expiration_date = models.CharField(max_length=255)
    contracted_launch_date = models.CharField(max_length=255)    
    contracted_invitees = models.IntegerField(default=30)
    contracted_email_invitees = models.IntegerField(default=30)
    contracted_kiosk_invitees = models.IntegerField(default=30)
    contracted_paper_invitees = models.IntegerField(default=30)
    contracted_paper_surveys = models.IntegerField(default=30)
    contracted_dc_translations = models.IntegerField(default=30)
    contracted_report_users = models.IntegerField(default=30)
    contracted_virtual_trainings = models.IntegerField(default=30)
    contracted_onsite_trainings = models.IntegerField(default=30)
    contracted_a2a_trainings = models.IntegerField(default=30)
    number_historical_uploads = models.IntegerField(default=30)
    contracted_rpt_translations = models.IntegerField(default=30)
    server_id = models.IntegerField(default=30)
    toolkit_id = models.IntegerField(default=30)
    num_exec_interviews = models.IntegerField(default=30)
    num_exec_decks = models.IntegerField(default=30)
    final_survey_in_contract = models.IntegerField(default=30)
    european_employees = models.IntegerField(default=30)
    sso_id = models.IntegerField(default=30)
    onsite_pres_id = models.IntegerField(default=30)
    new_business_id = models.IntegerField(default=30)
    actual_invitees = models.IntegerField(default=30)
    actual_report_users = models.IntegerField(default=30)
    actual_paper_surveys = models.IntegerField(default=30)
    actual_paper_invitees = models.IntegerField(default=30)
    actual_kiosk_invitees = models.IntegerField(default=30)
    actual_rpt_translations = models.IntegerField(default=30)
    actual_dc_translations = models.IntegerField(default=30)
    actual_email_invitees = models.IntegerField(default=30)
    actual_exec_interviews = models.IntegerField(default=30)
    actual_exec_decks = models.IntegerField(default=30)
    actual_exec_presentations = models.IntegerField(default=30)
    actual_virtual_trainings = models.IntegerField(default=30)
    actual_onsite_trainings = models.IntegerField(default=30)
    actual_a2a_trainings = models.IntegerField(default=30)
    project_kickoff_date = models.DateField(auto_now=False, auto_now_add=False)
    survey_launch_date = models.DateField(auto_now=False, auto_now_add=False)
    survey_close_date = models.DateField(auto_now=False, auto_now_add=False)
    exec_first_draft_date = models.DateField(auto_now=False, auto_now_add=False)
    exec_presentation_date = models.DateField(auto_now=False, auto_now_add=False)
    project_close_date = models.DateField(auto_now=False, auto_now_add=False)
    project_team_training_date = models.DateField(auto_now=False, auto_now_add=False)
    question_final_date = models.DateField(auto_now=False, auto_now_add=False)
    online_survey_final_date = models.DateField(auto_now=False, auto_now_add=False)
    pilot_launch_date = models.DateField(auto_now=False, auto_now_add=False)
    final_data_date = models.DateField(auto_now=False, auto_now_add=False)
    ship_paper_date = models.DateField(auto_now=False, auto_now_add=False)
    manager_account_release_date = models.DateField(auto_now=False, auto_now_add=False)
    primary_contact = models.CharField(max_length=255)
    contact_email = models.CharField(max_length=255)    
    contact_protocol_id = models.IntegerField(default=30)
    require_auth = models.IntegerField(default=30)
    ok_to_miss = models.IntegerField(default=30)
    lock_survey = models.IntegerField(default=30)
    single_use_auth = models.IntegerField(default=30)
    ok_to_send_auth = models.IntegerField(default=30)
    ok_to_send_auth_sso = models.IntegerField(default=30)
    ok_to_reopen = models.IntegerField(default=30)
    kiosk = models.IntegerField(default=30)
    paper_surveys = models.IntegerField(default=30)
    hire_hire_cutoff = models.CharField(max_length=255)
    dc_sso_url = models.CharField(max_length=255)
    dc_url = models.CharField(max_length=255)
    dc_sso = models.IntegerField(default=30)
    alt_standard_reply = models.CharField(max_length=255)
    other_dc_notes = models.CharField(max_length=255)
    report_sso_url = models.CharField(max_length=255)
    report_url = models.CharField(max_length=255)
    report_sso = models.IntegerField(default=30)
    other_report_notes = models.CharField(max_length=255)
    project_rating = models.IntegerField(default=30)
    client_rating = models.IntegerField(default=30)
    number_tickets = models.IntegerField(default=30)
    number_support_emails = models.IntegerField(default=30)
    number_support_calls = models.IntegerField(default=30)
    dc_readonly_url = models.CharField(max_length=255)
    custom_dev_notes = models.CharField(max_length=255)    
    other_notes = models.CharField(max_length=255)
    sheet_id = models.CharField(max_length=255)
    data_manager = models.CharField(max_length=255)
    proposal = models.CharField(max_length=255)
    msa = models.CharField(max_length=255)
    sla = models.CharField(max_length=255)
    project_notes = models.CharField(max_length=255)



    project_mgr_id = models.ForeignKey(ProjectManager, on_delete=models.CASCADE)
    # account_mgr_id = models.ForeignKey(AccountManager, on_delete=models.CASCADE)
    relationship_mgr_id = models.ForeignKey(RelationshipManager, on_delete=models.CASCADE)
    consultant_id = models.ForeignKey(Consultant, on_delete=models.CASCADE)
    client_id = models.ForeignKey(Client, on_delete=models.CASCADE)
    project_type_id = models.ForeignKey(ProjectType, on_delete=models.CASCADE)

    

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.user_id