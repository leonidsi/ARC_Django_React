import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import moment from 'moment';
import { get } from 'lodash';
import {debounce} from 'throttle-debounce';
import { Col, Row, Divider } from 'antd';

import Form from '../../components/uielements/form';
import Spin from '../../components/uielements/spin';
import Input, { Textarea } from '../../components/uielements/input';
import Checkbox from '../../components/uielements/checkbox';
import DatePicker from '../../components/uielements/datePicker';
import Tabs, { TabPane }  from '../../components/uielements/tabs';
import PageHeader from '../../components/utility/pageHeader';
import Box from '../../components/utility/box';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import Button from '../../components/uielements/button';
import Select, { SelectOption } from '../../components/uielements/select';
import styles from '../../config/FormElements/form-styles'
import projectsActions from '../../redux/projects/actions';
import projectMgrsActions from '../../redux/project_mgrs/actions';
import accountMgrsActions from '../../redux/account_mgrs/actions';
import consultantsActions from '../../redux/consultants/actions';
import clientsActions from '../../redux/clients/actions';
import serversActions from '../../redux/servers/actions';
import tookitTiersActions from '../../redux/toolkit_tiers/actions';
import howFoundPyxActions from '../../redux/how_found_pyx/actions';
import otherProvidersActions from '../../redux/other_providers/actions';
import projectTypesActions from '../../redux/project_types/actions';
import projectStatusActions from '../../redux/project_status/actions';
import smartSheetActions from '../../redux/smartsheet/actions';
import { generateXLSXFile, mapProject } from '../../helpers/utility';

const { getProject, updateProject } = projectsActions;
const { fetchProjectMgrs } = projectMgrsActions;
const { fetchAccountMgrs } = accountMgrsActions;
const { fetchConsultants } = consultantsActions;
const { fetchClients } = clientsActions;
const { fetchServers } = serversActions;
const { fetchToolkitTiers } = tookitTiersActions;
const { fetchHowFoundPyx } = howFoundPyxActions;
const { fetchOtherProviders } = otherProvidersActions;
const { fetchProjectTypes } = projectTypesActions;
const { fetchProjectStatus } = projectStatusActions;
const { fetchSheets, fetchKeyDates, clearSheets } = smartSheetActions;

const Option = SelectOption;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },         
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 18,
      offset: 6
    }
  }
};

const dateFormatList = ["MM-DD-YYYY", "MM/DD/YYYY", "MM.DD.YYYY", "MMM DD YYYY"];

const columns = {
  1: [
      'client_id', 'name', 'survey_id', 'project_type_id', 'account_mgr_id', 'project_mgr_id', 'consultant_id', 
      'data_manager', 'revenue', 'toolkit_id', 'sso_id', 'contracted_launch_date', 'contract_expiration_date', 
      'final_survey_in_contract', 'contracted_invitees', 'contracted_paper_surveys', 'contracted_email_invitees', 
      'contracted_dc_translations', 'contracted_kiosk_invitees', 'contracted_report_users', 
      'contracted_paper_invitees', 'european_employees', 'contracted_virtual_trainings', 'contracted_a2a_trainings', 
      'contracted_onsite_trainings', 'contracted_rpt_translations', 'number_historical_uploads', 'num_exec_decks', 
      'num_exec_interviews', 'onsite_pres_id', 'server_id', 'new_business_id'
    ],
  2: [
      'sheet_id', 'project_kickoff_date', 'survey_launch_date', 'exec_first_draft_date', 'exec_presentation_date', 
      'project_close_date', 'project_team_training_date', 'question_final_date', 'online_survey_final_date', 
      'List.pilot_launch_date', 'final_data_date', 'ship_paper_date', 'manager_account_release_date'
    ],
  3: [
      'actual_invitees', 'actual_email_invitees', 'actual_kiosk_invitees', 'actual_paper_invitees', 
      'actual_paper_surveys', 'actual_dc_translations', 'actual_report_users', 'actual_rpt_translations', 
      'actual_exec_interviews', 'actual_exec_decks', 'actual_exec_presentations', 
      'actual_virtual_trainings', 'actual_onsite_trainings', 'actual_a2a_trainings'
    ],
  4: [
      'primary_contact', 'contact_email', 'contact_protocol_id', 
      'require_auth', 'ok_to_miss', 'lock_survey', 'single_use_auth', 
      'hire_hire_cutoff', 'dc_sso_url', 'dc_sso', 'ok_to_send_auth', 
      'ok_to_send_auth_sso', 'ok_to_reopen', 'kiosk', 'paper_surveys', 
      'european_employees', 'alt_standard_reply', 'other_dc_notes', 
      'report_sso_url', 'report_sso' 
    ],
  5: [
      'project_rating', 'client_rating', 'number_tickets', 
      'number_support_emails', 'number_support_calls', 
      'dc_readonly_url', 'custom_dev_notes', 'other_notes'
    ],
}
const tabs = ['Contracted Project Info', 'Keydates', 'Actual Project Info', 'Help Desk Info', 'Post Project Info']
class EditProject extends React.Component {
  constructor(props) {
    super(props)
    
    this.props.clearSheets()

    const { getProject } = props
    let postData = { index: props.match.params.id }
    getProject({ postData })

    this.populateSheets = debounce(1000, this.populateSheets)
    this.state = {
      isViewMode: props.match.path === '/dashboard/projects/:id',
      projectData: null,
      errorStatus: 0,
      activeTab: 1,
    }
  }

  componentWillMount() {
    const { 
      fetchProjectMgrs,
      fetchAccountMgrs,
      fetchConsultants,
      fetchClients, 
      fetchServers,   
      fetchHowFoundPyx,
      fetchToolkitTiers,
      fetchOtherProviders,         
      fetchProjectTypes,
      fetchProjectStatus,       
     } = this.props;
    function* fetchManagers() {
      yield fetchProjectMgrs()
      yield fetchAccountMgrs()
      yield fetchConsultants()
    }
    let fetchFuncs = fetchManagers()
    fetchFuncs.next()
    fetchFuncs.next()
    fetchFuncs.next()
    
    fetchClients()  
    fetchServers() 
    fetchToolkitTiers()            
    fetchHowFoundPyx()            
    fetchOtherProviders()                  
    fetchProjectTypes()       
    fetchProjectStatus() 
  }

  componentDidMount() {

  }

  componentWillReceiveProps(props) {
    let { projectData } = props
    this.setState({ projectData })
  }

  populateSheets(code) {
    this.props.fetchSheets({ postData: { smartsheet_auth_code: code } })
  }

  getPMSmartSheetCode(projectManagerId) {
    const { projectMgrsList } = this.props;
    const selectedPM = _.find(projectMgrsList, item => item.id === projectManagerId);
    if (selectedPM) {
      return selectedPM.user.smartsheetCode
    }
    return null
  }

  onValueChange = (val, type) => {
    const { projectData } = this.state
    let postData = {}
    
    switch (type) {
      case 'name': 
        this.setState({ errorStatus: 1 })
        break
      case 'project_mgr_id':{
        const code = this.getPMSmartSheetCode(val)
        let originalCode = null
        if (projectData['project_mgr_id'] && projectData['project_mgr_id']['user_id']['smartsheetCode']) {
          originalCode = projectData['project_mgr_id']['user_id']['smartsheetCode']
        }
        if (code && code !== originalCode) {
          projectData['sheet_id'] = ''
          this.props.clearSheets()
          this.populateSheets(code)
        }
        break
      }
      case 'smartsheet_auth_code':
        postData = {
          smartsheet_auth_code: val
        }
        this.onFetchSheets(postData) 
        break;
      case 'sheet_id':
        const sheet_id = val
        const { project_mgr_id: { user_id: { smartsheetCode } } } = projectData
        const { fetchKeyDates } = this.props
        postData = { smartsheet_auth_code: smartsheetCode, sheet_id }
        fetchKeyDates({ postData })
        break;
      default:
        break
    }

    projectData[type] = val

    // const { contracted_email_invitees, contracted_kiosk_invitees, contracted_paper_invitees, contracted_paper_surveys } = projectData
    // let contracted_invitees = contracted_email_invitees ? parseInt(contracted_email_invitees, 10):0
    // contracted_invitees += contracted_kiosk_invitees ? parseInt(contracted_kiosk_invitees, 10):0
    // contracted_invitees += contracted_paper_invitees ? parseInt(contracted_paper_invitees, 10):0
    // contracted_invitees += contracted_paper_surveys ? parseInt(contracted_paper_surveys, 10):0
    
    // const { actual_email_invitees, actual_kiosk_invitees, actual_paper_invitees, actual_paper_surveys } = projectData
    // let actual_invitees = actual_email_invitees ? parseInt(actual_email_invitees, 10):0
    // actual_invitees += actual_kiosk_invitees ? parseInt(actual_kiosk_invitees, 10):0
    // actual_invitees += actual_paper_invitees ? parseInt(actual_paper_invitees, 10):0
    // actual_invitees += actual_paper_surveys ? parseInt(actual_paper_surveys, 10):0

    // projectData.contracted_invitees = contracted_invitees
    // projectData.actual_invitees = actual_invitees
    this.setState({ projectData: {...projectData} })
  }    
  handleSubmit = () => {
    let { name } = this.state.projectData
    const project_nameTrimmed = name.replace(/\s/g, '')
    const errorStatus = project_nameTrimmed.length
    if ( errorStatus < 1) {
        this.setState({ errorStatus })        
    }
    else {
        this.submitUpdateRequest();
    }
  }
  handleExport = () => {
    const { projectData, activeTab } = this.state;
    const { keydatesList } = this.props;

    generateXLSXFile([{...mapProject(projectData), ...keydatesList}], columns[activeTab], `${tabs[activeTab-1]}.xlsx`);
  }

  handleChangeTab = activeTab => {
    this.setState({ activeTab });
  }
  submitUpdateRequest = () => {
    const { updateProject, keydatesList, match } = this.props
    const { sheet_id } = this.state.projectData

    let { projectData } = this.state
    projectData.id = parseInt(match.params.id, 10)
    projectData = Object.assign(projectData, keydatesList)
    projectData.sheet_id = sheet_id === undefined ? '' : sheet_id
    this.setState({ projectData })
    updateProject({ postData: projectData })
  }
  helderStringToDate(data) {
    if (data === null) return ''
    if (new Date(data) instanceof Date && !isNaN(new Date(data).valueOf())) 
    return new Date(data).toLocaleDateString()
  }
  render() {
    const { 
        projectMgrsList,
        accountMgrsList, 
        consultantsList,
        clientsList,
        projectTypesList,
        serversList,
        toolkitTiersList,
        sheetsList,
        keydatesList,
        loading
      } = this.props;
    let sheets = sheetsList === undefined ? []:sheetsList
    const { projectData, isViewMode } = this.state
    const disableStatus = isViewMode ? 'disabled' : ''
    return (
      <LayoutContentWrapper>
        <PageHeader>{isViewMode ? 'Project Detail' : 'Edit Project'}</PageHeader>
            <Box>
              {projectData ? (
              <Form>
                <Tabs defaultActiveKey="1" onChange={this.handleChangeTab}>
                  <TabPane tab="Contracted Project Info" key="1">
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Client"
                        >
                          <Select
                            showSearch
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            labelInValue size="large"
                            value={{ key: projectData.client_id.name }}
                            placeholder="Please choose a client"
                            onChange={(obj) =>{
                              this.onValueChange(obj.key, 'client_id')
                            }}
                            disabled={disableStatus}
                          >
                              {
                                clientsList !== undefined &&
                                clientsList.sort((a, b) =>{
                                  if(a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
                                  if(a.name.toLowerCase() > b.name.toLowerCase) { return 1; }
                                  return 0;
                                }).map((item, i) => {
                                    return <Option key={`option${i}`} value={item.id}>{item.name}</Option>
                                  })
                              }
                          </Select>
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Project Name"
                          value={projectData.name}
                          validateStatus={ this.state.errorStatus < 1 ? "" : "error" }
                          help={ this.state.errorStatus < 1 ? "" : "It must be string contains at least one character" }
                        >
                          <Input
                            size="default"
                            placeholder="Input New Project"
                            value={this.state.projectData.name}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'name')} }
                            disabled
                          />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Survey ID"
                        >
                          <Input
                            size="default"
                            value={projectData.survey_id}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'survey_id') }}
                            placeholder="Input Survery ID"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Project Type"
                        >
                          <Select
                            showSearch
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            labelInValue size="large"
                            placeholder="Please choose a type"
                            value={{ key: projectData.project_type_id.name }}
                            onChange={(obj) =>{
                              this.onValueChange(obj.key, 'project_type_id')
                            }}
                            disabled={isViewMode}
                          >
                              {
                                projectTypesList !== undefined &&
                                projectTypesList.map((item, i) => {
                                    return <Option key={`option${i}`} value={item.id}>{item.name}</Option>
                                  })
                              }
                          </Select>
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Sales Executive"
                        >
                          <Select
                            showSearch
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            labelInValue size="large"
                            placeholder="Please choose a sales executive"
                            value={{ key: projectData.account_mgr_id, label: `${get(projectData, 'account_mgr_id.user_id.firstname', '')} ${get(projectData, 'account_mgr_id.user_id.lastname', '')}` }}
                            onChange={(obj) =>{
                              this.onValueChange(obj.key, 'account_mgr_id')
                            }}
                            disabled={isViewMode}
                          >
                              {
                                accountMgrsList !== undefined &&
                                accountMgrsList.sort((a, b) =>{
                                  if(a.user.firstname < b.user.firstname) { return -1; }
                                  if(a.user.firstname > b.user.firstname) { return 1; }
                                  return 0;
                                }).map((item, i) => {
                                    return <Option key={`option${i}`} value={item.id}>{`${item.user.firstname} ${item.user.lastname}`}</Option>
                                  })
                              }
                          </Select>
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Project Manager"
                        >
                        {
                          <Select
                            showSearch
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            labelInValue size="large"
                            placeholder="Please choose a project manager"
                            value={{ key: projectData.project_mgr_id, label: `${get(projectData, 'project_mgr_id.user_id.firstname', '')} ${get(projectData, 'project_mgr_id.user_id.lastname', '')}` }}
                            onChange={(obj) =>{
                              this.onValueChange(obj.key, 'project_mgr_id')
                            }}
                            disabled={isViewMode}
                          >
                            {
                              projectMgrsList !== undefined &&
                                projectMgrsList.sort((a, b) =>{
                                  if(a.user.firstname < b.user.firstname) { return -1; }
                                  if(a.user.firstname > b.user.firstname) { return 1; }
                                  return 0;
                                }).map((item, i) => {
                                  return <Option key={`option${i}`} value={item.id}>{`${item.user.firstname} ${item.user.lastname}`}</Option>
                                })
                            }
                          </Select>
                        }
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Consultant"
                        >
                          <Select
                            showSearch
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            labelInValue size="large"
                            placeholder="Please choose a consultant"
                            value={{ key: projectData.consultant_id, label: `${get(projectData, 'consultant_id.user_id.firstname', '')} ${get(projectData, 'consultant_id.user_id.firstname', '')}` }}
                            onChange={(obj) =>{
                              this.onValueChange(obj.key, 'consultant_id')
                            }}
                            disabled={isViewMode}
                          >
                              {
                                consultantsList !== undefined &&
                                consultantsList.sort((a, b) =>{
                                  if(a.user.firstname < b.user.firstname) { return -1; }
                                  if(a.user.firstname > b.user.firstname) { return 1; }
                                  return 0;
                                }).map((item, i) => {
                                    return <Option key={`option${i}`} value={item.id}>{`${item.user.firstname} ${item.user.lastname}`}</Option>
                                  })
                              }
                          </Select>
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Data Manager"
                        >
                          <Input
                            size="default"
                            value={projectData.data_manager}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'data_manager') }}
                            placeholder="Input Data Manager"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Revenue"
                        >
                          <Input
                            size="default"
                            value={projectData.revenue}
                            onChange = { (e)=> {this.onValueChange(parseInt(e.target.value, 10) || 0, 'revenue') }}
                            placeholder="Input Revenue"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                        style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Toolkit Type"
                        >
                          <Select
                            showSearch
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            size="large" placeholder="Please choose a toolkit tier" 
                            value={projectData.toolkit_id} 
                            onChange={(value, label) => this.onValueChange(value, 'toolkit_id')} 
                            disabled={isViewMode}>
                            {
                              toolkitTiersList !== undefined &&
                              toolkitTiersList.sort((a, b) =>{
                                if(a.name < b.name) { return -1; }
                                if(a.name > b.name) { return 1; }
                                return 0;
                              }).map((item, i) => {
                                  return <Option key={`option${i}`} value={item.id}>{item.name}</Option>
                                })
                            }
                          </Select>
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          {...tailFormItemLayout}
                        >
                          <Checkbox 
                            checked={projectData.sso_id} 
                            onChange={(e) => {this.onValueChange(e.target.checked? 1:0, 'sso_id')}} 
                            disabled={isViewMode}
                          >
                            SSO
                          </Checkbox>
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={10}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Contracted Launch Date"
                        >
                          <DatePicker
                            value={projectData.contracted_launch_date ? moment(projectData.contracted_launch_date, 'MM-DD-YYYY') : null}
                            onChange={(date, dateString) => {
                              this.onValueChange(dateString, 'contracted_launch_date')
                            }}
                            disabled={isViewMode}
                            format={dateFormatList}
                          />
                        </FormItem>
                      </Col>
                      <Col span={8}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Contract Expiration Date"
                        >
                          <DatePicker
                            value={projectData.contract_expiration_date ? moment(projectData.contract_expiration_date, 'MM-DD-YYYY') : null}
                            onChange={(date, dateString) => {
                              this.onValueChange(dateString, 'contract_expiration_date')
                            }}
                            disabled={isViewMode}
                            format={dateFormatList}
                          />
                        </FormItem>
                      </Col>
                      <Col span={4}>
                        <FormItem
                          {...tailFormItemLayout}
                        >
                          <Checkbox 
                            checked={projectData.final_survey_in_contract} 
                            onChange={(e) => {this.onValueChange(e.target.checked? 1:0, 'final_survey_in_contract')}} 
                            disabled={isViewMode}
                          >
                            Final Survey in Contract
                          </Checkbox>
                        </FormItem>
                      </Col>
                    </Row>
                    <Divider />
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Contracted Survey Invitees"
                        >
                          <Input
                            size="default"
                            type="number"
                            value={projectData.contracted_invitees}
                            placeholder="Contracted Survey Invitees"
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'contracted_invitees')} }
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Contracted Paper Surveys"
                        >
                          <Input
                            size="default"
                            type="number"
                            value={projectData.contracted_paper_surveys}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'contracted_paper_surveys') }}
                            placeholder="Contracted Paper Surveys"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                        style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Contracted Email Invitees"
                        >
                          <Input
                            size="default"
                            type="number"
                            value={projectData.contracted_email_invitees}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'contracted_email_invitees') }}
                            placeholder="Contracted Email Invitees"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Contracted DC Translation"
                        >
                          <Input
                            size="default"
                            type="number"
                            value={projectData.contracted_dc_translations}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'contracted_dc_translations') }}
                            placeholder="Contracted DC Translations"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Contracted Kiosk Invitees"
                        >
                          <Input
                            type="number"
                            size="default"
                            value={projectData.contracted_kiosk_invitees}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'contracted_kiosk_invitees') }}
                            placeholder="Contracted Kiosk Invitees"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Contracted Report Users"
                        >
                          <Input
                            size="default"
                            type="number"
                            value={projectData.contracted_report_users}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'contracted_report_users') }}
                            placeholder="Contracted Report Users"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Contracted Paper Invitees"
                        >
                          <Input
                            size="default"
                            type="number"
                            value={projectData.contracted_paper_invitees}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'contracted_paper_invitees') }}
                            placeholder="Contracte Paper Invitees"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          {...tailFormItemLayout}
                        >
                          <Checkbox 
                            checked={projectData.european_employees} 
                            onChange={(e) => {this.onValueChange(e.target.checked? 1:0, 'european_employees')}} 
                            disabled={isViewMode}
                          >
                            European Emloyees
                          </Checkbox>
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Contracted Virtual Trainings"
                        >
                          <Input
                            size="default"
                            type="number"
                            value={projectData.contracted_virtual_trainings}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'contracted_virtual_trainings') }}
                            placeholder="Contracted Virtual Trainings"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Contracted A2A Trainings"
                        >
                          <Input
                            size="default"
                            type="number"
                            value={projectData.contracted_a2a_trainings}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'contracted_a2a_trainings') }}
                            placeholder="Contracted A2A Trainings"
                            disabled={isViewMode}
                          />
                        </FormItem>
                        
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Contracted Onsite Trainings"
                        >
                          <Input
                            size="default"
                            type="number"
                            value={projectData.contracted_onsite_trainings}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'contracted_onsite_trainings') }}
                            placeholder="Contracted Onsite Trainings"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Contracted Rpt Translations"
                        >
                          <Input
                            size="default"
                            type="number"
                            value={projectData.contracted_rpt_translations}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'contracted_rpt_translations') }}
                            placeholder="Contracted Rpt Translations"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                    <Divider />
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Number of Historical Surveys to Upload"
                        >
                          <Input
                            size="default"
                            type="number"
                            value={projectData.number_historical_uploads}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'number_historical_uploads') }}
                            placeholder="Number of Historical Surveys to Upload"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Number of Exec Decks"
                        >
                          <Input
                            size="default"
                            type="number"
                            value={projectData.num_exec_decks}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'num_exec_decks') }}
                            placeholder="Number of Exec Decks"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Number of Exec Interviews"
                        >
                          <Input
                            size="default"
                            type="number"
                            value={projectData.num_exec_interviews}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'num_exec_interviews') }}
                            placeholder="Number of Exec Interviews"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          {...tailFormItemLayout}
                        >
                          <Checkbox 
                            checked={projectData.onsite_pres_id} 
                            onChange={(e) => {this.onValueChange(e.target.checked? 1:0, 'onsite_pres_id')}} 
                            disabled={isViewMode}
                          >
                            Onsite Pres
                          </Checkbox>
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          {...tailFormItemLayout}
                        >
                          <Checkbox 
                            checked={projectData.new_business_id} 
                            onChange={(e) => {this.onValueChange(e.target.checked? 1:0, 'new_business_id')}} 
                            disabled={isViewMode}
                          >
                            New Project
                          </Checkbox>
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Server"
                        >
                          <Select
                            showSearch
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            size="large" 
                            placeholder="Please choose a server" 
                            value={projectData.server_id} 
                            onChange={(value, label) => {this.onValueChange(value, 'server_id')}} 
                            disabled={isViewMode}>
                              <Option value={0}>Please choose a server</Option>
                              {
                                serversList !== undefined &&
                                serversList.sort((a, b) =>{
                                  if(a.name < b.name) { return -1; }
                                  if(a.name > b.name) { return 1; }
                                  return 0;
                                }).map((item, i) => {
                                    return <Option key={`option${i}`} value={item.id}>{item.name}</Option>
                                  })
                              }
                          </Select>
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Proposal"
                        >
                          <Input
                            size="default"
                            placeholder="Proposal file url"
                            value={this.state.projectData.proposal}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'proposal')} }
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="MSA"
                        >
                          <Input
                            size="default"
                            placeholder="MSA file url"
                            value={this.state.projectData.msa}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'msa')} }
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="SLA"
                        >
                          <Input
                            size="default"
                            placeholder="SLA file url"
                            value={this.state.projectData.sla}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'sla')} }
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Project Notes/Comments"
                        >
                          <Textarea
                            value={this.state.projectData.project_notes}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'project_notes')} }
                            rows={6}
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tab="Keydates" key="2">

                    <Row>
                      <Col span={12}>

                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Sheet Name"
                        >
                          <Select
                            showSearch
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            size="large" 
                            placeholder="Please choose a sheet" 
                            value={projectData.sheet_id} 
                            onChange={(value) => {this.onValueChange(value, 'sheet_id')}} 
                            disabled={isViewMode}
                          >
                            {
                              sheets.length > 0 &&
                              sheets.sort((a, b) =>{
                                if(a.name < b.name) { return -1; }
                                if(a.name > b.name) { return 1; }
                                return 0;
                              }).map((item, i) => {
                                  return <Option key={`sheets${i}`} value={`${item.id}`}>{item.name}</Option>
                                })
                            }
                          </Select>
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Survey Kickoff"
                        >
                          <Input
                            size="default"
                            value={keydatesList !== undefined ? this.helderStringToDate(keydatesList.project_kickoff_date):''}
                            placeholder="Survey Kickoff"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>

                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Survey Launch"
                        >
                          <Input
                            size="default"
                            value={keydatesList !== undefined ? this.helderStringToDate(keydatesList.survey_launch_date):''}
                            placeholder="Survey Launch"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                      <Col span={12}>
                      
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Survey Close"
                        >
                          <Input
                            size="default"
                            value={keydatesList !== undefined ? this.helderStringToDate(keydatesList.survey_close_date):''}
                            placeholder="Survey Close"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>

                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="First Draft of Exec Deck"
                        >
                          <Input
                            size="default"
                            value={keydatesList !== undefined ? this.helderStringToDate(keydatesList.exec_first_draft_date):''}
                            placeholder="First Draft of Exec Deck"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                      <Col span={12}>
                          
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Exec Deck Delivery"
                        >
                          <Input
                            size="default"
                            value={keydatesList !== undefined ? this.helderStringToDate(keydatesList.exec_presentation_date):''}
                            placeholder="Exec Deck Delivery"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Lessons Learned Meeting"
                        >
                          <Input
                            size="default"
                            value={keydatesList !== undefined ? this.helderStringToDate(keydatesList.project_close_date):''}
                            placeholder="Lessons Learned Meeting"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Conduct Project Team Training"
                        >
                          <Input
                            size="default"
                            value={keydatesList !== undefined ? this.helderStringToDate(keydatesList.project_team_training_date):''}
                            placeholder="Conduct Project Team Training"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Survey Questions Finalized"
                        >
                          <Input
                            size="default"
                            value={keydatesList !== undefined ? this.helderStringToDate(keydatesList.question_final_date):''}
                            placeholder="Survey Questions Finalized"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Online Survey Finalized"
                        >
                          <Input
                            size="default"
                            value={keydatesList !== undefined ? this.helderStringToDate(keydatesList.online_survey_final_date):''}
                            placeholder="Online Survey Finalized"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Pilot Survey Launch"
                        >
                          <Input
                            size="default"
                            value={keydatesList !== undefined ? this.helderStringToDate(keydatesList.pilot_launch_date):''}
                            placeholder="Pilot Survey Launch"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Final Data File Submitted"
                        >
                          <Input
                            size="default"
                            value={keydatesList !== undefined ? this.helderStringToDate(keydatesList.final_data_date):''}
                            placeholder="Final Data File Submitted"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Ship Paper Surveys"
                        >
                          <Input
                            size="default"
                            value={keydatesList !== undefined ? this.helderStringToDate(keydatesList.ship_paper_date):''}
                            placeholder="Ship Paper Surveys"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Manager Accounts Released"
                        >
                          <Input
                            size="default"
                            value={keydatesList !== undefined ? this.helderStringToDate(keydatesList.manager_account_release_date):''}
                            placeholder="Manager Accounts Released"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tab="Actual Project Info" key="3">
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Actual Survey Invitees"
                        >
                          <Input
                            size="default"
                            value={projectData.actual_invitees}
                            placeholder="Actual Survey Invitees"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Actual Email Invitees"
                        >
                          <Input
                            size="default"
                            type="number"
                            value={projectData.actual_email_invitees}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'actual_email_invitees') }}
                            placeholder="Actual Email Invitees"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Actual Kiosk Invitees"
                        >
                          <Input
                            size="default"
                            type="number"
                            value={projectData.actual_kiosk_invitees}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'actual_kiosk_invitees') }}
                            placeholder="Actual Kiosk Invitees"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Actual Paper Invitees"
                        >
                          <Input
                            size="default"
                            type="number"
                            value={projectData.actual_paper_invitees}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'actual_paper_invitees') }}
                            placeholder="Actual Paper Invitees"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Actual Paper Surveys"
                        >
                          <Input
                            size="default"
                            value={projectData.actual_paper_surveys}
                            type="number"
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'actual_paper_surveys') }}
                            placeholder="Actual Paper Surveys"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Actual DC Translations"
                        >
                          <Input
                            size="default"
                            type="number"
                            value={projectData.actual_dc_translations}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'actual_dc_translations') }}
                            placeholder="Actual DC Translations"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Actual Report Users"
                        >
                          <Input
                            size="default"
                            type="number"
                            value={projectData.actual_report_users}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'actual_report_users') }}
                            placeholder="Actual Report Users"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Actual Rpt Translations"
                        >
                          <Input
                            size="default"
                            type="number"
                            value={projectData.actual_rpt_translations}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'actual_rpt_translations') }}
                            placeholder="Actual Rpt Translations"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Actual Exec Interviews"
                        >
                          <Input
                            size="default"
                            type="number"
                            value={projectData.actual_exec_interviews}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'actual_exec_interviews') }}
                            placeholder="Actual Exec Interviews"
                            disabled={isViewMode}
                          />
                        </FormItem>

                      </Col>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Actual Exec Decks"
                        >
                          <Input
                            size="default"
                            type="number"
                            value={projectData.actual_exec_decks}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'actual_exec_decks') }}
                            placeholder="Actual Exec Decks"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Actual Exec Presentations"
                        >
                          <Input
                            size="default"
                            type="number"
                            value={projectData.actual_exec_presentations}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'actual_exec_presentations') }}
                            placeholder="Actual Exec Presentations"
                            disabled={isViewMode}
                          />
                        </FormItem>

                      </Col>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Actual Virtual Trainings"
                        >
                          <Input
                            size="default"
                            value={projectData.actual_virtual_trainings}
                            type="number"
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'actual_virtual_trainings') }}
                            placeholder="Actual Virtual Trainings"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Actual Onsite Trainings"
                        >
                          <Input
                            size="default"
                            type="number"
                            value={projectData.actual_onsite_trainings}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'actual_onsite_trainings') }}
                            placeholder="Actual Onsite Trainings"
                            disabled={isViewMode}
                          />
                        </FormItem>

                      </Col>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Actual A2A Trainings"
                        >
                          <Input
                            size="default"
                            type="number"
                            value={projectData.actual_a2a_trainings}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'actual_a2a_trainings') }}
                            placeholder="Actual A2A Trainings"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tab="Help Desk Info" key="4">
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Primary Contact Name"
                        >
                          <Input
                            size="default"
                            value={projectData.primary_contact}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'primary_contact') }}
                            placeholder="Primary Contact Name"
                            disabled={isViewMode}
                          />
                        </FormItem>

                      </Col>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Email Address of Mail Contact"
                        >
                          <Input
                            size="default"
                            value={projectData.contact_email}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'contact_email') }}
                            placeholder="Email Address of Mail Contact"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Contact Protocol"
                        >
                          <Select 
                            showSearch
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            value={projectData.contact_protocol_id} onChange={(value, label) => {this.onValueChange(value, 'contact_protocol_id')}} disabled={isViewMode}>
                            <Option value={0}>Please choose a protocol</Option>
                            <Option value={1}>Okay to Email Client</Option>
                            <Option value={2}>Send to PM First</Option>
                          </Select>
                        </FormItem>
                      </Col>
                    </Row>
                    <Divider><h2 style={{ textAlign: 'center' }}>DC Information</h2></Divider>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          {...tailFormItemLayout}
                        >
                          <Checkbox checked={projectData.require_auth} onChange={(e) => {this.onValueChange(e.target.checked? 1:0, 'require_auth')}} disabled={isViewMode}>Require Auth Codes</Checkbox>
                        </FormItem>

                      </Col>
                      <Col span={12}>
                        <FormItem
                          {...tailFormItemLayout}
                        >
                          <Checkbox checked={projectData.ok_to_miss} onChange={(e) => {this.onValueChange(e.target.checked? 1:0, 'ok_to_miss')}} disabled={isViewMode}>Ok to miss questions</Checkbox>
                        </FormItem>
                      
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          {...tailFormItemLayout}
                        >
                          <Checkbox checked={projectData.lock_survey} onChange={(e) => {this.onValueChange(e.target.checked? 1:0, 'lock_survey')}} disabled={isViewMode}>Lock Surveys when Complete</Checkbox>
                        </FormItem>

                      </Col>
                      <Col span={12}>
                        <FormItem
                          {...tailFormItemLayout}
                        >
                          <Checkbox checked={projectData.single_use_auth} onChange={(e) => {this.onValueChange(e.target.checked? 1:0, 'single_use_auth')}} disabled={isViewMode}>Single Use Auth Codes</Checkbox>
                        </FormItem>
                      
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          {...tailFormItemLayout}
                        >
                          <Checkbox checked={projectData.dc_sso} onChange={(e) => {this.onValueChange(e.target.checked? 1:0, 'dc_sso')}} disabled={isViewMode}>DC SSO</Checkbox>
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="New Hire Cutoff Date"
                        >
                          <DatePicker
                            value={projectData.hire_hire_cutoff ? moment(projectData.hire_hire_cutoff, 'MM-DD-YYYY') : null}
                            onChange={(date, dateString) => {
                              this.onValueChange(dateString, 'hire_hire_cutoff')
                            }}
                            disabled={isViewMode}
                            format={dateFormatList}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="DC URL"
                        >
                          <Input
                            size="default"
                            value={projectData.dc_url}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'dc_url') }}
                            placeholder="DC URL"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="DC URL(SSO)"
                        >
                          <Input
                            size="default"
                            value={projectData.dc_sso_url}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'dc_sso_url') }}
                            placeholder="DC URL(SSO)"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          {...tailFormItemLayout}
                        >
                          <Checkbox checked={projectData.ok_to_send_auth_sso} onChange={(e) => {this.onValueChange(e.target.checked? 1:0, 'ok_to_send_auth_sso')}} disabled={isViewMode}>If using SSO, ok to send Auth</Checkbox>
                        </FormItem>

                      </Col>
                      <Col span={12}>
                        <FormItem
                          {...tailFormItemLayout}
                        >
                          <Checkbox checked={projectData.ok_to_reopen} onChange={(e) => {this.onValueChange(e.target.checked? 1:0, 'ok_to_reopen')}} disabled={isViewMode}>OK to reopen surveys</Checkbox>
                        </FormItem>
                      
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          {...tailFormItemLayout}
                        >
                          <Checkbox checked={projectData.kiosk} onChange={(e) => {this.onValueChange(e.target.checked? 1:0, 'kiosk')}} disabled={isViewMode}>Kiosk</Checkbox>
                        </FormItem>

                      </Col>
                      <Col span={12}>
                        <FormItem
                          {...tailFormItemLayout}
                        >
                          <Checkbox checked={projectData.paper_surveys} onChange={(e) => {this.onValueChange(e.target.checked? 1:0, 'paper_surveys')}} disabled={isViewMode}>Paper Surveys</Checkbox>
                        </FormItem>
                      
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          {...tailFormItemLayout}
                        >
                          <Checkbox checked={projectData.european_employees} onChange={(e) => {this.onValueChange(e.target.checked? 1:0, 'european_employees')}} disabled={isViewMode}>European Employees</Checkbox>
                        </FormItem>

                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Other DC Notes"
                        >
                          <Input
                            size="default"
                            value={projectData.other_dc_notes}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'other_dc_notes') }}
                            placeholder="Other DC Notes"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                    <Divider><h2 style={{ textAlign: 'center' }}>Reporting Information</h2></Divider>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Reporting URL"
                        >
                          <Input
                            size="default"
                            value={projectData.report_url}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'report_url') }}
                            placeholder="Reporting URL"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Reporting URL(SSO)"
                        >
                          <Input
                            size="default"
                            value={projectData.report_sso_url}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'report_sso_url') }}
                            placeholder="Reporting URL(SSO)"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          {...tailFormItemLayout}
                        >
                          <Checkbox
                            checked={projectData.ok_to_send_auth} 
                            onChange={(e) => this.onValueChange(e.target.checked ? 1:0, 'ok_to_send_auth')}
                            disabled={isViewMode}
                          >Okay to provide login credentials if SSO link is not working</Checkbox>
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          {...tailFormItemLayout}
                        >
                          <Checkbox
                            checked={projectData.report_sso} 
                            onChange={(e) => this.onValueChange(e.target.checked ? 1:0, 'report_sso')}
                            disabled={isViewMode}
                          >Reporting SSO</Checkbox>
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Other Reporting Notes"
                        >
                          <Input
                            size="default"
                            value={projectData.other_report_notes}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'other_report_notes') }}
                            placeholder="Other Reporting Notes"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                    </TabPane>
                    <TabPane tab="Post Project Info" key="5">
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Project Complexity Rating (DC / Data / Reporting)"
                        >
                          <Select
                            showSearch
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            value={projectData.project_rating} onChange={(value, label) => {this.onValueChange(value, 'project_rating')}} disabled={isViewMode}>
                            <Option value={0}>Please choose a rating</Option>
                            <Option value="1">1</Option>
                            <Option value="2">2</Option>
                            <Option value="3">3</Option>
                            <Option value="4">4</Option>
                            <Option value="5">5</Option>
                          </Select>
                        </FormItem>

                      </Col>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Client Working Relationship Rating"
                        >
                          <Select
                            showSearch
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            value={projectData.client_rating} onChange={(value, label) => {this.onValueChange(value, 'client_rating')}} disabled={isViewMode}>
                            <Option value={0}>Please choose a rating</Option>
                            <Option value="1">1</Option>
                            <Option value="2">2</Option>
                            <Option value="3">3</Option>
                            <Option value="4">4</Option>
                            <Option value="5">5</Option>
                          </Select>
                        </FormItem>
                      
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Number of Tickets Opened"
                        >
                          <Input
                            size="default"
                            value={projectData.number_tickets}
                            onChange = { (e)=> {this.onValueChange(parseInt(e.target.value, 10) || 0, 'number_tickets') }}
                            placeholder="Number of Tickets Opened"
                            disabled={isViewMode}
                          />
                        </FormItem>

                      </Col>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Number of Support Emails"
                        >
                          <Input
                            size="default"
                            value={projectData.number_support_emails}
                            onChange = { (e)=> {this.onValueChange(parseInt(e.target.value, 10) || 0, 'number_support_emails') }}
                            placeholder="Number of Support Emails"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Number of Support Phone Calls"
                        >
                          <Input
                            size="default"
                            value={projectData.number_support_calls}
                            onChange = { (e)=> {this.onValueChange(parseInt(e.target.value, 10) || 0, 'number_support_calls') }}
                            placeholder="Number of Support Phone Calls"
                            disabled={isViewMode}
                          />
                        </FormItem>

                      </Col>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Manager Toolkit Examples"
                        >
                        </FormItem>
                      
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="DC ReadOnly URL"
                        >
                          <Input
                            size="default"
                            value={projectData.dc_readonly_url}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'dc_readonly_url') }}
                            placeholder="DC ReadOnly URL"
                            disabled={isViewMode}
                          />
                        </FormItem>

                      </Col>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Explain custom development"
                        >
                          <Input
                            size="default"
                            value={projectData.custom_dev_notes}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'custom_dev_notes') }}
                            placeholder="Explain custom development"
                            disabled={isViewMode}
                          />
                        </FormItem>
                      
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="Other Notes"
                        >
                          <Input
                            size="default"
                            value={projectData.other_notes}
                            onChange = { (e)=> {this.onValueChange(e.target.value, 'other_notes') }}
                            placeholder="Other Notes"
                            disabled={isViewMode}
                          />
                        </FormItem>

                      </Col>
                      <Col span={12}>
                        <FormItem
                          style={styles.formItemMargin}
                          {...formItemLayout}
                          label="DC Template (excel)"
                        >
                        </FormItem>
                      </Col>
                    </Row>
                  </TabPane>
                  </Tabs>
                <FormItem {...tailFormItemLayout}>
                  {
                    isViewMode ? (
                      <Button size='default' type="primary" onClick={() => this.handleExport()}>
                        Export
                      </Button>
                    ) : (
                      <Button size='default' type="primary" onClick={() => this.handleSubmit()} disabled={loading}>
                        Save
                      </Button>
                    )
                  }
                  <Button size='default' style={styles.marginBtn}>
                    <Link to="/dashboard/projects">Cancel</Link>
                  </Button>
                </FormItem>
              </Form>
            ) : (
              <div style={{textAlign: 'center', padding: 30}}>
                <Spin size="large" tip="loading..." />
              </div>
              
            )
          }
          </Box>
      </LayoutContentWrapper>
    );
  }
}

EditProject.propTypes = {
  projectMgrsList: PropTypes.array,
  accountMgrsList: PropTypes.array,
  consultantsList: PropTypes.array,
  clientsList: PropTypes.array,
  projectTypesList: PropTypes.array,
  projectStatusList: PropTypes.array,
  serversList: PropTypes.array,
  toolkitTiersList: PropTypes.array,
  howFoundPyxList: PropTypes.array,
  otherProvidersList: PropTypes.array,
  sheetsList: PropTypes.array,
  keydatesList: PropTypes.object,
  fetchProjectMgrs: PropTypes.func,
  fetchAccountMgrs: PropTypes.func,
  fetchConsultants: PropTypes.func,
  fetchClients: PropTypes.func,
  fetchServers: PropTypes.func,
  fetchToolkitTiers: PropTypes.func,
  fetchOtherProviders: PropTypes.func,
  fetchHowFoundPyx: PropTypes.func,
  fetchProjectTypes: PropTypes.func,
  fetchProjectStatus: PropTypes.func,
  insertProject: PropTypes.func,
  fetchSheets: PropTypes.func,
  fetchKeyDates: PropTypes.func,
}

export default connect(
  state => ({
    projectMgrsList: state.ProjectMgrs.get('projectMgrsList').toJS(),
    accountMgrsList: state.AccountMgrs.get('accountMgrsList').toJS(),
    consultantsList: state.Consultants.get('consultantsList').toJS(),
    clientsList: state.Clients.clientsList,
    projectTypesList: state.ProjectTypes.projectTypesList,
    projectStatusList: state.ProjectStatus.projectStatusList,
    serversList: state.Servers.serversList,
    toolkitTiersList: state.ToolkitTiers.toolkitTiersList,
    howFoundPyxList: state.HowFoundPyx.howFoundPyxList,
    otherProvidersList: state.OtherProviders.otherProvidersList,
    sheetsList: state.SmartSheet.sheetsList,    
    keydatesList: state.SmartSheet.keydatesList,   
    projectData: state.Projects.singleProject,
    loading: state.Projects.loading
  }),
  {
    fetchProjectMgrs,
    fetchAccountMgrs,
    fetchConsultants,
    fetchClients,
    fetchServers,
    fetchToolkitTiers,
    fetchOtherProviders,
    fetchHowFoundPyx,        
    fetchProjectTypes,
    fetchProjectStatus,       
    fetchSheets,
    fetchKeyDates,
    getProject, 
    updateProject,
    clearSheets,
  }
)(EditProject);
