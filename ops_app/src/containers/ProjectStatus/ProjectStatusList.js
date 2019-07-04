import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from '../../components/uielements/button';
import PageHeader from '../../components/utility/pageHeader';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import TableDemoStyle from '../../config/TableView/demo.style';
import generateData from '../../config/TableView/generateData';
import { tableInfo } from './configs';
import { TableView } from '../../config/TableView/TableView';
import { InputSearch } from '../../components/uielements/input';
import projectStatusActions from '../../redux/project_status/actions';
import styles from '../../config/FormElements/form-styles'
import { generateXLSXFile } from '../../helpers/utility';

const { fetchProjectStatus, deleteProjectStatus } = projectStatusActions;
const columns = ['name' ]

class ProjectStatusList extends Component {
  state = {
    search: ''
  }

  constructor(props) {
    super(props);

    this.renderTable = this.renderTable.bind(this);
    this.search = this.search.bind(this);
  }

  componentWillMount() {
    const { fetchProjectStatus } = this.props;
    fetchProjectStatus();
  }
  deleteCell = (record) => {
    const { deleteProjectStatus } = this.props;    
    const delInfo = { index: record.id }
    deleteProjectStatus({ delInfo })
  }
  getFilteredList = () => {
    const { projectStatusList } = this.props
    const { search } = this.state;

    let filteredList = projectStatusList;
    if (search.trim() !== '') {
      const keyword = search.toLowerCase();
      filteredList = filteredList.filter(item => {
        let ret = false;
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
    generateXLSXFile(this.getFilteredList(), columns, `Project-${today}.xlsx`)
  }
  renderTable() {
    const { match } = this.props
    const filteredList = this.getFilteredList()
    if (filteredList && filteredList.length > 0) {
      return <TableView 
        dataList={new generateData(filteredList.length, filteredList)}
        tableInfo={tableInfo}
        target={match.url} 
        deleteCell={index => this.deleteCell(index)}
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
        <PageHeader>Project Status</PageHeader>
        <TableDemoStyle className="isoLayoutContent">
          <Link to="./project_status/add">
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

ProjectStatusList.propTypes = {
  projectStatusList: PropTypes.array,
  fetchProjectStatus: PropTypes.func,
  deleteProjectStatus: PropTypes.func
}

export default connect(
  state => ({
    projectStatusList: state.ProjectStatus.projectStatusList
  }),
  { fetchProjectStatus, deleteProjectStatus }
)(ProjectStatusList);

