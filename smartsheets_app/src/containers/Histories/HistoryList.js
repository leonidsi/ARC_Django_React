import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import PageHeader from '../../components/utility/pageHeader';
import TableDemoStyle from '../../config/TableView/demo.style';
import generateData from '../../config/TableView/generateData';
import { tableInfo } from './configs';
import { TableView } from '../../config/TableView/TableView';
import usersActions from '../../redux/users/actions';
import otherProviderActions from '../../redux/other_providers/actions';
import projectActions from '../../redux/projects/actions';
import Tabs, { TabPane }  from '../../components/uielements/tabs';
import { Row, Col } from 'antd';

const { fetchUsers } = usersActions;
const { fetchOtherProviderHistories } = otherProviderActions
const { fetchProjectHistories } = projectActions

class HistoryLists extends Component {

  constructor(props) {
    super(props);
    this.state = {
      projectAddHistoriesList: [],
      projectUpdateHistoriesList: [],
      projectDeleteHistoriesList: [],
      otherProviderAddHistoriesList: [],
      otherProviderUpdateHistoriesList: [],
      otherProviderDeleteHistoriesList: [],
    };
    this.renderTable = this.renderTable.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.projectHistoriesList !== undefined && this.props.projectHistoriesList !== nextProps.projectHistoriesList) {
      let projectAddHistoriesList = [];
      let projectUpdateHistoriesList = [];
      let projectDeleteHistoriesList = [];

      nextProps.projectHistoriesList.forEach((obj) => {
        if(obj.type === "+") {
          projectAddHistoriesList.push(obj);
        } else if(obj.type === "-") {
          projectUpdateHistoriesList.push(obj);
        } else if (obj.type === "~") {
          projectDeleteHistoriesList.push(obj);
        }
      });

      this.setState({
        projectAddHistoriesList: projectAddHistoriesList,
        projectUpdateHistoriesList: projectUpdateHistoriesList,
        projectDeleteHistoriesList: projectDeleteHistoriesList,
      });
    }

    if(nextProps.otherProviderHistoriesList !== undefined && this.props.otherProviderHistoriesList !== nextProps.otherProviderHistoriesList) {
      let otherProviderAddHistoriesList = [];
      let otherProviderUpdateHistoriesList = [];
      let otherProviderDeleteHistoriesList = [];

      nextProps.otherProviderHistoriesList.forEach((obj) => {
        if(obj.type === "+") {
          otherProviderAddHistoriesList.push(obj);
        } else if(obj.type === "-") {
          otherProviderUpdateHistoriesList.push(obj);
        } else if (obj.type === "~") {
          otherProviderDeleteHistoriesList.push(obj);
        }
      });

      this.setState({
        otherProviderAddHistoriesList: otherProviderAddHistoriesList,
        otherProviderUpdateHistoriesList: otherProviderUpdateHistoriesList,
        otherProviderDeleteHistoriesList: otherProviderDeleteHistoriesList,
      });
    }
  }

  componentWillMount() {
    const { fetchUsers, fetchOtherProviderHistories, fetchProjectHistories } = this.props;
    fetchUsers();
    fetchOtherProviderHistories();
    fetchProjectHistories();
  }

  renderTable(tableList) {
    const { match } = this.props
    if(tableList && tableList.length > 0){
      return <TableView 
        dataList={new generateData(tableList.length, tableList)}
        tableInfo={tableInfo}
        target={match.url}
        deleteCellShown={false} 
        editCellShown={false}
      />;      
    } else {
      return (
        <div style={{marginLeft: "10px"}} >
          <h3>No Result Found</h3>
        </div>
      );
    }
  }

  render() {
    const {usersList, otherProviderHistoriesList, projectHistoriesList} =  this.props

    return (
      <LayoutContentWrapper>
        <PageHeader>History</PageHeader>
        <TableDemoStyle className="isoLayoutContent">
          <Tabs defaultActiveKey="1">
            <TabPane tab="Add" key="1">
              <Row>
                <Col span={12}>
                  { this.renderTable(this.state.projectAddHistoriesList) }
                </Col>
                <Col span={12}>
                  { this.renderTable(this.state.otherProviderAddHistoriesList) }
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Update" key="2">
              <Row>
                <Col span={12}>
                  { this.renderTable(this.state.projectUpdateHistoriesList) }
                </Col>
                <Col span={12}>
                  { this.renderTable(this.state.otherProviderUpdateHistoriesList) }
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Delete" key="3">
              <Row>
                <Col span={12}>
                  { this.renderTable(this.state.projectDeleteHistoriesList) }
                </Col>
                <Col span={12}>
                  { this.renderTable(this.state.otherProviderDeleteHistoriesList) }
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </TableDemoStyle>
      </LayoutContentWrapper>
    );
  }
}

HistoryLists.propTypes = {
  usersList: PropTypes.array,
  otherProviderHistoriesList: PropTypes.array,
  projectHistoriesList: PropTypes.array,
}

export default connect(
  state => ({
    usersList: state.Users.get('usersList').toJS(),
    otherProviderHistoriesList: state.OtherProviders.otherProviderHistoriesList,
    projectHistoriesList: state.Projects.projectHistoriesList,
  }),
  { fetchUsers, fetchOtherProviderHistories, fetchProjectHistories }
)(HistoryLists);

