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
import relationshipMgrActions from '../../redux/relationship_mgrs/actions'
import usersActions from '../../redux/users/actions';

const { getRelationshipMgr, updateRelationshipMgr } = relationshipMgrActions;
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
    const { getRelationshipMgr } = props   
    const postData = { index: props.match.params.id }
    getRelationshipMgr({ postData })
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
        singleManager['relationship_mgr_name'] = unassignedUsers[0].name
    }
    singleManager[type] = val
    this.setState({ singleManager })
  }
  handleSubmit = () => {
    this.submitUpdateRequest();    
  }
  submitUpdateRequest = () => {
    const { updateRelationshipMgr, match } = this.props
    const { singleManager } = this.state
    singleManager.id = parseInt(match.params.id, 10)
    updateRelationshipMgr({ postData: singleManager, originManagerId: this.props.singleManager.user_id })
  }
  render() {
    const { singleManager } = this.state    
    const { usersList } = this.props    
    const unassignedUsers = usersList.filter((user) => user.role_id === 0)    
    return (
      <LayoutContentWrapper>
        <PageHeader>Edit Relationship Manager</PageHeader>
        <Box>
        {
          this.props.singleManager !== undefined && (
            <Form>
            <FormItem
                style={styles.formItemMargin}
                {...formItemLayout}
                label="Relationship Manager Name"
            >
                <Select
                  showSearch
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  size="large" 
                  defaultValue={singleManager.user_id}
                  onChange={(value, label) => this.handleInputChange('user_id', value)}>
                    <Option value={singleManager.user_id} >{singleManager.relationship_mgr_name}</Option>
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
            <FormItem {...tailFormItemLayout}>
                <Button size='default' type="primary" onClick={() => this.handleSubmit()}>
                Save
                </Button>
                <Link to="../../sales_executives">
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
  getRelationshipMgr: PropTypes.func,  
  updateRelationshipMgr: PropTypes.func,
  fetchUnassigned: PropTypes.func
}

export default connect(
    state => ({
      usersList: state.Users.get('usersList').toJS(),
      singleManager: state.RelationshipMgrs.singleManager        
    }),
    { getRelationshipMgr, updateRelationshipMgr, fetchUnassigned }
  )(EditManager);


