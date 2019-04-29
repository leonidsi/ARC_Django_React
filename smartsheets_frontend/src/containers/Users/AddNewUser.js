import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Form from '../../components/uielements/form';
import Input from '../../components/uielements/input';
import Select,  { SelectOption } from '../../components/uielements/select';
import PageHeader from '../../components/utility/pageHeader';
import Box from '../../components/utility/box';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import Button from '../../components/uielements/button';
import styles from '../../config/FormElements/form-styles'
import userActions from '../../redux/users/actions';
import roleActions from '../../redux/roles/actions';

const { insertUser } = userActions;
const { fetchRoles } = roleActions;

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
      offset: 6
    }
  }
};

class AddNewManager extends React.Component {
  state = {
      singleUser: {
        roleId: 1,
      },
      errors: {}
  }
  componentWillMount() {
    this.props.fetchRoles();
  }
  handleInputChange = (type, val) => {
    const { singleUser } = this.state
    singleUser[type] = val
    this.setState({ singleUser })
  }


  validateForm = () => {
    let { username, email, roleId } = this.state.singleUser;

    const nameTrimmed = username !== undefined ? username.replace(/\s/g, ''):''

    if (email === undefined) email = ''
    const regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const errors = {};
    let isValid = true;

    if (nameTrimmed.length < 1) {
      errors['username'] = 'Name can not be blank';
      isValid = false;
    }

    if (!regEmail.test(email)) {
      errors['email'] = 'Email format is not correct';
      isValid = false;
    }
    if (!roleId) {
      errors['role'] = 'Please select a role';
      isValid = false;
    }
    this.setState( { errors });
    return isValid;
  }

  handleSubmit = () => {
    if (this.validateForm()) {
      this.submitInsertRequest();
    }
  }

  submitInsertRequest = () => {
    const { insertUser } = this.props
    insertUser({ postData: this.state.singleUser })
  }
  render() {
    const { errors, singleUser } = this.state
    const { rolesList, loading } = this.props;
    const defaultValue = singleUser.roleId || 1;
    return (
      <LayoutContentWrapper>
        <PageHeader>New User</PageHeader>
        <Box>
        <Form>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Username"
            validateStatus={ errors['username'] ? 'error' : ''}
            help={ errors['username'] }
          >
            <Input 
              placeholder="Username"
              value={singleUser.username}
              type="text"
              onChange = { (e)=> this.handleInputChange('username', e.target.value) }
              id="username"  
            />
          </FormItem>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="First Name"
            validateStatus={ errors['firstname'] ? 'error' : ''}
            help={ errors['firstname'] }
          >
            <Input 
              placeholder="First Name"
              value={singleUser.firstname}
              type="text"
              onChange = { (e)=> this.handleInputChange('firstname', e.target.value) }
              id="firstname"  
            />
          </FormItem>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Last Name"
            validateStatus={ errors['lastname'] ? 'error' : ''}
            help={ errors['lastname'] }
          >
            <Input 
              placeholder="Last Name"
              value={singleUser.lastname}
              type="text"
              onChange = { (e)=> this.handleInputChange('lastname', e.target.value) }
              id="lastname"  
            />
          </FormItem>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Email"
            validateStatus={ errors['email'] ? 'error' : ''}
            help={ errors['email'] }
          >
            <Input
              placeholder="Email"
              value={singleUser.email}
              type="email"
              onChange = { (e)=> this.handleInputChange('email', e.target.value) }
              id="email"  
            />
          </FormItem>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Role"
            validateStatus={ errors['role'] ? 'error' : ''}
            help={ errors['role'] }
          >
            <Select
              showSearch
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              size="small"
              placeholder="Select a role"
              value={defaultValue}
              onChange={(value, label) => this.handleInputChange('roleId', value, label)}
            >
                {
                  rolesList &&
                  rolesList.sort((a, b) =>{
                    if(a.name < b.name) { return -1; }
                    if(a.name > b.name) { return 1; }
                    return 0;
                  }).map((item, i) => {
                      return <SelectOption key={`role-option-${i}`} value={item.id}>{item.name}</SelectOption>
                    })
                }
            </Select>
          </FormItem>
          {
            // if PM is selected
            singleUser.roleId === 2 && (
              <FormItem
                style={styles.formItemMargin}
                {...formItemLayout}
                label="SmartSheet Code"
              >
                <Input
                  placeholder="Enter SmartSheet code"
                  value={singleUser.smartsheetCode}
                  type="text"
                  onChange = { (e)=> this.handleInputChange('smartsheetCode', e.target.value) }
                  id="smartsheetCode"  
                />
              </FormItem>
            )
          }
          <FormItem {...tailFormItemLayout}>
            <Button size='default' type="primary" onClick={() => this.handleSubmit()} disabled={loading}>
                Save
            </Button>
            <Link to="../users">
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
  rolesList: PropTypes.array,
  fetchRoles: PropTypes.func,  
  insertUser: PropTypes.func
}
export default connect(
    state => ({
      rolesList: state.Roles.rolesList,
      loading: state.Users.get('loading')
    }),
    { fetchRoles, insertUser }
  )(AddNewManager);
