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
import consultantsActions from '../../redux/consultants/actions';
import usersActions from '../../redux/users/actions';

const { getConsultant, updateConsultant } = consultantsActions;
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

class EditConsultant extends React.Component {
  state = {
    singleConsultant: {}
  }
  constructor(props) {
    super(props)
    const { getConsultant } = props   
    const postData = { index: props.match.params.id }
    getConsultant({ postData })
  }
  componentWillReceiveProps(props) {
    const { singleConsultant } = props
    this.setState({ singleConsultant: Object.assign({}, singleConsultant) })
  }
  componentWillMount() {
    const { fetchUnassigned } = this.props;
    fetchUnassigned();
  }
  handleInputChange = (type, val) => {
    const { singleConsultant } = this.state
    if (type === 'user_id') {
        const { usersList } = this.props
        const unassignedUsers = usersList.filter((user) => user.id === val )
        singleConsultant['consultant_name'] = unassignedUsers[0].name
    }
    singleConsultant[type] = val
    this.setState({ singleConsultant })
  }
  handleSubmit = () => {
    this.submitUpdateRequest();
  }
  submitUpdateRequest = () => {
    const { updateConsultant, match } = this.props
    const { singleConsultant } = this.state
    singleConsultant.id = parseInt(match.params.id, 10)
    updateConsultant({ postData: singleConsultant, originConsultantId: this.props.singleConsultant.user_id })
  }
  render() {
    const { singleConsultant } = this.state    
    const { usersList } = this.props    
    const unassignedUsers = usersList.filter((user) => user.role_id === 0)    
    return (
      <LayoutContentWrapper>
        <PageHeader>Edit Consultant</PageHeader>
        <Box>
        {
          this.props.singleConsultant !== undefined && (
            <Form>
            <FormItem
                style={styles.formItemMargin}
                {...formItemLayout}
                label="Consultant Name"
            >
                <Select 
                  showSearch
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  size="large"
                  defaultValue={singleConsultant.user_id}
                  onChange={(value, label) => this.handleInputChange('user_id', value)}>
                    <Option value={singleConsultant.user_id} >{singleConsultant.consultant_name}</Option>
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
                <Link to="../../consultants">
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

EditConsultant.propTypes = {
  usersList: PropTypes.array,
  singleConsultant: PropTypes.object,
  getConsultant: PropTypes.func,
  updateConsultant: PropTypes.func,
  fetchUnassigned: PropTypes.func
}

export default connect(
    state => ({
      usersList: state.Users.get('usersList').toJS(),
      singleConsultant: state.Consultants.singleConsultant
    }),
    { getConsultant, updateConsultant, fetchUnassigned }
)(EditConsultant);
