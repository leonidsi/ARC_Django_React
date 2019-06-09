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
  def update(self, instance, validated_data):
    """
    Update and return an existing `Client` instance, given the validated data.
    """
    instance.name = validated_data.get('name', instance.name)
    instance.survey_id = validated_data.get('survey_id', instance.survey_id)
    instance.revenue = validated_data.get('revenue', instance.revenue)
    instance.contract_expiration_date = validated_data.get('contract_expiration_date', instance.contract_expiration_date)
    instance.contracted_launch_date = validated_data.get('contracted_launch_date', instance.contracted_launch_date)
    instance.contracted_invitees = validated_data.get('contracted_invitees', instance.contracted_invitees)
    instance.contracted_email_invitees = validated_data.get('contracted_email_invitees', instance.contracted_email_invitees)
    instance.contracted_kiosk_invitees = validated_data.get('contracted_kiosk_invitees', instance.contracted_kiosk_invitees)
    instance.contracted_paper_invitees = validated_data.get('contracted_paper_invitees', instance.contracted_paper_invitees)
    instance.contracted_paper_surveys = validated_data.get('contracted_paper_surveys', instance.contracted_paper_surveys)
    instance.contracted_dc_translations = validated_data.get('contracted_dc_translations', instance.contracted_dc_translations)
    instance.contracted_report_users = validated_data.get('contracted_report_users', instance.contracted_report_users)
    instance.contracted_virtual_trainings = validated_data.get('contracted_virtual_trainings', instance.contracted_virtual_trainings)
    instance.contracted_a2a_trainings = validated_data.get('contracted_a2a_trainings', instance.contracted_a2a_trainings)
    instance.number_historical_uploads = validated_data.get('number_historical_uploads', instance.number_historical_uploads)
    instance.contracted_rpt_translations = validated_data.get('contracted_rpt_translations', instance.contracted_rpt_translations)
    instance.server_id = validated_data.get('server_id', instance.server_id)
    instance.toolkit_id = validated_data.get('toolkit_id', instance.toolkit_id)
    instance.num_exec_interviews = validated_data.get('num_exec_interviews', instance.num_exec_interviews)
    instance.num_exec_decks = validated_data.get('num_exec_decks', instance.num_exec_decks)
    instance.final_survey_in_contract = validated_data.get('final_survey_in_contract', instance.final_survey_in_contract)
    instance.european_employees = validated_data.get('european_employees', instance.european_employees)
    instance.sso_id = validated_data.get('sso_id', instance.sso_id)
    instance.onsite_pres_id = validated_data.get('onsite_pres_id', instance.onsite_pres_id)
    instance.new_business_id = validated_data.get('new_business_id', instance.new_business_id)
    instance.actual_invitees = validated_data.get('actual_invitees', instance.actual_invitees)
    instance.actual_report_users = validated_data.get('actual_report_users', instance.actual_report_users)
    instance.actual_paper_surveys = validated_data.get('actual_paper_surveys', instance.actual_paper_surveys)
    instance.actual_paper_invitees = validated_data.get('actual_paper_invitees', instance.actual_paper_invitees)
    instance.actual_rpt_translations = validated_data.get('actual_rpt_translations', instance.actual_rpt_translations)
    instance.actual_dc_translations = validated_data.get('actual_dc_translations', instance.actual_dc_translations)
    instance.actual_email_invitees = validated_data.get('actual_email_invitees', instance.actual_email_invitees)
    instance.actual_exec_interviews = validated_data.get('actual_exec_interviews', instance.actual_exec_interviews)
    instance.actual_exec_decks = validated_data.get('actual_exec_decks', instance.actual_exec_decks)
    instance.actual_exec_presentations = validated_data.get('actual_exec_presentations', instance.actual_exec_presentations)
    instance.actual_virtual_trainings = validated_data.get('actual_virtual_trainings', instance.actual_virtual_trainings)
    instance.actual_onsite_trainings = validated_data.get('actual_onsite_trainings', instance.actual_onsite_trainings)
    instance.actual_a2a_trainings = validated_data.get('actual_a2a_trainings', instance.actual_a2a_trainings)
    instance.project_kickoff_date = validated_data.get('project_kickoff_date', instance.project_kickoff_date)
    instance.survey_launch_date = validated_data.get('survey_launch_date', instance.survey_launch_date)
    instance.survey_close_date = validated_data.get('survey_close_date', instance.survey_close_date)
    instance.exec_first_draft_date = validated_data.get('exec_first_draft_date', instance.exec_first_draft_date)
    instance.exec_presentation_date = validated_data.get('exec_presentation_date', instance.exec_presentation_date)
    instance.project_close_date = validated_data.get('project_close_date', instance.project_close_date)
    instance.project_team_training_date = validated_data.get('project_team_training_date', instance.project_team_training_date)
    instance.question_final_date = validated_data.get('question_final_date', instance.question_final_date)
    instance.online_survey_final_date = validated_data.get('online_survey_final_date', instance.online_survey_final_date)
    instance.pilot_launch_date = validated_data.get('pilot_launch_date', instance.pilot_launch_date)
    instance.final_data_date = validated_data.get('final_data_date', instance.final_data_date)
    instance.ship_paper_date = validated_data.get('ship_paper_date', instance.ship_paper_date)
    instance.manager_account_release_date = validated_data.get('manager_account_release_date', instance.manager_account_release_date)
    instance.primary_contact = validated_data.get('primary_contact', instance.primary_contact)
    instance.contact_email = validated_data.get('contact_email', instance.contact_email)
    instance.contact_protocol_id = validated_data.get('contact_protocol_id', instance.contact_protocol_id)
    instance.require_auth = validated_data.get('require_auth', instance.require_auth)
    instance.ok_to_miss = validated_data.get('ok_to_miss', instance.ok_to_miss)
    instance.lock_survey = validated_data.get('lock_survey', instance.lock_survey)
    instance.single_use_auth = validated_data.get('single_use_auth', instance.single_use_auth)
    instance.ok_to_send_auth = validated_data.get('ok_to_send_auth', instance.ok_to_send_auth)
    instance.ok_to_send_auth_sso = validated_data.get('ok_to_send_auth_sso', instance.ok_to_send_auth_sso)
    instance.ok_to_reopen = validated_data.get('ok_to_reopen', instance.ok_to_reopen)
    instance.kiosk = validated_data.get('kiosk', instance.kiosk)
    instance.paper_surveys = validated_data.get('paper_surveys', instance.paper_surveys)
    instance.hire_hire_cutoff = validated_data.get('hire_hire_cutoff', instance.hire_hire_cutoff)
    instance.dc_sso_url = validated_data.get('dc_sso_url', instance.dc_sso_url)
    instance.dc_url = validated_data.get('dc_url', instance.dc_url)
    instance.dc_sso = validated_data.get('dc_sso', instance.dc_sso)
    instance.alt_standard_reply = validated_data.get('alt_standard_reply', instance.alt_standard_reply)
    instance.other_dc_notes = validated_data.get('other_dc_notes', instance.other_dc_notes)
    instance.report_sso_url = validated_data.get('report_sso_url', instance.report_sso_url)
    instance.report_url = validated_data.get('report_url', instance.report_url)
    instance.report_sso = validated_data.get('report_sso', instance.report_sso)
    instance.other_report_notes = validated_data.get('other_report_notes', instance.other_report_notes)
    instance.project_rating = validated_data.get('project_rating', instance.project_rating)
    instance.client_rating = validated_data.get('client_rating', instance.client_rating)
    instance.number_tickets = validated_data.get('number_tickets', instance.number_tickets)
    instance.number_support_emails = validated_data.get('number_support_emails', instance.number_support_emails)
    instance.number_support_calls = validated_data.get('number_support_calls', instance.number_support_calls)
    instance.dc_readonly_url = validated_data.get('dc_readonly_url', instance.dc_readonly_url)
    instance.custom_dev_notes = validated_data.get('custom_dev_notes', instance.custom_dev_notes)
    instance.other_notes = validated_data.get('other_notes', instance.other_notes)
    instance.sheet_id = validated_data.get('sheet_id', instance.sheet_id)
    instance.data_manager = validated_data.get('data_manager', instance.data_manager)
    instance.proposal = validated_data.get('proposal', instance.proposal)
    instance.msa = validated_data.get('msa', instance.msa)
    instance.sla = validated_data.get('sla', instance.sla)
    instance.project_notes = validated_data.get('project_notes', instance.project_notes)
    instance.is_template = validated_data.get('is_template', instance.is_template)

    instance.project_mgr_id_id = validated_data.get('project_mgr_id', instance.project_mgr_id)
    instance.account_mgr_id_id = validated_data.get('account_mgr_id', instance.account_mgr_id)
    instance.relationship_mgr_id_id = validated_data.get('relationship_mgr_id', instance.relationship_mgr_id)
    instance.consultant_id_id = validated_data.get('consultant_id', instance.consultant_id)
    instance.client_id_id = validated_data.get('client_id', instance.client_id)
    instance.project_type_id_id = validated_data.get('project_type_id', instance.project_type_id)
    instance.save()
    return instance

class TemplateSerializer(serializers.ModelSerializer):
  class Meta:
    model = Template
    fields = ('id', 'name', 'project')