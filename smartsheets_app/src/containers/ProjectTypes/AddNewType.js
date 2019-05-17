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
import projectTypesActions from '../../redux/project_types/actions';

const { insertProjectType } = projectTypesActions;

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

class AddNewType extends React.Component {
  state = {
      newTypeName: '', 
      errorStatus: 1
  }
  handleInputChange = (newTypeName) => {
    this.setState({ newTypeName })
    this.setState({ errorStatus: 1 })
  }
  handleSubmit = () => {
    let { newTypeName } = this.state
    const newTypeNameTrimmed = newTypeName.replace(/\s/g, '')
    const errorStatus = newTypeNameTrimmed.length
    if ( errorStatus < 1) {
        this.setState({ errorStatus })        
    }
    else {
        this.submitInsertRequest();
    }
  }
  submitInsertRequest = () => {
    const { insertProjectType } = this.props
    const { newTypeName } = this.state
    const postData = { name: newTypeName}      
    insertProjectType({ postData })
    this.setState({newTypeName: ''})
  }
  render() {
    const { errorStatus, newTypeName } = this.state
    const { loading } = this.props

    return (
      <LayoutContentWrapper>
        <PageHeader>New Project Type</PageHeader>
        <Box>
        <Form>
          <FormItem
            style={styles.formItemMargin}
            {...formItemLayout}
            label="Project Type Name"
            validateStatus={ errorStatus > 0 ? "" : "error" }
            ref={(input) => { this.newTypeInput = input; }}  
            help={ errorStatus > 0 ? "" : "Project Type Name" }
          >
            <Input 
              placeholder="Input New Project Type"
              value={newTypeName}
              onChange = { (e)=> this.handleInputChange(e.target.value) }
              id="error"  
            />
          </FormItem>
          <FormItem {...tailFormItemLayout}>
                <Button size='default' type="primary" onClick={() => this.handleSubmit()} disabled={loading}>
                  Save
                </Button>
                <Link to="../project_types">
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

AddNewType.propTypes = {
  insertProjectType: PropTypes.func,
}

export default connect(
    state => ({
      loading: state.ProjectTypes.loading        
    }),
    { insertProjectType }
  )(AddNewType);
