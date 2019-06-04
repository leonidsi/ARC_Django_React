from rest_framework import serializers
from apps.project.models import Project
from apps.project.models import Template

class ProjectSerializer(serializers.ModelSerializer):
  class Meta:
    model = Project
    fields = ( 'id', 'name', 'survey_id', 'revenue',
                'contract_expiration_date', 'contracted_launch_date',
                'contracted_invitees', 'contracted_email_invitees',
                'contracted_kiosk_invitees', 'contracted_paper_invitees',
                'contracted_paper_surveys', 'contracted_dc_translations',
                'contracted_report_users', 'contracted_virtual_trainings',
                'contracted_a2a_trainings', 'number_historical_uploads',
                'contracted_rpt_translations', 'server_id', 'toolkit_id',
                'num_exec_interviews', 'num_exec_decks', 'final_survey_in_contract',
                'european_employees', 'sso_id', 'onsite_pres_id', 'new_business_id',
                'actual_invitees', 'actual_report_users', 'actual_paper_surveys',
                'actual_paper_invitees', 'actual_kiosk_invitees', 'actual_rpt_translations',
                'actual_dc_translations', 'actual_email_invitees', 'actual_exec_interviews',
                'actual_exec_decks', 'actual_exec_presentations', 'actual_virtual_trainings',
                'actual_onsite_trainings', 'actual_a2a_trainings', 'project_kickoff_date',
                'survey_launch_date', 'survey_close_date', 'exec_first_draft_date',
                'exec_presentation_date', 'project_close_date', 'project_team_training_date',
                'question_final_date', 'online_survey_final_date', 'pilot_launch_date',
                'final_data_date', 'ship_paper_date', 'manager_account_release_date',
                'primary_contact', 'contact_email', 'contact_protocol_id',
                'require_auth', 'ok_to_miss', 'lock_survey', 'single_use_auth',
                'ok_to_send_auth', 'ok_to_send_auth_sso', 'ok_to_reopen', 'kiosk',
                'paper_surveys', 'hire_hire_cutoff', 'dc_sso_url', 'dc_url', 'dc_sso',
                'alt_standard_reply', 'other_dc_notes', 'report_sso_url', 'report_url',
                'report_sso', 'other_report_notes', 'project_rating', 'client_rating', 'number_tickets',
                'number_support_emails', 'number_support_calls', 'dc_readonly_url', 'custom_dev_notes',
                'other_notes', 'sheet_id', 'data_manager', 'proposal', 'msa', 'sla', 'project_notes', 'is_template',
                'project_mgr_id', 'account_mgr_id', 'relationship_mgr_id', 'consultant_id', 'client_id',
                'project_type_id'
              )
class TemplateSerializer(serializers.ModelSerializer):
  class Meta:
    model = Template
    fields = ('name', 'project')