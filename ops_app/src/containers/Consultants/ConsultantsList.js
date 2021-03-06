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
import consultantsActions from '../../redux/consultants/actions';
import styles from '../../config/FormElements/form-styles'
import { generateXLSXFile } from '../../helpers/utility';

const { fetchConsultants, deleteConsultant } = consultantsActions;
const columns = ['username', 'fullname']

class ConsultantsList extends Component {
  state = {
    search: ''
  }

  constructor(props) {
    super(props);

    this.renderTable = this.renderTable.bind(this);
    this.search = this.search.bind(this);
  }

  componentWillMount() {
    const { fetchConsultants } = this.props;
    fetchConsultants();
  }
  deleteCell = (record) => {
    const { deleteConsultant } = this.props;  
    const delInfo = { id: record.id, username: record.username }    
    deleteConsultant({ delInfo })
  }
  getFilteredList = () => {
    const { consultantsList } = this.props
    const { search } = this.state;

    let filteredList = consultantsList;
    if (search.trim() !== '') {
      const keyword = search.toLowerCase();
      filteredList = filteredList.filter(item => {
        const columns = ['username', 'fullname' ]
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
    generateXLSXFile(this.getFilteredList(), columns, `Consultants-${today}.xlsx`)
  }

  renderTable() {
    const { match } = this.props
    let filteredList = this.getFilteredList()
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
        <PageHeader>Consultants</PageHeader>
        <TableDemoStyle className="isoLayoutContent">
          <Link to="./consultants/add">
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

ConsultantsList.propTypes = {
  consultantsList: PropTypes.array,
  fetchConsultants: PropTypes.func,
  deleteConsultant: PropTypes.func
}

export default connect(
  state => ({
    consultantsList: state.Consultants.get('consultantsList').toJS()
  }),
  { fetchConsultants, deleteConsultant }
)(ConsultantsList);

