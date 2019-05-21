import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import Button from '../../components/uielements/button';
import Collapse from '../../components/uielements/collapse';
import PageHeader from '../../components/utility/pageHeader';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import TableDemoStyle from '../../config/TableView/demo.style';
import generateData from '../../config/TableView/generateData';
import { tableInfo } from './configs';
import { TableView } from '../../config/TableView/TableView';
import { InputSearch } from '../../components/uielements/input';
import projectActions from '../../redux/help_desk/actions';
import styles from '../../config/FormElements/form-styles'
import { Row, Col } from 'antd';
import { generateCSVFile } from '../../helpers/utility';

const { fetchProjects } = projectActions;
const Panel = Collapse.Panel;
const columns = ['name', 'projectManagerName', 'accountManagerName', 'relationshipManagerName',  'consultantName', 'clientName', 'projectTypeName', 'survey_id', 'revenue']
const allColumns = ['clientName', 'name', 'survey_id', 'project_type_id', 'accountManagerName', 'relationshipManagerName', 'projectManagerName', 'consultant_id', 'data_manager', 'revenue', 'toolkit_id', 'sso_id', 'contracted_launch_date', 'contract_expiration_date', 'final_survey_in_contract', 'contracted_invitees', 'contracted_paper_surveys', 'contracted_email_invitees', 'contracted_dc_translations', 'contracted_kiosk_invitees', 'contracted_report_users', 'contracted_paper_invitees', 'european_employees', 'contracted_virtual_trainings', 'contracted_a2a_trainings', 'contracted_onsite_trainings', 'contracted_rpt_translations', 'number_historical_uploads', 'num_exec_decks', 'num_exec_interviews', 'onsite_pres_id', 'server_id', 'new_business_id', 'sheet_id', 'project_kickoff_date', 'survey_launch_date', 'exec_first_draft_date', 'exec_presentation_date', 'project_close_date', 'project_team_training_date', 'question_final_date', 'online_survey_final_date', 'List.pilot_launch_date', 'final_data_date', 'ship_paper_date', 'manager_account_release_date', 'actual_invitees', 'actual_email_invitees', 'actual_kiosk_invitees', 'actual_paper_invitees', 'actual_paper_surveys', 'actual_dc_translations', 'actual_report_users', 'actual_rpt_translations', 'actual_exec_interviews', 'actual_exec_decks', 'actual_exec_presentations', 'actual_virtual_trainings', 'actual_onsite_trainings', 'actual_a2a_trainings', 'primary_contact', 'contact_email', 'contact_protocol_id', 'require_auth', 'ok_to_miss', 'lock_survey', 'single_use_auth', 'hire_hire_cutoff', 'dc_sso_url', 'ok_to_send_auth', 'ok_to_reopen', 'kiosk', 'paper_surveys', 'european_employees', 'alt_standard_reply', 'other_dc_notes', 'report_sso_url', 'project_rating', 'client_rating', 'number_tickets', 'number_support_emails', 'number_support_calls', 'dc_readonly_url', 'custom_dev_notes', 'other_notes', '']

const inputSearchStyle = {
  width: 200,
  margin: 5
}

class Projects extends Component {
  state = {
    search: '',
    searchTypes: {}
  }

  constructor(props) {
    super(props);

    this.renderTable = this.renderTable.bind(this);
    this.search = this.search.bind(this);
    this.searchAdvanced = this.searchAdvanced.bind(this);
    
  }

  componentWillMount() {
    const { fetchProjects } = this.props;
    fetchProjects();
  }

  getFilteredList = () => {
    const { projectsList } = this.props
    const { search, searchTypes } = this.state;
    let filteredList = projectsList;
    if (filteredList) {
      if (search.trim() !== '') {
        const keyword = search.toLowerCase();
        filteredList = filteredList.filter(item => {
          let ret = false;
          for(const c in columns) {
            const key = columns[c]
            if (_.get(item, key)) {
              const itemForColumn = (_.get(item, key) || '').toString()
              if (itemForColumn.toLowerCase().indexOf(keyword) >=0) {
                ret = true;
                break;
              }
            }
          }
          return ret;
        });
      } else {
        filteredList = filteredList.filter(item => {
          let ret = true;
          for(const c in columns) {
            const key = columns[c]
            if (searchTypes[columns[c]] && item[columns[c]]) {
              const searchKeyword = searchTypes[key].toString()
              const itemForColumn = (_.get(item, key) || '').toString()
              if (searchKeyword.trim() === '') continue
              if (itemForColumn.toLowerCase().indexOf(searchKeyword.toLowerCase()) < 0) {
                ret = false;
              }
            }
          }
          return ret
        });
      }
    }
    return filteredList
  }
  exportData = () => {
    const today = new Date().getTime()
    generateCSVFile(this.props.projectsList, allColumns, `Projects-${today}.csv`)
  }
  handleExportCell = record => {
    generateCSVFile([record], Object.keys(record), `Project-${record.name}.csv`)
  }
  renderTable() {
    const { match } = this.props
    const filteredList = this.getFilteredList()
    if (filteredList && filteredList.length > 0) {
      return <TableView 
        dataList={new generateData(filteredList.length, filteredList)}
        tableInfo={tableInfo}
        target={match.url}
        deleteCellShown={false} 
        exportCell={this.handleExportCell}
      />;      
    } else {
      return (
        <div style={{marginLeft: "10px"}} >
          <h3>No Result Found</h3>
        </div>
      );
    }
  }

  search(value) {
    this.setState({ search : value, searchTypes: {} });
  }

  searchAdvanced(type, val) {
    const { searchTypes } = this.state
    searchTypes[type] = val
    this.setState({ searchTypes: {
      ...searchTypes,
      [type]: val,
    }})
  }

  render() {
    const { search, searchTypes } = this.state;
    return (
      <LayoutContentWrapper>
        <PageHeader>Help Desk</PageHeader>
        <TableDemoStyle className="isoLayoutContent">
          {/*<Link to="./projects/add">*/}
            <Button size='default' type="primary" style={styles.addButton}>
            Add New
            </Button>
          {/*</Link>*/}
          <InputSearch
            placeholder="General Search"
            value={search}
            onChange={e=> this.search(e.target.value)}
            style={{ width:200, float: 'right', marginRight: '10px' }}
          />
          
          <Row type="flex" justify="space-between" align="top">
            <Col span={18}>
              <Collapse style={{margin: '10px'}} >
                <Panel header="Advanced Search" key="1">
                  <InputSearch
                    placeholder="Client Name"
                    value={searchTypes.client_name}
                    onChange={e => this.searchAdvanced(columns[4], e.target.value)}
                    style={{...inputSearchStyle}}
                  />
                  <InputSearch
                    placeholder="Project Manager Name"
                    value={searchTypes.projectManagerName}
                    onChange={e => this.searchAdvanced(columns[1], e.target.value)}
                    style={{...inputSearchStyle}}
                  />
                  <InputSearch
                    placeholder="Project Name"
                    value={searchTypes.name}
                    onChange={e => this.searchAdvanced(columns[0], e.target.value)}
                    style={{...inputSearchStyle}}
                  />
                  <InputSearch
                    placeholder="Survey ID"
                    value={searchTypes.survey_id}
                    onChange={e => this.searchAdvanced(columns[6], e.target.value)}
                    style={{...inputSearchStyle}}
                  />
                </Panel>
              </Collapse>
            </Col>
            <Col>
              <Button
                size='default'
                type="primary"
                style={styles.addButton}
                onClick={this.exportData}
              >
                Export
              </Button>
            </Col>
          </Row>

          { this.renderTable() }
        </TableDemoStyle>
      </LayoutContentWrapper>
    );
  }
}

Projects.propTypes = {
  projectsList: PropTypes.array,
  fetchProjects: PropTypes.func
}

export default connect(
  state => ({
    projectsList: state.Projects.projectsList
  }),
  { fetchProjects }
)(Projects);