import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from '../../components/uielements/button';
import Collapse from '../../components/uielements/collapse';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import PageHeader from '../../components/utility/pageHeader';
import TableDemoStyle from '../../config/TableView/demo.style';
import generateData from '../../config/TableView/generateData';
import { tableInfo } from './configs';
import { TableView } from '../../config/TableView/TableView';
import { InputSearch } from '../../components/uielements/input';
import usersActions from '../../redux/users/actions';
import styles from '../../config/FormElements/form-styles'
import { Row, Col } from 'antd';
import { generateCSVFile } from '../../helpers/utility';

const { fetchUsers, deleteUser } = usersActions;
const Panel = Collapse.Panel;
const columns = ['username', 'firstname', 'lastname', 'email', 'role', 'smartsheetCode']
const inputSearchStyle = {
  width: 200,
  margin: 5
}

class UserLists extends Component {
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
    const { fetchUsers } = this.props;
    fetchUsers();
  }
  deleteCell = (record) => {
    const { deleteUser } = this.props;    
    const delInfo = record
    deleteUser({ delInfo })
  }
  getFilteredList = () => {
    const { usersList } = this.props
    const { search, searchTypes } = this.state;

    let filteredList = usersList;
    if (search.trim() !== '') {
      const keyword = search.toLowerCase();
      filteredList = usersList.filter(user => {
        return user.email.toLowerCase().indexOf(keyword) >=0 || user.username.toLowerCase().indexOf(keyword) >=0 || (user.role && user.role.toLowerCase().indexOf(keyword) >=0)
      });
    } else {
      if (filteredList) {
        filteredList = filteredList.filter(item => {
          let ret = true;
          for(const c in columns) {
            if (searchTypes[columns[c]] && item[columns[c]]) {
              const searchKeyword = (searchTypes[columns[c]]).toString()
              const itemForColumn = (item[columns[c]]).toString()
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
    generateCSVFile(this.getFilteredList(), columns, `Project-${today}.csv`)
  }

  renderTable() {
    const { match } = this.props
    let filteredList = this.getFilteredList();
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
    this.setState({ search : value, searchTypes: {} });
  }

  searchAdvanced(type, val) {
    const { searchTypes } = this.state
    searchTypes[type] = val
    this.setState({ searchTypes, search : '' })
  }

  render() {
    const { search, searchTypes } = this.state;
    return (
      <LayoutContentWrapper>
        <PageHeader>Users</PageHeader>
        <TableDemoStyle className="isoLayoutContent">
          <Link to="./users/add">
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
          <Row type="flex" justify="space-between" align="top">
            <Col span={18}>
              <Collapse style={{margin: '10px'}} >
                <Panel header="Advanced Search" key="1">
                  <InputSearch
                    placeholder="User Name"
                    value={searchTypes.username}
                    onChange={e => this.searchAdvanced(columns[0], e.target.value)}
                    style={{...inputSearchStyle}}
                  />
                  <InputSearch
                    placeholder="Email Address"
                    value={searchTypes.email}
                    onChange={e => this.searchAdvanced(columns[3], e.target.value)}
                    style={{...inputSearchStyle}}
                  />
                  <InputSearch
                    placeholder="Role"
                    value={searchTypes.role}
                    onChange={e => this.searchAdvanced(columns[4], e.target.value)}
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

UserLists.propTypes = {
  usersList: PropTypes.array,
  fetchUsers: PropTypes.func,
  deleteUser: PropTypes.func
}

export default connect(
  state => ({
    usersList: state.Users.get('usersList').toJS()
  }),
  { fetchUsers, deleteUser }
)(UserLists);

