import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Form from '../../components/uielements/form';
import Input from '../../components/uielements/input';
import PageHeader from '../../components/utility/pageHeader';
import Box from '../../components/utility/box';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import Button from '../../components/uielements/button';
import styles from '../../config/FormElements/form-styles'
import projectStatusActions from '../../redux/project_status/actions';

const { insertProjectStatus } = projectStatusActions;

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

class AddNewStatus extends React.Component {
  state = {
      newStatusName: '', 
      errorStatus: 1
  }
  handleInputChange = (newStatusName) => {
    this.setState({ newStatusName })
    this.setState({ errorStatus: 1 })
  }
  handleSubmit = () => {
    let { newStatusName } = this.state
    const newStatusNameTrimmed = newStatusName.replace(/\s/g, '')
    const errorStatus = newStatusNameTrimmed.length
    if ( errorStatus < 1) {
        this.setState({ errorStatus })        
    }
    else {
        this.submitInsertRequest();
    }
  }
  submitInsertRequest = () => {
    const { insertProjectStatus } = this.props
    const { newStatusName } = this.state
    const postData = { name: newStatusName}
    insertProjectStatus({ postData })
  }
  render() {
    const { errorStatus, newStatusName } = this.state
    return (
      <LayoutContentWrapper>
        <PageHeader>New Project Status</PageHeader>
        <Box>
        <Form>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Project Status Name"
            validateStatus={ errorStatus > 0 ? "" : "error" }
            ref={(input) => { this.newStatusInput = input; }}  
            help={ errorStatus > 0 ? "" : "Project Status Name" }
          >
            <Input 
              placeholder="Input New Project Status"
              value={newStatusName}
              onChange = { (e)=> this.handleInputChange(e.target.value) }
              id="error"  
            />
          </FormItem>
          <FormItem {...tailFormItemLayout}>
                <Button size='default' type="primary" onClick={() => this.handleSubmit()}>
                  Save
                </Button>
                <Link to="../project_status">
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

AddNewStatus.propTypes = {
  insertProjectStatus: PropTypes.func,
}

export default connect(
    state => ({
    }),
    { insertProjectStatus }
  )(AddNewStatus);
