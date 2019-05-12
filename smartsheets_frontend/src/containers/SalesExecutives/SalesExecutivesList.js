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
import accountMgrsActions from '../../redux/account_mgrs/actions';
import styles from '../../config/FormElements/form-styles'
import { generateCSVFile } from '../../helpers/utility';

const { fetchAccountMgrs, deleteAccountMgr } = accountMgrsActions;
const columns = ['username', 'fullname']
class SalesExecutivesList extends Component {
  state = {
    search: ''
  }

  constructor(props) {
    super(props);

    this.renderTable = this.renderTable.bind(this);
    this.search = this.search.bind(this);
  }

  componentWillMount() {
    const { fetchAccountMgrs } = this.props;
    fetchAccountMgrs();
  }
  deleteCell = (record) => {
    const { deleteAccountMgr } = this.props;    
    const delInfo = { id: record.id, username: record.username }    
    deleteAccountMgr({ delInfo })
  }
  getFilteredList = () => {
    const { accountMgrsList } = this.props
    const { search } = this.state;

    let filteredList = accountMgrsList;
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
    generateCSVFile(this.getFilteredList(), columns, `SalesExecutive-${today}.csv`)
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
        <PageHeader>Sales Executives</PageHeader>
        <TableDemoStyle className="isoLayoutContent">
          <Link to="./sales_executives/add">
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

SalesExecutivesList.propTypes = {
  accountMgrsList: PropTypes.array,
  fetchAccountMgrs: PropTypes.func,
  deleteAccountMgr: PropTypes.func
}

export default connect(
  state => ({
    accountMgrsList: state.AccountMgrs.get('accountMgrsList').toJS()
  }),
  { fetchAccountMgrs, deleteAccountMgr }
)(SalesExecutivesList);

