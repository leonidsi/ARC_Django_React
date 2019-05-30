import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {debounce} from 'throttle-debounce';
import _ from 'lodash';
import Form from '../../components/uielements/form';
import Input, { Textarea } from '../../components/uielements/input';
import Checkbox from '../../components/uielements/checkbox';
import DatePicker from '../../components/uielements/datePicker';
import Tabs, { TabPane }  from '../../components/uielements/tabs';
import PageHeader from '../../components/utility/pageHeader';
import Box from '../../components/utility/box';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import Button from '../../components/uielements/button';
import Modal from '../../components/uielements/modal';
import Col from '../../components/uielements/col';
import Row from '../../components/uielements/row';
import Divider from '../../components/uielements/divider';
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

const { insertProject } = projectsActions;
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
    sm: { span: 12 },
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

class AddNewProject extends React.Component {
  state = {
      projectData: { name: '' },
      errorStatus: 1,
      visible: false,
      confirmLoading: false,
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

      fetchProjectMgrs()
      fetchAccountMgrs()
      fetchConsultants()
      
      fetchClients()  
      fetchServers() 
      fetchToolkitTiers()            
      fetchHowFoundPyx()            
      fetchOtherProviders()                  
      fetchProjectTypes()       
      fetchProjectStatus()     
      this.onFetchSheets = debounce(1000, this.onFetchSheets)   
    
  }

  getPMSmartSheetCode(projectManagerId) {
    const { projectMgrsList } = this.props;
    const selectedPM = _.find(projectMgrsList, item => item.id === projectManagerId);
    if (selectedPM) {
      return selectedPM.user.smartsheetCode
    }
    return null
  }

  onFetchSheets(postData) {
    const { fetchSheets } = this.props; 
    fetchSheets({ postData }) 
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
        this.props.clearSheets()
        projectData['sheet_id'] = ''
        if (code) {
          postData = {
            smartsheet_auth_code: code
          }
          this.onFetchSheets(postData)
        }
        break;
      }
      case 'smartsheet_auth_code':
        postData = {
          smartsheet_auth_code: val
        }
        this.onFetchSheets(postData) 
        break;
      case 'sheet_id':
        const sheet_id = val  
        const { fetchKeyDates } = this.props;
        const { smartsheet_auth_code } = this.state.projectData
        postData = { smartsheet_auth_code, sheet_id }
        if (smartsheet_auth_code && sheet_id) {
          fetchKeyDates({ postData })  
        }
        break  
      default:
        break
    }

    projectData[type] = val
    
    // const { contracted_email_invitees, contracted_kiosk_invitees, contracted_paper_invitees, contracted_paper_surveys } = this.state.projectData
    // let contracted_invitees = contracted_email_invitees !== undefined ? parseInt(contracted_email_invitees, 10):0
    // contracted_invitees += contracted_kiosk_invitees !== undefined ? parseInt(contracted_kiosk_invitees, 10):0
    // contracted_invitees += contracted_paper_invitees !== undefined ? parseInt(contracted_paper_invitees, 10):0
    // contracted_invitees += contracted_paper_surveys !== undefined ? parseInt(contracted_paper_surveys, 10):0
    
    // const { actual_email_invitees, actual_kiosk_invitees, actual_paper_invitees, actual_paper_surveys } = this.state.projectData
    // let actual_invitees = actual_email_invitees !== undefined ? parseInt(actual_email_invitees, 10):0
    // actual_invitees += actual_kiosk_invitees !== undefined ? parseInt(actual_kiosk_invitees, 10):0
    // actual_invitees += actual_paper_invitees !== undefined ? parseInt(actual_paper_invitees, 10):0
    // actual_invitees += actual_paper_surveys !== undefined ? parseInt(actual_paper_surveys, 10):0

    // projectData.contracted_invitees = parseInt(contracted_invitees, 10)
    // projectData.actual_invitees = parseInt(actual_invitees, 10)    
    this.setState({ projectData: Object.assign({}, projectData) })
  }    
  handleSubmit = () => {
    let { name } = this.state.projectData
    const project_nameTrimmed = name.replace(/\s/g, '')
    const errorStatus = project_nameTrimmed.length
    if ( errorStatus < 1) {
        this.setState({ errorStatus })        
    }
    else {
        this.submitInsertRequest();
    }
  }
  submitInsertRequest = () => {
    const { insertProject, keydatesList } = this.props
    const { sheet_id } = this.state.projectData

    let { projectData } = this.state
    projectData = Object.assign(projectData, keydatesList)
    projectData.sheet_id = sheet_id === undefined ? '' : sheet_id.toString()
    this.setState({ projectData });
    insertProject({ postData: projectData });
  }
  helderStringToDate(data) {
    if (data === null) return ''
    if (new Date(data) instanceof Date && !isNaN(new Date(data).valueOf())) 
    return new Date(data).toLocaleDateString()
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 2000);
  };

  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  };
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
    const { visible, confirmLoading } = this.state;
    return (
      <LayoutContentWrapper>
        <PageHeader>New Project</PageHeader>
        <Box>
          <Form>
            <Tabs defaultActiveKey="1">
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
                        defaultValue={{ key: 0 }}
                        onChange={(obj) =>{
                          this.onValueChange(obj.key, 'client_id')
                        }}
                      >
                          <Option value={0}>Please choose a client</Option>
                          {
                            clientsList !== undefined &&
                            clientsList.sort((a, b) =>{
                              if(a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
                              if(a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
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
                      validateStatus={ this.state.errorStatus > 0 ? "" : "error" }
                      help={ this.state.errorStatus > 0 ? "" : "It must be string contains at least one character" }
                    >
                      <Input 
                        size="default"
                        placeholder="Input New Project"
                        value={this.state.projectData.name}
                        onChange = { (e)=> this.onValueChange(e.target.value, 'name') }
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
                        value={this.state.projectData.survey_id}
                        onChange = { (e)=> this.onValueChange(e.target.value, 'survey_id') }
                        placeholder="Input Survery ID"
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
                        defaultValue={{ key: 0 }} 
                        onChange={(obj) =>{
                          this.onValueChange(obj.key, 'project_type_id')
                        }}
                      >
                          <Option value={0}>Please choose a type</Option>
                          {
                            projectTypesList !== undefined &&
                            projectTypesList.sort((a, b) =>{
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
                      style={styles.formItemMargin}
                      {...formItemLayout}
                      label="Sales Executive"
                    >
                      <Select
                        showSearch
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        labelInValue size="large" 
                        defaultValue={{ key: 0 }} 
                        onChange={(obj) =>{
                          this.onValueChange(obj.key, 'account_mgr_id')
                        }}
                      >
                          <Option value={0}>Please choose a sales executive</Option>
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
                      <Select
                        showSearch
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        labelInValue size="large" 
                        defaultValue={{ key: 0 }} 
                        onChange={(obj) =>{
                          this.onValueChange(obj.key, 'project_mgr_id')
                        }}
                      >
                          <Option value={0}>Please choose a manager</Option>
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
                        defaultValue={{ key: 0 }} 
                        onChange={(obj) =>{
                          this.onValueChange(obj.key, 'consultant_id')
                        }}
                      >
                          <Option value={0}>Please choose a consultant</Option>
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
                        value={this.state.projectData.data_manager}
                        onChange = { (e)=> this.onValueChange(e.target.value, 'data_manager') }            
                        placeholder="Input Data Manager"
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
                        value={this.state.projectData.revenue}
                        onChange = { (e)=> this.onValueChange(parseInt(e.target.value, 10) || 0, 'revenue') }
                        placeholder="Input Revenue"
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
                        size="large" defaultValue="" onChange={(value, label) => this.onValueChange(value, 'toolkit_id')}>
                        <Option value="">Please choose a toolkit tier</Option>
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
                      <Checkbox onChange={(e) => this.onValueChange(e.target.checked? 1:0, 'sso_id')}>SSO</Checkbox>
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
                        onChange={(date, dateString) => this.onValueChange(dateString, 'contracted_launch_date')} 
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
                        onChange={(date, dateString) => this.onValueChange(dateString, 'contract_expiration_date')}
                        format={dateFormatList}
                      />
                    </FormItem>
                  </Col>
                  <Col span={4}>
                    <FormItem
                      {...tailFormItemLayout}
                    >
                      <Checkbox onChange={(e) => this.onValueChange(e.target.checked? 1:0, 'final_survey_in_contract')}>Final Survey in Contract</Checkbox>
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
                        value={this.state.projectData.contracted_invitees}
                        onChange = { (e)=> {this.onValueChange(e.target.value, 'contracted_invitees')} }
                        placeholder="Contracted Survey Invitees"
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
                        value={this.state.projectData.contracted_paper_surveys}
                        onChange = { (e)=> this.onValueChange(parseInt(e.target.value, 10) || 0, 'contracted_paper_surveys') }               
                        placeholder="Contracted Paper Surveys"
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
                        value={this.state.projectData.contracted_email_invitees}
                        onChange = { (e)=> this.onValueChange(parseInt(e.target.value, 10) || 0, 'contracted_email_invitees') }                 
                        placeholder="Contracted Email Invitees"
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
                          value={this.state.projectData.contracted_dc_translations}
                          onChange = { (e)=> this.onValueChange(parseInt(e.target.value, 10) || 0, 'contracted_dc_translations') }               
                          placeholder="Contracted DC Translations"
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
                        size="default"   
                        value={this.state.projectData.contracted_kiosk_invitees}
                        onChange = { (e)=> this.onValueChange(parseInt(e.target.value, 10) || 0, 'contracted_kiosk_invitees') }              
                        placeholder="Contracted Kiosk Invitees"
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
                        value={this.state.projectData.contracted_report_users}
                        onChange = { (e)=> this.onValueChange(parseInt(e.target.value, 10) || 0, 'contracted_report_users') }          
                        placeholder="Contracted Report Users"
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
                        value={this.state.projectData.contracted_paper_invitees}
                        onChange = { (e)=> this.onValueChange(parseInt(e.target.value, 10) || 0, 'contracted_paper_invitees') }              
                        placeholder="Contracte Paper Invitees"
                      />
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...tailFormItemLayout}
                    >
                      <Checkbox checked={this.state.projectData.european_employees} onChange={(e) => this.onValueChange(e.target.checked? 1:0, 'european_employees')}>European Employees</Checkbox>
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
                        value={this.state.projectData.contracted_virtual_trainings}
                        onChange = { (e)=> this.onValueChange(parseInt(e.target.value, 10) || 0, 'contracted_virtual_trainings') }               
                        placeholder="Contracted Virtual Trainings"
                      />
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      style={styles.formItemMargin}
                      {...formItemLayout}
                      label="Contracted Onsite Trainings"
                    >
                      <Input 
                        size="default"     
                        value={this.state.projectData.contracted_onsite_trainings}
                        onChange = { (e)=> this.onValueChange(parseInt(e.target.value, 10) || 0, 'contracted_onsite_trainings') }            
                        placeholder="Contracted Onsite Trainings"
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem
                      style={styles.formItemMargin}
                      {...formItemLayout}
                      label="Contracted A2A Trainings"
                    >
                      <Input 
                        size="default" 
                        value={this.state.projectData.contracted_a2a_trainings}
                        onChange = { (e)=> this.onValueChange(parseInt(e.target.value, 10) || 0, 'contracted_a2a_trainings') }              
                        placeholder="Contracted A2A Trainings"
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
                        value={this.state.projectData.contracted_rpt_translations}
                        onChange = { (e)=> this.onValueChange(parseInt(e.target.value, 10) || 0, 'contracted_rpt_translations') }             
                        placeholder="Contracted Rpt Translations"
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
                        value={this.state.projectData.number_historical_uploads}
                        onChange = { (e)=> this.onValueChange(parseInt(e.target.value, 10) || 0, 'number_historical_uploads') }
                        placeholder="Number of Historical Surveys to Upload"
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
                        value={this.state.projectData.num_exec_decks}
                        onChange = { (e)=> this.onValueChange(parseInt(e.target.value, 10) || 0, 'num_exec_decks') }              
                        placeholder="Number of Exec Decks"
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
                        value={this.state.projectData.num_exec_interviews}
                        onChange = { (e)=> this.onValueChange(parseInt(e.target.value, 10) || 0, 'num_exec_interviews') }               
                        placeholder="Number of Exec Interviews"
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem
                      {...tailFormItemLayout}
                    >
                      <Checkbox onChange={(e) => this.onValueChange(e.target.checked? 1:0, 'onsite_pres_id')}>Onsite Pres</Checkbox>
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...tailFormItemLayout}
                    >
                      <Checkbox onChange={(e) => this.onValueChange(e.target.checked? 1:0, 'new_business_id')}>New Project</Checkbox>
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
                      size="large" defaultValue="" onChange={(value, label) => this.onValueChange(value, 'server_id')}>
                          <Option value="">Please choose a server</Option>
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
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem
                      style={styles.formItemMargin}
                      {...formItemLayout}
                      label="Project Notes/Comments"
                    >
                      <Textarea
                        value={this.state.projectData.project_notes}
                        onChange = { (e)=> {this.onValueChange(e.target.value, 'project_notes')} }
                        rows={6}
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
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} size="large" defaultValue="" onChange={(value) => this.onValueChange(value, 'sheet_id')}>
                      <Option value="">Please choose a sheet</Option>
                        {
                          sheets.length > 0 &&
                          sheets.sort((a, b) =>{
                            if(a.name < b.name) { return -1; }
                            if(a.name > b.name) { return 1; }
                            return 0;
                          }).map((item, i) => {
                              return <Option key={`sheets${i}`} value={item.id}>{item.id+' - '+item.name}</Option>
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
                      />
                    </FormItem>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Actual Project Info" key="4">
                <Row>
                  <Col span={12}>
                    <FormItem
                      style={styles.formItemMargin}
                      {...formItemLayout}
                      label="Actual Survey Invitees"
                    >
                      <Input 
                        size="default"
                        value={this.state.projectData.actual_invitees}
                        placeholder="Actual Survey Invitees"
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
                        value={this.state.projectData.actual_email_invitees}
                        onChange = { (e)=> this.onValueChange(parseInt(e.target.value, 10) || 0, 'actual_email_invitees') }                 
                        placeholder="Actual Email Invitees"
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
                        value={this.state.projectData.actual_kiosk_invitees}
                        onChange = { (e)=> this.onValueChange(parseInt(e.target.value, 10) || 0, 'actual_kiosk_invitees') }                 
                        placeholder="Actual Kiosk Invitees"
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
                        value={this.state.projectData.actual_paper_invitees}
                        onChange = { (e)=> this.onValueChange(parseInt(e.target.value, 10) || 0, 'actual_paper_invitees') }                 
                        placeholder="Actual Paper Invitees"
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
                        value={this.state.projectData.actual_paper_surveys}
                        onChange = { (e)=> this.onValueChange(parseInt(e.target.value, 10) || 0, 'actual_paper_surveys') }                 
                        placeholder="Actual Paper Surveys"
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
                        value={this.state.projectData.actual_dc_translations}
                        onChange = { (e)=> this.onValueChange(parseInt(e.target.value, 10) || 0, 'actual_dc_translations') }                 
                        placeholder="Actual DC Translations"
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
                        value={this.state.projectData.actual_report_users}
                        onChange = { (e)=> this.onValueChange(parseInt(e.target.value, 10) || 0, 'actual_report_users') }                 
                        placeholder="Actual Report Users"
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
                        value={this.state.projectData.actual_rpt_translations}
                        onChange = { (e)=> this.onValueChange(parseInt(e.target.value, 10) || 0, 'actual_rpt_translations') }                 
                        placeholder="Actual Rpt Translations"
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
                        value={this.state.projectData.actual_exec_interviews}
                        onChange = { (e)=> this.onValueChange(parseInt(e.target.value, 10) || 0, 'actual_exec_interviews') }                 
                        placeholder="Actual Exec Interviews"
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
                        value={this.state.projectData.actual_exec_decks}
                        onChange = { (e)=> this.onValueChange(parseInt(e.target.value, 10) || 0, 'actual_exec_decks') }                 
                        placeholder="Actual Exec Decks"
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
                        value={this.state.projectData.actual_exec_presentations}
                        onChange = { (e)=> this.onValueChange(parseInt(e.target.value, 10) || 0, 'actual_exec_presentations') }                 
                        placeholder="Actual Exec Presentations"
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
                        value={this.state.projectData.actual_virtual_trainings}
                        onChange = { (e)=> this.onValueChange(parseInt(e.target.value, 10) || 0, 'actual_virtual_trainings') }                 
                        placeholder="Actual Virtual Trainings"
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
                        value={this.state.projectData.actual_onsite_trainings}
                        onChange = { (e)=> this.onValueChange(parseInt(e.target.value, 10) || 0, 'actual_onsite_trainings') }                 
                        placeholder="Actual Onsite Trainings"
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
                      value={this.state.projectData.actual_a2a_trainings}
                      onChange = { (e)=> this.onValueChange(parseInt(e.target.value, 10) || 0, 'actual_a2a_trainings') }                 
                      placeholder="Actual A2A Trainings"
                    />
                  </FormItem>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Help Desk Info" key="3">
                <Row>
                  <Col span={12}>
                    <FormItem
                      style={styles.formItemMargin}
                      {...formItemLayout}
                      label="Primary Contact Name"
                    >
                      <Input 
                        size="default"
                        value={this.state.projectData.primary_contact}
                        onChange = { (e)=> this.onValueChange(e.target.value, 'primary_contact') }                 
                        placeholder="Primary Contact Name"
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
                        value={this.state.projectData.contact_email}
                        onChange = { (e)=> this.onValueChange(e.target.value, 'contact_email') }                 
                        placeholder="Email Address of Mail Contact"
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
                        defaultValue={0} onChange={(value, label) => this.onValueChange(value, 'contact_protocol_id')}>
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
                      <Checkbox onChange={(e) => this.onValueChange(e.target.checked? 1:0, 'require_auth')}>Require Auth Codes</Checkbox>
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...tailFormItemLayout}
                    >
                      <Checkbox onChange={(e) => this.onValueChange(e.target.checked? 1:0, 'ok_to_miss')}>Ok to miss questions</Checkbox>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem
                      {...tailFormItemLayout}
                    >
                      <Checkbox onChange={(e) => this.onValueChange(e.target.checked? 1:0, 'lock_survey')}>Lock Surveys when Complete</Checkbox>
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...tailFormItemLayout}
                    >
                      <Checkbox onChange={(e) => this.onValueChange(e.target.checked? 1:0, 'single_use_auth')}>Single Use Auth Codes</Checkbox>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem
                      {...tailFormItemLayout}
                    >
                      <Checkbox onChange={(e) => this.onValueChange(e.target.checked? 1:0, 'dc_sso')}>DC SSO</Checkbox>
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      style={styles.formItemMargin}
                      {...formItemLayout}
                      label="New Hire Cutoff Date"
                    >
                      <DatePicker 
                        onChange={(date, dateString) => this.onValueChange(dateString, 'hire_hire_cutoff')} 
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
                        value={this.state.projectData.dc_url}
                        onChange = { (e)=> this.onValueChange(e.target.value, 'dc_url') }
                        placeholder="DC URL"
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
                        value={this.state.projectData.dc_sso_url}
                        onChange = { (e)=> this.onValueChange(e.target.value, 'dc_sso_url') }
                        placeholder="DC URL(SSO)"
                      />
                    </FormItem>
                  </Col>
                </Row>
                
                
                <Row>
                  <Col span={12}>
                    <FormItem
                      {...tailFormItemLayout}
                    >
                      <Checkbox onChange={(e) => this.onValueChange(e.target.checked? 1:0, 'ok_to_send_auth_sso')}>If using SSO, ok to send Auth</Checkbox>
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...tailFormItemLayout}
                    >
                      <Checkbox onChange={(e) => this.onValueChange(e.target.checked? 1:0, 'ok_to_reopen')}>OK to reopen surveys</Checkbox>
                    </FormItem>
                  </Col>
                </Row>

                <Row>
                  <Col span={12}>
                    <FormItem
                      {...tailFormItemLayout}
                    >
                      <Checkbox onChange={(e) => this.onValueChange(e.target.checked? 1:0, 'kiosk')}>Kiosk</Checkbox>
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...tailFormItemLayout}
                    >
                      <Checkbox onChange={(e) => this.onValueChange(e.target.checked? 1:0, 'paper_surveys')}>Paper Surveys</Checkbox>
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
                        value={this.state.projectData.other_dc_notes}
                        onChange = { (e)=> this.onValueChange(e.target.value, 'other_dc_notes') }                 
                        placeholder="Other DC Notes"
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
                        value={this.state.projectData.report_url}
                        onChange = { (e)=> this.onValueChange(e.target.value, 'report_url') }                 
                        placeholder="Reporting URL"
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
                        value={this.state.projectData.report_sso_url}
                        onChange = { (e)=> this.onValueChange(e.target.value, 'report_sso_url') }                 
                        placeholder="Reporting URL(SSO)"
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
                        onChange={(e) => this.onValueChange(e.target.checked ? 1:0, 'ok_to_send_auth')}
                      >Okay to provide login credentials if SSO link is not working</Checkbox>
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
                        defaultValue={0} onChange={(value, label) => this.onValueChange(value, 'project_rating')}>
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
                        defaultValue="1" onChange={(value, label) => this.onValueChange(value, 'client_rating')}>
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
                        value={this.state.projectData.number_tickets}
                        onChange = { (e)=> this.onValueChange(parseInt(e.target.value, 10) || 0, 'number_tickets') }                 
                        placeholder="Number of Tickets Opened"
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
                        value={this.state.projectData.number_support_emails}
                        onChange = { (e)=> this.onValueChange(parseInt(e.target.value, 10) || 0, 'number_support_emails') }                 
                        placeholder="Number of Support Emails"
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
                        value={this.state.projectData.number_support_calls}
                        onChange = { (e)=> this.onValueChange(parseInt(e.target.value, 10) || 0, 'number_support_calls') }                 
                        placeholder="Number of Support Phone Calls"
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
                        value={this.state.projectData.dc_readonly_url}
                        onChange = { (e)=> this.onValueChange(e.target.value, 'dc_readonly_url') }                 
                        placeholder="DC ReadOnly URL"
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
                        value={this.state.projectData.custom_dev_notes}
                        onChange = { (e)=> this.onValueChange(e.target.value, 'custom_dev_notes') }                 
                        placeholder="Explain custom development"
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
                        value={this.state.projectData.other_notes}
                        onChange = { (e)=> this.onValueChange(e.target.value, 'other_notes') }                 
                        placeholder="Other Notes"
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
              <Button size='default' type="primary" onClick={() => this.handleSubmit()} disabled={loading}>
                Save  
              </Button>
              <Button size='default' onClick={this.showModal} style={styles.marginBtn}>
                Save as Template
              </Button>
              <Modal              
                title="Template"
                centered
                visible={visible}
                onOk={this.handleOk}
                confirmLoading={confirmLoading}
                onCancel={this.handleCancel}
              >
                <Row gutter={24}>
                  <Col span={8}/>
                  <Col span={8}>
                    <Select
                      showSearch
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      defaultValue={0} onChange={(value, label) => this.onValueChange(value, 'contact_protocol_id')}>
                        <Option value={0}>Template 1</Option>
                        <Option value={1}>Template 2</Option>
                        <Option value={2}>Template 3</Option>
                    </Select>
                  </Col>
                  <Col span={8} />
                </Row>
                
                
              </Modal>
              <Button size='default' style={styles.marginBtn}>
                <Link to="../projects">Cancel
                </Link>
              </Button>
            </FormItem>
          </Form>
        </Box>
      </LayoutContentWrapper>
    );
  }
}

AddNewProject.propTypes = {
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
        
        loading: state.Projects.loading,
        
        projectStatusList: state.ProjectStatus.projectStatusList,  
        serversList: state.Servers.serversList,   
        toolkitTiersList: state.ToolkitTiers.toolkitTiersList,                        
        howFoundPyxList: state.HowFoundPyx.howFoundPyxList,
        sheetsList: state.SmartSheet.sheetsList,    
        keydatesList: state.SmartSheet.keydatesList,
        currentUser: state.Auth.get('currentUser'),
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
        insertProject,
        fetchSheets,
        fetchKeyDates,
        clearSheets
    }
  )(AddNewProject);
