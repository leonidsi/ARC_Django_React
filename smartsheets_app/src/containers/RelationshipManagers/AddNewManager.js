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
import relationshipMgrActions from '../../redux/relationship_mgrs/actions';
import usersActions from '../../redux/users/actions';

const { insertRelationshipMgr } = relationshipMgrActions;
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
    const singleManager = {}
    const { usersList } = this.props
    
    singleManager[type] = val
    const unassignedUsers = usersList.filter((user) => user.id === val )
    singleManager['username'] = unassignedUsers[0].username
    
    this.setState({ singleManager })
  }
  handleSubmit = () => {
    const { id } = this.state.singleManager;
    if ( id > 0) {
        this.submitInsertRequest();
    }
  }
  submitInsertRequest = () => {
    const { insertRelationshipMgr } = this.props
    const { singleManager } = this.state    
    insertRelationshipMgr({ postData: singleManager })
  }
  render() {
    const { usersList } = this.props
    console.log(this.props)
    const unassignedUsers = usersList
    return (
      <LayoutContentWrapper>
        <PageHeader>New Relation Manager</PageHeader>
        <Box>
        <Form>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Relation Manager Name"
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
            <Link to="../relationship_managers">
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
  insertRelationshipMgr: PropTypes.func,
  fetchUnassigned: PropTypes.func
}

export default connect(
    state => ({
      usersList: state.Users.get('usersList').toJS()
    }),
    { insertRelationshipMgr, fetchUnassigned }
  )(AddNewManager);


