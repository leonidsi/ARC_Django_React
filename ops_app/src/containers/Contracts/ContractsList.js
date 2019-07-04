import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from '../../components/uielements/button';
import Collapse from '../../components/uielements/collapse';
import DatePicker from '../../components/uielements/datePicker';
import PageHeader from '../../components/utility/pageHeader';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import TableDemoStyle from '../../config/TableView/demo.style';
import generateData from '../../config/TableView/generateData';
import { tableInfo } from './configs';
import { TableView } from '../../config/TableView/TableView';
import { InputSearch } from '../../components/uielements/input';
import contractsActions from '../../redux/contracts/actions';
import styles from '../../config/FormElements/form-styles'
import { Row, Col } from 'antd';
import { generateXLSXFile } from '../../helpers/utility';

const { fetchContracts, deleteContract } = contractsActions;
const Panel = Collapse.Panel;

const columns = ['contract_number', 'name', 'clientName', 'date_current_contract_signed', 'current_contract_term',
                 'total_contract_value', 'contract_type', 'extension_contract', 'annual_subscription', 'status',
                 'salesRepName', 'relationshipManagerName']
const inputSearchStyle = {
  width: 200,
  margin: 5
}
const dateFormatList = ["MM-DD-YYYY", "MM/DD/YYYY", "MM.DD.YYYY", "MMM DD YYYY"];

class ContractsList extends Component {
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
    const { fetchContracts } = this.props;
    fetchContracts();
  }  
  deleteCell = (record) => {
    const { deleteContract } = this.props;
    const delInfo = { index: record.id }
    deleteContract({ delInfo })
  }
  getFilteredList = () => {
    const { contractsList } = this.props
    const { search, searchTypes } = this.state;
    let filteredList = contractsList;
    if (search.trim() !== '') {
      const keyword = search.toLowerCase();
      filteredList = filteredList.filter(item => {
        let ret = false;
        for(const c in columns) {
          if (item[columns[c]]) {
            const itemForColumn = (item[columns[c]]).toString()
            if (itemForColumn.toLowerCase().indexOf(keyword) >=0) {
              ret = true;
              break;
            }
          } 
        }
        return ret;
      });
    } else {
      if (filteredList) {
        filteredList = filteredList.filter(item => {
          let ret = true;
          for(const c in columns) {
            if (searchTypes[columns[c]] && item[columns[c]]) {
              const searchKeyword = (searchTypes[columns[c]]).toString()
              const itemForColumn = (item[columns[c]]).toString()
              if (searchKeyword.trim() === '') continue;
              if (itemForColumn.toLowerCase().indexOf(searchKeyword.toLowerCase()) < 0) {
                ret = false;
              }
            }
          }
          return ret;
        });
      }
    }
    return filteredList;
  }
  exportData = () => {
    const today = new Date().getTime()
    if (this.props.contractsList != null) {
      generateXLSXFile(this.props.contractsList, columns, `Contracts-${today}.xlsx`)
    }
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
        <PageHeader>Contracts</PageHeader>
        <TableDemoStyle className="isoLayoutContent">
          <Link to="./contracts/add">
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
                    placeholder="Contract Name"
                    value={searchTypes.name}
                    onChange={e => this.searchAdvanced(columns[0], e.target.value)}
                    style={{...inputSearchStyle}}
                  />
                  <DatePicker 
                    placeholder="Contract Start Date"
                    onChange={(date, dateString) => this.searchAdvanced(columns[3], dateString)}  style={{...inputSearchStyle}}
                    format={dateFormatList}
                  />
                  <DatePicker 
                    placeholder="Contract End Date"
                    onChange={(date, dateString) => this.searchAdvanced(columns[4], dateString)}  style={{...inputSearchStyle}}
                    format={dateFormatList}
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

ContractsList.propTypes = {
  contractsList: PropTypes.array,
  fetchContracts: PropTypes.func,
  deleteContract: PropTypes.func,
  // naicsCodesList: PropTypes.array
}

export default connect(
  state => ({
    contractsList: state.Contracts.contractsList,
  }),
  { fetchContracts, deleteContract }
)(ContractsList);

