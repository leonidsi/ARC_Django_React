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
const { getUser, updateUser } = userActions;
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

class EditUser extends React.Component {
  state = {
      singleUser: {},
      errors: {}
  }
  constructor(props) {
    super(props)
    const { getUser } = props
    const postData = { index: props.match.params.id }
    getUser({ postData })
  }
  componentWillMount() {
    this.props.fetchRoles();
  }
  componentWillReceiveProps(props) {
    const { singleUser } = props
    this.setState({ singleUser: Object.assign({}, singleUser) })
  }

  handleInputChange = (type, val) => {
    const { singleUser } = this.state
    singleUser[type] = val
    if (type === 'roleId' && val !== 2) {
      singleUser['smartsheetCode'] = null
    }
    this.setState({ singleUser })
  }


  validateForm = () => {
    let { username, email } = this.state.singleUser;

    const nameTrimmed = username !== undefined && username !== null ? username.replace(/\s/g, ''):''

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

    this.setState( { errors });
    return isValid;
  }

  handleSubmit = () => {
    if (this.validateForm()) {
      this.submitUpdateRequest();
    }
  }

  submitUpdateRequest = () => {
    const { updateUser } = this.props
    updateUser({ postData: this.state.singleUser })
  }
  render() {
    const { errors, singleUser } = this.state
    const { rolesList, loading } = this.props;
    const defaultValue = singleUser.roleId || 1;
    return (
      <LayoutContentWrapper>
        <PageHeader>Edit User</PageHeader>
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
            label="Firstname"
            validateStatus={ errors['firstname'] ? 'error' : ''}
            help={ errors['firstname'] }
          >
            <Input 
              placeholder="Firstname"
              value={singleUser.firstname}
              type="text"
              onChange = { (e)=> this.handleInputChange('firstname', e.target.value) }
              id="firstname"  
            />
          </FormItem>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Lastname"
            validateStatus={ errors['lastname'] ? 'error' : ''}
            help={ errors['lastname'] }
          >
            <Input 
              placeholder="Lastname"
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
              size="small" placeholder="Select a role" value={defaultValue} onChange={(value, label) => this.handleInputChange('roleId', value)}>
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
            <Link to="../../users">
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

EditUser.propTypes = {
  rolesList: PropTypes.array,
  fetchRoles: PropTypes.func,
  getUser: PropTypes.func,
  updateUser: PropTypes.func,
  singleClient: PropTypes.object,
}

export default connect(
    state => ({
      rolesList: state.Roles.rolesList,
      singleUser: state.Users.get('singleUser').toJS(),
      loading: state.Users.get('loading')
    }),
    { fetchRoles, getUser, updateUser }
  )(EditUser);
