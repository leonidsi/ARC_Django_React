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

const { insertConsultant } = consultantsActions;
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

class AddNewConsultant extends React.Component {
  state = {
    singleConsultant: { id: 0 }
  }
  componentWillMount() {
    const { fetchUnassigned } = this.props;
    fetchUnassigned();
  }
  handleInputChange = (type, val) => {
    const singleConsultant = {}
    const { usersList } = this.props
    singleConsultant[type] = val
    const unassignedUsers = usersList.filter((user) => user.id === val )
    singleConsultant['username'] = unassignedUsers[0].username
    this.setState({ singleConsultant })
  }
  handleSubmit = () => {
    const { id } = this.state.singleConsultant;
    if ( id > 0) {
      this.submitInsertRequest();
    }
  }
  submitInsertRequest = () => {
    const { insertConsultant } = this.props
    const { singleConsultant } = this.state    
    insertConsultant({ postData: singleConsultant })
  }
  render() {
    const { usersList } = this.props    
    const unassignedUsers = usersList
    return (
      <LayoutContentWrapper>
        <PageHeader>New Consultant</PageHeader>
        <Box>
        <Form>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Consultant Name"
          >
            <Select
              showSearch
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              size="large" placeholder="Please choose a consultant from unassinged users" onChange={(value, label) => this.handleInputChange('id', value)}>
                {
                  unassignedUsers && unassignedUsers.sort((a, b) =>{
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
            <Link to="../consultants">
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

AddNewConsultant.propTypes = {
  usersList: PropTypes.array,
  insertConsultant: PropTypes.func,
  fetchUnassigned: PropTypes.func
}

export default connect(
    state => ({
      usersList: state.Users.get('usersList').toJS()      
    }),
    { insertConsultant, fetchUnassigned }
)(AddNewConsultant);
