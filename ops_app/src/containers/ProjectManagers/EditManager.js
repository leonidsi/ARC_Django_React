import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Form from '../../components/uielements/form';
import Input from '../../components/uielements/input';
import PageHeader from '../../components/utility/pageHeader';
import Box from '../../components/utility/box';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import Select, { SelectOption } from '../../components/uielements/select';
import Button from '../../components/uielements/button';
import styles from '../../config/FormElements/form-styles'
import projectMgrActions from '../../redux/project_mgrs/actions';
import usersActions from '../../redux/users/actions';

const { getProjectMgr, updateProjectMgr } = projectMgrActions;
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

class EditManager extends React.Component {
  state = {
    singleManager: {}
  }
  constructor(props) {
    super(props)
    const { getProjectMgr } = props   
    const postData = { index: props.match.params.id }
    getProjectMgr({ postData })
  }
  componentWillReceiveProps(props) {
    const { singleManager } = props
    this.setState({ singleManager: Object.assign({}, singleManager) })
  }
  componentWillMount() {
    const { fetchUnassigned } = this.props;
    fetchUnassigned();
  }
  handleInputChange = (type, val) => {
    const { singleManager } = this.state
    if (type === 'user_id') {
        const { usersList } = this.props
        const unassignedUsers = usersList.filter((user) => user.id === val )
        singleManager['project_mgr_name'] = unassignedUsers[0].name
    }
    singleManager[type] = val
    this.setState({ singleManager })
  }
  handleSubmit = () => {
    this.submitUpdateRequest();
  }
  submitUpdateRequest = () => {
    const { updateProjectMgr, match } = this.props
    const { singleManager } = this.state
    singleManager.id = parseInt(match.params.id, 10)
    updateProjectMgr({ postData: singleManager, originManagerId: this.props.singleManager.user_id })
  }
  render() {
    const { singleManager } = this.state
    const { usersList } = this.props
    const unassignedUsers = usersList.filter((user) => user.role_id === 0)
    return (
      <LayoutContentWrapper>
        <PageHeader>Edit Project Manager</PageHeader>
        <Box>
        {
          this.props.singleManager !== undefined && (
            <Form>
            <FormItem
                style={styles.formItemMargin}
                {...formItemLayout}
                label="Project Manager Name"
            >
                <Select
                  showSearch
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  size="large" 
                  defaultValue={singleManager.user_id}
                  onChange={(value, label) => {
                        this.handleInputChange('user_id', value)
                }}>
                    <Option value={singleManager.user_id} >{singleManager.project_mgr_name}</Option>
                    {
                    unassignedUsers !== undefined &&
                    unassignedUsers.sort((a, b) =>{
                      if(a.name < b.name) { return -1; }
                      if(a.name > b.name) { return 1; }
                      return 0;
                    }).map((item, i) => {
                        return <Option key={`option${i}`} value={item.id}>{item.name}</Option>
                        })                 
                    }
                </Select>
            </FormItem>
            <FormItem
                style={styles.formItemMargin}
                {...formItemLayout}
                label="Data Manager Name"
            >
                <Input 
                placeholder="Input Data Manager Name"
                value={singleManager.data_manager}
                onChange = { (e)=> this.handleInputChange('data_manager', e.target.value) }
                id="error"  
                />
            </FormItem>
            <FormItem
                style={styles.formItemMargin}
                {...formItemLayout}
                label="Location"
            >
                <Input 
                placeholder="Input Location"
                value={singleManager.location}
                onChange = { (e)=> this.handleInputChange('location', e.target.value) }
                id="error"  
                />
            </FormItem>
            <FormItem
                style={styles.formItemMargin}
                {...formItemLayout}
                label="Smartsheet Authcode"
            >
                <Input 
                placeholder="Input Smartsheet Auth Code"
                value={singleManager.smartsheet_auth_code}
                onChange = { (e)=> this.handleInputChange('smartsheet_auth_code', e.target.value) }
                id="error"  
                />
            </FormItem>
            <FormItem {...tailFormItemLayout}>
                <Button size='default' type="primary" onClick={() => this.handleSubmit()}>
                Save
                </Button>
                <Link to="../../project_managers">
                    <Button style={styles.marginBtn}>
                    Cancel
                    </Button>
                </Link>
            </FormItem>
            </Form>
            )
        }
        </Box>
      </LayoutContentWrapper>
    );
  }
}

EditManager.propTypes = {
  usersList: PropTypes.array,
  singleManager: PropTypes.object,  
  getProjectMgr: PropTypes.func,
  updateProjectMgr: PropTypes.func,
  fetchUnassigned: PropTypes.func  
}

export default connect(
    state => ({
      usersList: state.Users.get('usersList').toJS(),
      singleManager: state.ProjectMgrs.singleManager      
    }),
    { getProjectMgr, updateProjectMgr, fetchUnassigned }
)(EditManager);
