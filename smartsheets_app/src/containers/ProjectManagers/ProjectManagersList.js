import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from '../../components/uielements/button';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import PageHeader from '../../components/utility/pageHeader';
import TableDemoStyle from '../../config/TableView/demo.style';
import generateData from '../../config/TableView/generateData';
import { tableInfo } from './configs';
import { TableView } from '../../config/TableView/TableView';
import { InputSearch } from '../../components/uielements/input';
import projectMgrsActions from '../../redux/project_mgrs/actions';
import styles from '../../config/FormElements/form-styles'
import { generateXLSXFile } from '../../helpers/utility';

const { fetchProjectMgrs, deleteProjectMgr } = projectMgrsActions;
const columns = ['username', 'fullname']

class ProjectManagerLists extends Component {
  state = {
    search: ''
  }

  constructor(props) {
    super(props);

    this.renderTable = this.renderTable.bind(this);
    this.search = this.search.bind(this);
  }

  componentWillMount() {
    const { fetchProjectMgrs } = this.props;
    fetchProjectMgrs();
  }
  deleteCell = (record) => {
    const { deleteProjectMgr } = this.props;
    const delInfo = { id: record.id, username: record.username }    
    deleteProjectMgr({ delInfo })
  }
  getFilteredList = () => {
    const { projectMgrsList } = this.props
    const { search } = this.state;

    let filteredList = projectMgrsList;
    if (search.trim() !== '') {
      const keyword = search.toLowerCase();
      filteredList = filteredList.filter(item => {
        let ret = false
        for(const c in columns) {
          if (item[columns[c]] && item[columns[c]].toLowerCase().indexOf(keyword) >=0){
            ret = true;
            break;
          }
        }
        return ret;
      });
    } 
    return filteredList
  }
  exportData = () => {
    const today = new Date().getTime()
    generateXLSXFile(this.getFilteredList(), columns, `ProjectManagers-${today}.xlsx`)
  }

  renderTable() {
    const { match } = this.props
    const filteredList = this.getFilteredList()
    if (filteredList && filteredList.length > 0) {
      return <TableView 
        dataList={new generateData(filteredList.length, filteredList)}
        tableInfo={tableInfo} 
        target={match.url}
        editCellShown={false}
        deleteCell={record => this.deleteCell(record)}
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
    this.setState({ search : value });
  }

  render() {
    const { search } = this.state;
    return (
      <LayoutContentWrapper>
        <PageHeader>Project Managers</PageHeader>
        <TableDemoStyle className="isoLayoutContent">
          <Link to="./project_managers/add">
            <Button size='default' type="primary" style={styles.addButton}>
              Add New
            </Button>
          </Link>
          <InputSearch
            placeholder="General Search"
            value={search}
            onChange={e=> this.search(e.target.value)}
            style={{ width:200, float: 'right', marginRight: '10px' }}
          />
          <Button
            size='default'
            type="primary"
            style={styles.addButton}
            onClick={this.exportData}
          >
            Export
          </Button>
          { this.renderTable() }
        </TableDemoStyle>
      </LayoutContentWrapper>
    );
  }
}

ProjectManagerLists.propTypes = {
  projectMgrsList: PropTypes.array,
  fetchProjectMgrs: PropTypes.func,
  deleteProjectMgr: PropTypes.func
}

export default connect(
  state => ({
    projectMgrsList: state.ProjectMgrs.get('projectMgrsList').toJS()
  }),
  { fetchProjectMgrs, deleteProjectMgr }
)(ProjectManagerLists);

