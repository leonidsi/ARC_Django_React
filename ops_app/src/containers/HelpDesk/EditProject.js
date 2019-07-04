import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import moment from 'moment';
import {debounce} from 'throttle-debounce';
import { Col, Row, Divider } from 'antd';

import Form from '../../components/uielements/form';
import Spin from '../../components/uielements/spin';
import Input from '../../components/uielements/input';
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

const columns = {
  1: [
      'client_id', 'name', 'survey_id', 'project_type_id', 'account_mgr_id', 
      'project_mgr_id', 'consultant_id', 'data_manager', 'revenue', 'toolkit_id', 
      'sso_id', 'contracted_launch_date', 'contract_expiration_date', 
      'final_survey_in_contract', 'contracted_invitees', 'contracted_paper_surveys', 
      'contracted_email_invitees', 'contracted_dc_translations', 'contracted_kiosk_invitees', 
      'contracted_report_users', 'contracted_paper_invitees', 'european_employees', 
      'contracted_virtual_trainings', 'contracted_a2a_trainings', 'contracted_onsite_trainings', 
      'contracted_rpt_translations', 'number_historical_uploads', 'num_exec_decks', 
      'num_exec_interviews', 'onsite_pres_id', 'server_id', 'new_business_id'
    ],
  2: [
      'sheet_id', 'project_kickoff_date', 'survey_launch_date', 'exec_first_draft_date', 
      'exec_presentation_date', 'project_close_date', 'project_team_training_date', 
      'question_final_date', 'online_survey_final_date', 'List.pilot_launch_date', 
      'final_data_date', 'ship_paper_date', 'manager_account_release_date'
    ],
  3: [
      'actual_invitees', 'actual_email_invitees', 'actual_kiosk_invitees', 
      'actual_paper_invitees', 'actual_paper_surveys', 'actual_dc_translations', 
      'actual_report_users', 'actual_rpt_translations', 'actual_exec_interviews', 
      'actual_exec_decks', 'actual_exec_presentations', 'actual_virtual_trainings', 
      'actual_onsite_trainings', 'actual_a2a_trainings'
    ],
  4: [
      'primary_contact', 'contact_email', 'contact_protocol_id', 'require_auth', 
      'ok_to_miss', 'lock_survey', 'single_use_auth', 'hire_hire_cutoff', 
      'dc_sso_url', 'dc_sso', 'ok_to_send_auth', 'ok_to_send_auth_sso', 
      'ok_to_reopen', 'kiosk', 'paper_surveys', 'european_employees', 
      'alt_standard_reply', 'other_dc_notes', 'report_sso_url', 'report_sso' 
    ],
  5: [
      'project_rating', 'client_rating', 'number_tickets', 'number_support_emails', 
      'number_support_calls', 'dc_readonly_url', 'custom_dev_notes', 'other_notes'
    ],
}
const tabs = ['Contracted Project Info', 'Keydates', 'Actual Project Info', 'Help Desk Info', 'Post Project Info']
const dateFormatList = ["MM-DD-YYYY", "MM/DD/YYYY", "MM.DD.YYYY", "MMM DD YYYY"];

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
        break        
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
        sheetsList,
        loading
      } = this.props;
    let sheets = sheetsList === undefined ? []:sheetsList
    const { projectData, isViewMode } = this.state
    return (
      <LayoutContentWrapper>
        <PageHeader>{isViewMode ? 'Project Detail' : 'Edit Project'}</PageHeader>
            <Box>
              {projectData ? (
              <Form>
                <Tabs defaultActiveKey="1" onChange={this.handleChangeTab}>
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
