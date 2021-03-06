import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Form from '../../components/uielements/form';
import PageHeader from '../../components/utility/pageHeader';
import Box from '../../components/utility/box';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import Select, { SelectOption } from '../../components/uielements/select';
import Button from '../../components/uielements/button';
import styles from '../../config/FormElements/form-styles'
import projectMgrActions from '../../redux/project_mgrs/actions';
import usersActions from '../../redux/users/actions';

const { insertProjectMgr } = projectMgrActions;
const { fetchUnassigned } = usersActions;

const Option = SelectOption;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
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
      span: 14,
      offset: 5
    }
  }
};

class AddNewManager extends React.Component {
  state = {
      singleManager: { id: 0 }
  }
  componentWillMount() {
    const { fetchUnassigned } = this.props;
    fetchUnassigned();
  }
  handleInputChange = (type, val) => {
    const  { singleManager } = this.state
    const { usersList } = this.props
    
    singleManager[type] = val
    if (type === 'id') {
      const unassignedUsers = usersList.filter((user) => user.id === val )
      if (unassignedUsers.length > 0)
        singleManager['username'] = unassignedUsers[0].username
    }
    this.setState({ singleManager })
  }
  handleSubmit = () => {
    const { id } = this.state.singleManager;
    if ( id > 0) {
        this.submitInsertRequest();
    }
  }
  submitInsertRequest = () => {
    const { insertProjectMgr } = this.props
    const { singleManager } = this.state
    insertProjectMgr({ postData: singleManager })
  }
  render() {
    const { usersList } = this.props
    const unassignedUsers = usersList
    return (
      <LayoutContentWrapper>
        <PageHeader>New Project Manager</PageHeader>
        <Box>
        <Form>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Project Manager Name"
          >
            <Select
              showSearch
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              size="large" placeholder="Please choose a manager from unassinged users" onChange={(value, label) => this.handleInputChange('id', value)}>
                {
                  unassignedUsers &&
                  unassignedUsers.sort((a, b) =>{
                    if(a.firstname < b.firstname) { return -1; }
                    if(a.firstname > b.firstname) { return 1; }
                    return 0;
                  }).map((item, i) => {
                    return <Option key={`option${i}`} value={item.id}>{`${item.firstname} ${item.lastname}`}</Option>
                  })                 
                }
            </Select>
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button size='default' type="primary" onClick={() => this.handleSubmit()}>
              Save
            </Button>
            <Link to="../project_managers">
                <Button style={styles.marginBtn}>
                  Cancel
                </Button>
            </Link>
          </FormItem>
        </Form>
        </Box>
      </LayoutContentWrapper>
    );
  }
}

AddNewManager.propTypes = {
  usersList: PropTypes.array,
  insertProjectMgr: PropTypes.func,
  fetchUnassigned: PropTypes.func
}

export default connect(
    state => ({
      usersList: state.Users.get('usersList').toJS()
    }),
    { insertProjectMgr, fetchUnassigned }
  )(AddNewManager);
